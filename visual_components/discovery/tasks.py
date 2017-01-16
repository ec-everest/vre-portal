from __future__ import absolute_import

import logging
import os
import requests
import shutil

from eeauth import Auth
#from celery import shared_task
from django.conf import settings
from django.contrib.auth.models import User

logger = logging.getLogger( __name__ )

#@shared_task
def download_to_vrc( user, urlList ):
    # Mail: download started
    Auth.send_notification( user, '[EO-Discovery] Download to VRC started', 'The download to the VRC has been started. You will be notified when the files will be available.', True )

    ## Download to VRC
    #size = len( urlList )
    #logger.debug( 'Number of product(s) to be downloaded: "%03d"' % size )

    #results = {}
    #i = 0
    #for url in urlList:
    #    logger.debug( 'Downloading resource "%03d" of "%03d". Product: "%s". URL: "%s"' % ( i, size, url, urlList[ url ] ) )

    #    #process_percent = int( 100 * float( url ) / float( url ) )
    #    #current_task.update_state( state='PROGRESS', meta = { 'process_percent': process_percent } )

    #    # TODO
    #    r = requests.get( urlList[ url ], auth=( 'smantovani', 'm1rc1m4_M' ), stream = True )

    #    status = 'success'
    #    msg = ''
    #    if ( 200 == r.status_code ):
    #        path = os.path.join( settings.DATA_ROOT, url + '.zip' )

    #        r.raw.decode_content = True
    #        with open( path, 'wb' ) as out:
    #            shutil.copyfileobj( r.raw, out )   

    #        logger.debug( 'Download of resource "%03d" of "%03d" ("%s") succeded' % ( i, size, url ) )
    #    else:
    #        status = 'failure'
    #        msg = '%d: %s' % ( r.status_code, r.content )
    #        logger.error( 'Download of resource "%03d" of "%03d" ("%s") failed with error "%s"' % ( i, size, url, msg ) )

    #    # TODO send notification
    #    results[ url ] = { 'url': urlList[ url ], 'status': status, 'msg': msg }
    #    i += 1

    # Mail: download finished
    Auth.send_notification( user, '[EO-Discovery] Download to VRC completed', 'All the products have been downloaded to the VRC. You can find them: ...', True )
