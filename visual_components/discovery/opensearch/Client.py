'''
Created on Oct 3, 2016

@author: ferraresi
'''

import logging
import requests
import re
import xml.etree.ElementTree as ET

from StringIO import StringIO

logger = logging.getLogger( __name__ )

class Client( object ):
    '''
    OpenSearch client
    '''

    def __init__( self, endpoint = None, descriptionUrl = None, type = 'collection' ):
        '''
        Constructor
        '''

        if endpoint is None and descriptionUrl is None:
            msg = 'Neither "endpoint" nor "descriptionUrl" specified'
            logger.error( msg )

            raise ValueError( msg )

        if type not in [ 'collection', 'results' ]: 
            msg = 'Neither "collection" nor "results" type specified'
            logger.error( msg )

            raise ValueError( msg )

        self.endpoint = endpoint
        self.desc_url = descriptionUrl
        self._type = type

        # Valid OpenSearch Endpoint and not valid Description URL
        if self.endpoint and not self.desc_url:
            # Get OpenSearch Description URL
            self._autodiscovery_description_url()

        # Get OpenSearch URL Template
        self._get_url_template()

        # Get OpenSearcg Template Parameters
        self._get_template_parameters()

        logger.debug( 'OpenSearch Endpoint: "%s"' % self.endpoint )
        logger.debug( 'OpenSearch Description URL: "%s"' % self.desc_url )
        logger.debug( 'OpenSearch Template URL: "%s"' % self.url_template )
        logger.debug( 'OpenSearch Template Parameters: "%s"' % self.url_template_params )
        logger.debug( 'OpenSearch Template Parameter Names: "%s"' % self.url_template_params_name )

    def _autodiscovery_description_url( self ):
        """ OpenSearch Description URL autodiscovery.
        See: http://www.opensearch.org/Specifications/OpenSearch/1.1/Draft_5#Autodiscovery
        """

        logger.debug( 'Fetching OpenSearch Description URL from OpenSearch Endpoint "%s"' % self.endpoint )

        r = requests.get( self.endpoint, headers = { 'Content-Type': 'application/atom%%2Bxml' } )
        if ( 200 == r.status_code ):
            tree = ET.parse( StringIO( r.content ) )
            # for node in tree.iter():
            #    print node.tag, node.attrib

            # http://www.opensearch.org/Specifications/OpenSearch/1.1/Draft_5#Autodiscovery
            url = tree.findall( "{http://www.w3.org/2005/Atom}link[@rel='search'][@type='application/opensearchdescription+xml']" )[ 0 ].get( 'href' )
            if url:
                logger.debug( 'OpenSearch Description URL: "%s"' % url )
                logger.debug( 'OpenSearch Description URL fetched' )

                self.desc_url = url
            else:
                logger.warning( 'The endpoint is NOT an OpenSearch enabled endpoint' )

                self.desc_url = None
        else:
            msg = 'Error while fetching OpenSearch Description URL. The endpoint "%s" responded with a "%d" error code' % ( self.endpoint, r.status_code )
            logger.error( msg )

            raise Exception( msg )

    def _get_url_template ( self ):
        """ Get OpenSearch URL Template.
        See: http://www.opensearch.org/Specifications/OpenSearch/1.1/Draft_5#OpenSearch_description_elements
        """

        logger.debug( 'Fetching OpenSearch URL Template from OpenSearch Description URL "%s"' % self.desc_url )

        r = requests.get( self.desc_url, headers = { 'Content-Type': 'application/atom%%2Bxml' } )
        if ( 200 == r.status_code ):
            tree = ET.parse( StringIO( r.content ) )
            # for node in tree.iter():
            #    print node.tag, node.attrib

            # http://www.opensearch.org/Specifications/OpenSearch/1.1/Draft_5#OpenSearch_description_elements
            url_template_tag = tree.findall( "{http://a9.com/-/spec/opensearch/1.1/}Url[@rel='%s'][@type='application/atom+xml']" % self._type )[ 0 ]
            url_template = url_template_tag.get( 'template' )
            if url_template:
                logger.debug( 'OpenSearch URL Template Tag: "%s"' % url_template_tag )
                logger.debug( 'OpenSearch URL Template: "%s"' % url_template )
                logger.debug( 'OpenSearch URL Template fetched' )

                self._url_template_tag = url_template_tag
                self.url_template = url_template
            else:
                logger.warning( 'The description URL does NOT contain a valid OpenSearch Teplate URL' )

                self._url_template_tag = None
                self.url_template = None
        else:
            msg = 'Error while fetching OpenSearch Template. The description url "%s" responded with a "%d" error code' % ( self.desc_url, r.status_code )
            logger.error( msg )

            raise Exception( msg )

    def _get_template_parameters( self ):
        """ Get OpenSearch Template Parameters.
        See: http://www.opensearch.org/Specifications/OpenSearch/1.1/Draft_5#OpenSearch_URL_template_syntax
        """

        logger.debug( 'Fetching OpenSearch Template Parameters from OpenSearch Description URL "%s" and OpenSearch Template URL "%s"' % ( self.desc_url, self.url_template ) )

        tags = re.findall( '\{[\w\:\?]+\}', self.url_template )

        self.url_template_params = {}
        self.url_template_params_name = {}
        for t in tags:
            clean_tag = t.replace( '{', '' ).replace( '?', '' ).replace( '}', '' )
            key = clean_tag.replace( ':', '_' )
            self.url_template_params[ key ] = {}
            self.url_template_params[ key ][ 'clean_tag' ] = clean_tag
            self.url_template_params[ key ][ 'total_tag' ] = t

            for node in self._url_template_tag:
                if clean_tag in node.attrib[ 'value' ]:
                    self.url_template_params_name[ node.attrib[ 'name' ] ] = key

                    if 'time' in node.attrib[ 'value' ]:
                        self.url_template_params[ key ][ 'type' ] = 'date'
                    else:
                        self.url_template_params[ key ][ 'type' ] = 'text'

                    if 'title' in node.attrib:
                        self.url_template_params[ key ][ 'title' ] = node.attrib[ 'title' ]
                    if 'pattern' in node.attrib:
                        self.url_template_params[ key ][ 'pattern' ] = node.attrib[ 'pattern' ]
                    if 'minimum' in node.attrib:
                        self.url_template_params[ key ][ 'minimum' ] = node.attrib[ 'minimum' ]
                    if 'minInclusive' in node.attrib:
                        self.url_template_params[ key ][ 'minInclusive' ] = node.attrib[ 'minInclusive' ]
                    if 'maxInclusive' in node.attrib:
                        self.url_template_params[ key ][ 'maxInclusive' ] = node.attrib[ 'maxInclusive' ]

                    optChildren = node.findall( "{http://a9.com/-/spec/opensearch/extensions/parameters/1.0/}Option" )
                    if len( optChildren ) > 0:
                        self.url_template_params[ key ][ 'type' ] = 'select'
                        self.url_template_params[ key ][ 'options' ] = {}
                        for oc in optChildren:
                            self.url_template_params[ key ][ 'options' ][ oc.attrib[ 'label' ] ] = oc.attrib[ 'value' ]
                    break

        logger.debug( 'OpenSearch Template Parameters: "%s"' % self.url_template_params )
        logger.debug( 'OpenSearch Template Parameter Names: "%s"' % self.url_template_params_name )
        logger.debug( 'OpenSearch Template Parameters fetched' )
