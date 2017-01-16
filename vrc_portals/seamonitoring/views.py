import json
import logging
import geojson
import os

from django.http import HttpResponseServerError, JsonResponse
from django.shortcuts import render
from vreportal.settings import DATA_DIR
from vreportal.Util import Box, SimpleFunctionBox

logger = logging.getLogger( __name__ )
DATA_ROOT = os.path.join( DATA_DIR, 'seamonitoring', 'data' )

def index( request ):
    context = {
        'boxlist': [
            Box( 'container', 12, boxes = [
                Box( 'container', 9, boxes = [
                    Box( 'vglobe', 12, title = 'Virtual Globe', type = 'box-default-2', id = 'vglobe-box' ),
                    Box( 'default', 12, title = 'Information', type = 'box-default-2', id = 'bottom-bar', body = '<p>Welcome to the Sea Monitoring page powered by the EVER-EST Virtual Research Environment!</p><p>You can browse and view some data and results but to be able to exploit the full VRE capacity you need to register and log-in.</p>' ),
                ] ),
                Box( 'container', 3, boxes = [
                    SimpleFunctionBox( 6, componentId = 'ee-remote-desktop'  , linkId = 'ee-remote-desktop-link'  , linkUrl = '#', linkImageClass = 'fa-desktop' , linkImageAlt = 'Remote Desktop' , linkTitle = 'Remote Desktop' , type = 'box-default' ),
                    SimpleFunctionBox( 6, componentId = 'ee-launch-terminal' , linkId = 'ee-launch-terminal-link' , linkUrl = '#', linkImageClass = 'fa-terminal', linkImageAlt = 'Launch Terminal', linkTitle = 'Launch Terminal', type = 'box-default' ),
                    Box( 'default', 12, type = 'box-default', bodyAlign = 'text-left', id = 'right-bar' ),
                ] ),
            ] ),
        ],
    }
    return render( request, 'seamonitoring.html', context = context )

def init( request ):
    try:
        out = {}

        # Countries
        path = os.path.join( DATA_ROOT, 'Countries.geojson' )
        logger.debug( '"Countries.geojson" path: %s' % path )
        with open( path ) as f:
            o = geojson.load( f )
            crs = o.crs.properties[ 'name' ]
            tmp = {}
            for f in o.features:
                tmp[ f.properties[ 'Country' ] ] = { 'crs':  crs, 'properties': f.properties, 'geometry': f.geometry }
            out[ 'countries' ] = tmp

        # Sub-Regions
        path = os.path.join( DATA_ROOT, 'IT_Subregions.geojson' )
        logger.debug( '"IT_Subregions.geojson" path: %s' % path )
        with open( path ) as f:
            o = geojson.load( f )
            crs = o.crs.properties[ 'name' ]
            tmp = {}
            for f in o.features:
                f.geometry.type = 'MultiPolygon'
                tmp[ f.properties[ 'Sub_region' ] ] = { 'crs':  crs, 'properties': f.properties, 'geometry': f.geometry }
            out[ 'subreg' ] = tmp

        # Biodiversities / Criterias / Indicators
        path = os.path.join( DATA_ROOT, 'GES_Good_Environmental_Status.json' )
        logger.debug( '"GES_Good_Environmental_Status.json" path: %s' % path )
        with open( path ) as f:
            out[ 'ges' ] = json.load( f )

        return JsonResponse( out )
    except e:
        return HttpResponseServerError( e )
