import logging

from django.http import HttpResponseServerError
from django.shortcuts import render
from vreportal.Util import Box, SimpleFunctionBox

logger = logging.getLogger( __name__ )

def index( request ):
    context = {
        'boxlist': [
            Box( 'container', 12, boxes = [
                Box( 'container', 9, boxes = [
                    Box( 'vglobe', 12, title = 'Virtual Globe', type = 'box-default-2', id = 'vglobe-box' ),
                    Box( 'default', 12, title = 'Information', type = 'box-default-2', id = 'bottom-bar', body = '<p>Welcome to the Supersite page powered by the EVER-EST Virtual Research Environment!</p><p>You can browse and view some data and results but to be able to exploit the full VRE capacity you need to register and log in.</p>' ),
                ] ),
                Box( 'container', 3, boxes = [
                    SimpleFunctionBox( 6, componentId = 'ee-remote-desktop'  , linkId = 'ee-remote-desktop-link'  , linkUrl = '#', linkImageClass = 'fa-desktop' , linkImageAlt = 'Remote Desktop' , linkTitle = 'Remote Desktop' , type = 'box-default' ),
                    SimpleFunctionBox( 6, componentId = 'ee-launch-terminal' , linkId = 'ee-launch-terminal-link' , linkUrl = '#', linkImageClass = 'fa-terminal', linkImageAlt = 'Launch Terminal', linkTitle = 'Launch Terminal', type = 'box-default' ),
                    Box( 'default', 12, type = 'box-default', title = 'Supersite Data', bodyAlign = 'text-left', id = 'right-bar-1', body="<ul><li>Generic News</li><li>Generic Links</li><li>Generic Events</li><li>...</li></ul>" ),
                    Box( 'default', 12, type = 'box-default', title = 'Supersite Resources', bodyAlign = 'text-left', id = 'right-bar-2', body="<h3>Generic Supersites Generic Subjects Resources</h3><ul><li>Data</li><li>Products</li><li>Processing Services</li><li>Discussions</li><li>Reference Search</li></ul>" ),
                ] ),
            ]),
        ]
    }
    return render( request, 'supersites.html', context = context )
