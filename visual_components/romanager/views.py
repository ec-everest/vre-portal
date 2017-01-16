import json
import logging
import requests

from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseServerError, JsonResponse
from django.shortcuts import render
from eeauth import Auth

logger = logging.getLogger( __name__ )
ENDPOINT = 'http://vm2.everest.psnc.pl:8280/everest/'

def init( request ):
    return render(request, 'romanager.html')

def create( request ):
    id = request.POST[ 'id' ]
    title = request.POST[ 'title' ]
    desc = request.POST[ 'desc' ]

    # Get User Token
    auth = Auth.is_auth( request )
    is_auth = auth[ 'auth' ]
    community = auth[ 'community' ]
    access_token = auth[ 'access_token' ]
    err_msg = auth[ 'error_message' ]

    logger.debug( 'User Data:' )
    logger.debug( '  Is Authenticated? "%s"' % ( 'Y' if is_auth else 'N' ) )
    logger.debug( '  Community: "%s"' % community )
    logger.debug( 'RO Data:' )
    logger.debug( '  ID: "%s"' % id )
    logger.debug( '  Title: "%s"' % title )
    logger.debug( '  Description: "%s"' % desc )

    if is_auth and err_msg is None:
        headers = {
            'Content-Type': 'application/json',
            'Slug': id,
            'Authorization': 'Bearer %s' % access_token
        }
        data = {
            "ro_vrc": "%s"  % community,
            "ro_title": "%s" % title,
            "ro_desc": "%s" % desc
        }

        logger.debug( 'Creating the RO...' )
        r = requests.post( ENDPOINT + 'ROs', headers = headers, json = data )
        if 201 == r.status_code:
            out = r.json()
            name = out[ 'ro_name' ]
            logger.debug( 'RO created! Name: "%s"' % name )
            Auth.send_notification( request.user, 'New RO created!', 'A new RO has been created. It is available at: "%s"' % name )
            return JsonResponse( { 'name': name, 'title': title, 'error_message': None } )
        else:
            logger.error( 'Error during RO creation: "%d %s"' % ( r.status_code, r.reason ) )
            return JsonResponse( { 'name': None, 'error_message': '%d %s' % ( r.status_code, r.reason ) } )
        # TEST return JsonResponse( { 'name': 'http://sandbox.wf4ever-project.org/rodl/ROs/The%2520First%2520RO/', 'title': 'The First RO', 'error_message': None } )
    else:
        return HttpResponseServerError( err_msg )

def search( request ):
    title = request.POST[ 'title' ] if 'title' in request.POST else None
    description = request.POST[ 'description' ] if 'description' in request.POST else None
    creator = request.POST[ 'creator' ] if 'creator' in request.POST else None
    status = request.POST[ 'status' ] if 'status' in request.POST else None
    start = request.POST[ 'startingDate' ] if 'startingDate' in request.POST else None # TODO check format YYYY-MM-DD
    end = request.POST[ 'endingDate' ] if 'endingDate' in request.POST else None # TODO check format YYYY-MM-DD
    #name = request.POST[ 'name' ] if 'name' in request.POST else None

    # Get User Token
    auth = Auth.is_auth( request )
    is_auth = auth[ 'auth' ]
    community = auth[ 'community' ]
    access_token = auth[ 'access_token' ]
    err_msg = auth[ 'error_message' ]

    logger.debug( 'User Data:' )
    logger.debug( '  Is Authenticated? "%s"' % ( 'Y' if is_auth else 'N' ) )
    logger.debug( '  Community: "%s"' % community )
    logger.debug( 'Search Data:' )
    logger.debug( '  Title: "%s"' % title )
    logger.debug( '  Description: "%s"' % description )
    logger.debug( '  Creator: "%s"' % creator )
    logger.debug( '  Status: "%s"' % status )
    logger.debug( '  Start: "%s"' % start )
    logger.debug( '  End: "%s"' % end )

    if is_auth and err_msg is None:
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/sparql-results+json',
            'Authorization': 'Bearer %s' % access_token
        }
        data = {
            "entityType": "RO",
            "vrc": "%s"  % community,
        }
        if start:
            data[ "since_YYYY-MM-DD" ] = "%s" % start
        if end:
            data[ "till_YYYY-MM-DD" ] = "%s" % end
        if title:
            data[ "title" ] = "%s" % title
        if description:
            data[ "description" ] = "%s" % description
        if creator:
            data[ "creator" ] = "%s" % creator
        if status:
            data[ "status" ] = "%s" % status
        #if ro is not None:
        #    data[ "ro" ] = "%s" % ro

        logger.debug( 'Looking for ROs...' )
        logger.debug( 'Header: "%s"' % headers )
        logger.debug( 'Body: "%s"' % data )
        r = requests.post( ENDPOINT + 'sparql', headers = headers, json = data )
        if 200 == r.status_code:
            out_json = r.json()
            ro_list = out_json[ 'results' ][ 'bindings' ]
            ro_number = len( ro_list )

            logger.debug( 'Found "%06d" ROs' % ro_number )
            out = { 'ros': [], 'error_message': None }
            for ro in ro_list:
                tmp_ro = {}

                name = ro[ 'ro' ][ 'value' ] if 'ro' in ro else None
                tmp_ro[ 'name' ] = name

                date = ro[ 'created' ][ 'value' ] if 'created' in ro else None
                tmp_ro[ 'date' ] = date

                title = ro[ 'title' ][ 'value' ] if 'title' in ro else None
                tmp_ro[ 'title' ] = title

                desc = ro[ 'description' ][ 'value' ] if 'description' in ro else None
                tmp_ro[ 'desc' ] = desc

                creator_url = ro[ 'creator' ][ 'value' ] if 'creator' in ro else None
                tmp_ro[ 'creator_url' ] = creator_url

                creator_name = ro[ 'creatorName' ][ 'value' ] if 'creatorName' in ro else creator_url
                tmp_ro[ 'creator_name' ] = creator_name

                status = ro[ 'status' ][ 'value' ] if 'status' in ro else None
                tmp_ro[ 'status' ] = status

                out[ 'ros' ].append( tmp_ro )
            return JsonResponse( out )
        else:
            return JsonResponse( { 'ros': None, 'error_message': '%d %s' % ( r.status_code, r.reason ) } )

def content( request ):
    ro_name = request.POST[ 'name' ] if 'name' in request.POST else None

    if ro_name is None:
        return JsonResponse( { 'resources': None, 'error_message': 'RO name is not valid!' } )
    else:
        # Get User Token
        auth = Auth.is_auth( request )
        is_auth = auth[ 'auth' ]
        community = auth[ 'community' ]
        access_token = auth[ 'access_token' ]
        err_msg = auth[ 'error_message' ]

        logger.debug( 'User Data:' )
        logger.debug( '  Is Authenticated? "%s"' % ( 'Y' if is_auth else 'N' ) )
        logger.debug( '  Community: "%s"' % community )
        logger.debug( 'RO Data:' )
        logger.debug( '  Name: "%s"' % ro_name )

        if is_auth and err_msg is None:
            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/sparql-results+json',
                'Authorization': 'Bearer %s' % access_token
            }
            data = {
                "entityType": "resource",
                "ro": "%s"  % ro_name,
            }

            logger.debug( 'Looking for ROs...' )
            logger.debug( 'Header: "%s"' % headers )
            logger.debug( 'Body: "%s"' % data )
            r = requests.post( ENDPOINT + 'sparql', headers = headers, json = data )
            if 200 == r.status_code:
                out_json = r.json()
                res_list = out_json[ 'results' ][ 'bindings' ]
                res_number = len( res_list )

                logger.debug( 'Found "%06d" resources' % res_number )
                out = { 'resources': [], 'error_message': None }
                for res in res_list:
                    val = res[ 'resource' ][ 'value' ] if 'resource' in res else None
                    out[ 'resources' ].append( val )
                return JsonResponse( out )
            else:
                return JsonResponse( { 'resources': None, 'error_message': '%d %s' % ( r.status_code, r.reason ) } )

def delete( request ):
    pass