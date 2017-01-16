import ast
import json
import logging
import re
import requests
import time
import xml.etree.ElementTree as ET

from django.http import HttpResponse, HttpResponseServerError, JsonResponse
from django.shortcuts import render
#from georss.Client import Client as GeoRssClient
from lxml import html
from opensearch.Client import Client
from StringIO import StringIO
from xml.dom import minidom

from .tasks import download_to_vrc

logger = logging.getLogger( __name__ )
#logging.basicConfig( level = logging.DEBUG )

def repoinit( request ):
    try:
        mode = request.GET[ 'dMode' ]
        repository = request.GET[ 'dRep' ]
        repository_endp = request.GET[ 'dRepEndP' ] if 'dRepEndP' in request.GET else None
        repository_desx = request.GET[ 'dRepDesX' ] if 'dRepDesX' in request.GET else None

        c = Client( repository_endp, repository_desx, mode )

        return JsonResponse( c.url_template_params )
    except:
        logger.error( 'Error during Discovery Widget initialization.' )
        return HttpResponseServerError( 'Error during Discovery Widget initialization.' )

def search( request ):
    try:
        # Mode: collection | results
        mode = request.GET[ 'dMode' ]
        # Number of the Start Record (string to dictionary)
        custom_start_params = ast.literal_eval( request.GET[ 'dCustomStart' ] ) if 'dCustomStart' in request.GET else {}
        # Search Terms
        search_terms = request.GET[ 'dSearchTerms' ]
        # Repository Endpoint
        repository_endp = request.GET[ 'dRepEndP' ] if 'dRepEndP' in request.GET else None
        # Repository description.xml
        repository_desx = request.GET[ 'dRepDesX' ] if 'dRepDesX' in request.GET else None
        # Form Parameters
        form = request.GET[ 'dForm' ].replace( '%3A', ':' ).replace( '%2F', '/' ) #.replace( '_', ':' )
        form_fields = { x.split( '=' )[ 0 ].replace( 'd-', '' ) : x.split( '=' )[ 1 ] for x in form.split( '&' ) }
        # Formatted Start Date TODO after template retriving?
        if form_fields[ 'time_start' ]:
            form_fields[ 'time_start' ] = time.strftime( "%Y-%m-%dT%H:%M:%S.000000%Z", time.strptime( form_fields[ 'time_start' ], "%d/%m/%Y+%H:%M:%S" ) )
        #    startDateFormatted2 = time.strftime("%Y-%m-%dT%H%M%S%Z", time.strptime(startDate, "%d/%m/%Y %H:%M:%S"))
        # Formatted End Date TODO after template retriving?
        if form_fields[ 'time_end' ]:
            form_fields[ 'time_end' ] = time.strftime( "%Y-%m-%dT%H:%M:%S.000000%Z", time.strptime( form_fields[ 'time_end' ], "%d/%m/%Y+%H:%M:%S" ) )
        #    stopDateFormatted2 = time.strftime("%Y-%m-%dT%H%M%S%Z", time.strptime(stopDate, "%d/%m/%Y %H:%M:%S"))

        logger.debug( 'Search Parameters:' )
        logger.debug( '  Mode:\t "%s"' % mode )
        logger.debug( '  Custom Start Params:\t "%s"' % custom_start_params )
        logger.debug( '  Repository Endpoint:\t "%s"' % repository_endp )
        logger.debug( '  Repository description.xml:\t "%s"' % repository_desx )
        logger.debug( '  Search Terms:\t "%s"' % search_terms )
        logger.debug( '  Form Fields:\t "%s"' % form_fields )
        logger.debug( '  Start Date:\t "%s"' % form_fields[ 'time_start' ] )
        logger.debug( '  End Date:\t "%s"' % form_fields[ 'time_end' ] )

        # Get URL Template and Params
        c = Client( repository_endp, repository_desx, mode )
        url = c.url_template
        params = c.url_template_params
        param_names = c.url_template_params_name

        # URL Template: fill with form data
        if search_terms:
            tag = re.findall( '\{searchTerms\?*\}', url )[ 0 ]
            url = url.replace( tag, search_terms )
        if custom_start_params:
            # On FIRST / PREV / NEXT / LAST PAGE requests
            for p in custom_start_params:
                value = custom_start_params[ p ]
                
                if value and p in param_names:
                    tag = params[ param_names[ p ] ][ 'total_tag' ]
                    url = url.replace( tag, value )
        else:
            # On Search requests
            for ff in form_fields:
                value = form_fields[ ff ]
                
                if value and ff in params:
                    tag = params[ ff ][ 'total_tag' ]
                    url = url.replace( tag, value )
        logger.debug( 'Filled URL Template:\t "%s"' % url )

        # URL Template: remove all unused tags
        url = re.sub( '&\w+=\{\w+:*\w+\?*\}', '', url )
        logger.debug( 'Cleaned URL Template:\t "%s"' % url )

        # Do OpenSearch call
        logger.debug( 'OpenSearch call to "%s"' % url )
        r = requests.get( url )
        logger.debug( 'OpenSearch Response Status Code: %s' % r.status_code )
        logger.debug( 'OpenSearch Response Data: %s' % r.content )

        if ( 200 == r.status_code ):
            # ATOM+XML implementation
            logger.debug( 'Retrieving data from the OpenSearch response' )

            # TODO
            from lxml import etree
            tree = etree.fromstring(r.content)
            #f = StringIO( r.content )
            #tree = ET.parse( f )

            #for node in tree.iter():
            #    print node.tag, node.attrib

            out = {}
            logger.debug( 'OpenSearch Response Decoded Data:' )
            out[ 'totalResults' ] = tree.find( '{http://a9.com/-/spec/opensearch/1.1/}totalResults' ).text
            logger.debug( '  Total Results Number:\t "%s"' % out[ 'totalResults' ] )
            out[ 'startIndex' ] = tree.find( '{http://a9.com/-/spec/opensearch/1.1/}startIndex' ).text
            logger.debug( '  Start Index:\t "%s"' % out[ 'startIndex' ] )
            out[ 'itemsPerPage' ] = tree.find( '{http://a9.com/-/spec/opensearch/1.1/}itemsPerPage' ).text
            logger.debug( '  Items per Page:\t "%s"' % out[ 'itemsPerPage' ] )

            # Pagination
            out[ 'mode' ] = mode
            out[ 'first' ] = get_href_params( tree, '{http://www.w3.org/2005/Atom}link[@rel="first"]' )
            logger.debug( '  First Page Params:\t "%s"' % out[ 'first' ] )
            out[ 'prev' ] = get_href_params( tree, '{http://www.w3.org/2005/Atom}link[@rel="previous"]' )
            logger.debug( '  Prev. Page Params:\t "%s"' % out[ 'prev' ] )
            out[ 'next' ] = get_href_params( tree, '{http://www.w3.org/2005/Atom}link[@rel="next"]' )
            logger.debug( '  Next Page Params:\t "%s"' % out[ 'next' ] )
            out[ 'last' ] = get_href_params( tree, '{http://www.w3.org/2005/Atom}link[@rel="last"]' )
            logger.debug( '  Last Page Params:\t "%s"' % out[ 'last' ] )

            # Common Query Parameters
            out[ 'queryParams' ] = get_href_params( tree, '{http://www.w3.org/2005/Atom}link[@rel="self"]' )
            logger.debug( '  Query Params:\t "%s"' % out[ 'queryParams' ] )
            # Common "description.xml"
            node = tree.find( '{http://www.w3.org/2005/Atom}link[@rel="search"]' )
            out[ 'dataDescX' ] = node.get( 'href' ) if node is not None else ''
            logger.debug( '  description.xml:\t "%s"' % out[ 'dataDescX' ] )

            out[ 'data' ] = {}
            recordList = tree.findall( '{http://www.w3.org/2005/Atom}entry' )
            i = 0
            for r in recordList:
                tmpOut = {}

                id = r.find( '{http://www.w3.org/2005/Atom}id' ).text
                tmpOut[ 'Id' ] = id

                index = id.find( '&' )
                tmpOut[ 'entryParams' ] = { x.split( '=' )[ 0 ] : x.split( '=' )[ 1 ] for x in id[ index + 1: ].split( '&' ) }

                # Title
                node = r.find( '{http://www.w3.org/2005/Atom}title' )
                tmpOut[ 'Title' ] = node.text if node is not None else ''

                # description.xml
                node = r.find( '{http://www.w3.org/2005/Atom}link[@rel="search"]' )
                tmpOut[ 'descx' ] = node.get( 'href' ) if node is not None else ''

                node = r.find( '{http://www.w3.org/2005/Atom}published' )
                tmpOut[ 'Published' ] = node.text if node is not None else ''

                tmpOut[ 'Updated' ] = r.find( '{http://www.w3.org/2005/Atom}updated' ).text

                node = r.find( '{http://www.w3.org/2005/Atom}link[@rel="enclosure"]' )
                tmpOut[ 'Download' ] = node.get( 'href' ) if node is not None else ''

                tmp = {}
                tmp['coordinates'] = []
                node = r.find( '{http://www.georss.org/georss}polygon' )
                tmpOut[ 'PolygonList' ] = []
                if node is not None:
                    tmp[ 'type' ] = 'Polygon'
                    q = []
                    cList = re.sub( ' +', ' ', node.text.strip() ).split( ' ' )
                    latList = cList[ 0 : len( cList ) : 2 ]
                    lonList = cList[ 1 : len( cList ) : 2 ]
                    for a, b in zip( latList, lonList ):
                        #tmpOut[ 'PolygonList' ].append( [ float( a ), float( b ) ] )
                        q.append( [ float( a ), float( b ) ] )
                    tmp['coordinates'].append(q)
                node = r.find( '{http://www.georss.org/georss}where' )
                if node is not None:
                    tmp[ 'type' ] = 'MultiPolygon'
                    for n in node.iter():
                        if '{http://www.opengis.net/gml/3.2}posList' in n.tag:
                            q = []
                            # Replace all multi-spaces with single space, trim the string and split it based on single space
                            cList = re.sub( ' +', ' ', n.text.strip()).split( ' ' )
                            # Gel all Latitudes
                            latList = cList[ 0 : len( cList ) : 2 ]
                            # Gel all Longitudes
                            lonList = cList[ 1 : len( cList ) : 2 ]

                            for a, b in zip( latList, lonList ):
                                #tmpOut[ 'PolygonList' ].append( [ float( a ), float( b ) ] )
                                q.append( [ float( a ), float( b ) ] )
                            tmp['coordinates'].append(q)
                tmpOut[ 'PolygonList' ] = tmp
                #grc = GeoRssClient( r )
                #tmpOut[ 'PolygonList' ] = grc.data

                #tmpOut[ 'Preview' ] = getPreviewPNG( r.find('{http://purl.org/dc/elements/1.1/}identifier').text, r.find( '{http://www.w3.org/2005/Atom}link[@rel="alternate"]' ).get( 'href' ) )

                decode_summary( html.fromstring( r.find( '{http://www.w3.org/2005/Atom}summary' ).text ), tmpOut )

                out[ 'data' ][ i ] = tmpOut
                i += 1;

                logger.debug( '  Data:\t %s' % tmpOut )

            logger.debug( 'Data gathered: "%s"' % out )

            return JsonResponse( out )
        else:
            logger.error( 'Error during search call. Return code: "%d"' % r.status_code )
            return HttpResponseServerError( 'Error during search call. Return code: "%d"' % r.status_code )
    except e:
        msg = 'Error during search call: %s' % e
        logger.error( msg )
        return HttpResponseServerError( msg )

def decode_summary( summary_node, output ):
    trList = summary_node.xpath( '//tr' )
    for tr in trList:
        if len( tr.xpath( './td[1]/a/node()' ) ) > 0:
            output[ 'QuickLook' ] = tr.xpath( './td[1]/a/@href' )

            trInnerList = tr.xpath( './td[2]//tr' )
            for trInner in trInnerList:
                key = trInner.xpath( './td[1]/b/text()' ) if len( trInner.xpath( './td[1]/b/text()' ) ) > 0 else trInner.xpath( './td[1]/strong/text()' )
                val = trInner.xpath( './td[2]/node()' )

                key = key[ 0 ].strip() if len( key ) == 1 else [ html.tostring( k ) for k in key if k is not None and k != '\n' and not '|' in k ]
                val = val[ 0 ].strip() if len( val ) == 1 else [ html.tostring( v ) for v in val if v is not None and v != '\n' and not '|' in v ]

                output[ key ] = val
        else:
            key = tr.xpath( './td[1]/b/text()' ) if len( tr.xpath( './td[1]/b/text()' ) ) > 0 else tr.xpath( './td[1]/strong/text()' )
            val = tr.xpath( './td[2]/node()' )

            key = key[ 0 ].strip() if len( key ) == 1 else [ html.tostring( k ) for k in key if k is not None and k != '\n' and not '|' in k ]
            val = val[ 0 ].strip() if len( val ) == 1 else [ html.tostring( v ) for v in val if v is not None and v != '\n' and not '|' in v ]

            output[ key ] = val

def get_href_params( tree, regex ):
    node = tree.find( regex )
    out = {}
    if node is not None:
        href = node.get( 'href' )
        index = href.find( '&' )
        out = { x.split( '=' )[ 0 ] : x.split( '=' )[ 1 ] for x in href[ index + 1: ].split( '&' ) }

    return out

def download( request ):
    user = request.user
    url_list = request.GET[ 'dHref' ]

    #uList = url_list.split( ';' )
    #job = download_to_vrc.delay( user, url_list )
    job = download_to_vrc( user, url_list )

    return HttpResponse()

#def getPreviewPNG( id, url ):
#    #print id
#    #print url
#    
#    logger.debug( '  GetPreview call to "%s"' % url )
#    r = requests.get(url)
#    logger.debug( '  GetPreview Response Status Code: %s' % r.status_code )
#    logger.debug( '  GetPreview Response Data: %s' % r.content )
#    
#    if (200 == r.status_code):
#        
#        f = StringIO(r.content)
#        tree = ET.parse(f)
#        
#        #for child in tree.iter():
#        #    if '{http://www.opengis.net/ows/2.0}ServiceReference' == child.tag:
#        #        print child.tag, child.attrib
#        
#        logger.debug( '  Retrieving data from the GetPreview response' )
#        recordList = tree.findall( './/{http://www.opengis.net/ows/2.0}ServiceReference' )
#        for r in recordList:
#            if 'QuickLook' in r.find( '{http://www.opengis.net/ows/2.0}Identifier' ).text:
#                pngUrl = r.get( '{http://www.w3.org/1999/xlink}href' )
#                
#                # TODO
#                r = requests.get( pngUrl, auth=( 'smantovani', 'm1rc1m4_M' ), stream = True )
#                
#                import os
#                import shutil
#                from django.conf import settings
#                path = os.path.join( settings.STATIC_ROOT, id + '.png' )
#                #print path
#                if r.status_code == 200:
#                    with open(path, 'wb') as f:
#                        r.raw.decode_content = True
#                        shutil.copyfileobj(r.raw, f)   
#                        return id + '.png'
#    return None
