import logging
import json
import os

from django.http import HttpResponse, HttpResponseServerError, JsonResponse
from django.shortcuts import render
from vreportal.settings import DATA_DIR

logger = logging.getLogger( __name__ )
# TODO VRC
DATA_ROOT = os.path.join( DATA_DIR, 'static', 'upload' )

def getShapefileList( request ):
    shapefileList = []
    #path = os.path.join( DATA_ROOT, request.POST[ 'path' ] )
    logger.debug( DATA_ROOT )
    for file in os.listdir( DATA_ROOT ):
        if file.endswith('.shp'):
            shapefileList.append(file)

    shapefileList.sort()
    return HttpResponse(json.dumps(shapefileList), content_type='application/json')
