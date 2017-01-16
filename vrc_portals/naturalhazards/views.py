import logging

from django.http import HttpResponseServerError
from django.shortcuts import render
from vreportal.Util import Box

logger = logging.getLogger( __name__ )

def index( request ):
    context = {
        'boxlist': [
            Box( 'container', 12, boxes = [
                Box( 'container', 9, boxes = [
                    Box( 'vglobe', 12, title = 'Virtual Globe', type = 'box-default-2', id = 'vglobe-box' ),
                    Box( 'default', 12, title = 'Information', type = 'box-default-2', id = 'bottom-bar', body = '<p>Welcome to the Natural Hazards page powered by the EVER-EST Virtual Research Environment!</p><p>You can browse and view some data and results but to be able to exploit the full VRE capacity you need to register and log in.</p>' ),
                ] ),
                Box( 'container', 3, boxes = [
                    Box( 'default', 12, title = 'Information', type = 'box-default', id = 'right-bar', bodyAlign = 'text-left' ),
                ] ),
            ] ),
        ],
    }
    return render( request, 'naturalhazards.html', context = context )
