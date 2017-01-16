
'''
Created on Nov 21, 2016

@author: ferraresi
'''

import json
import logging
import requests
import sys

from datetime import timedelta, datetime
from django.contrib.auth.models import User
from django.utils import timezone
from models import User_tokens
from settings.SettingsManager import SettingsManager

logger = logging.getLogger( __name__ )

def token_call( grant_type, code = None, refresh_token = None ):
    # Init Settings Manager
    settingsManager = SettingsManager()
    tokenEndpoint = settingsManager.getTokenEndpoint()
    clientId = settingsManager.getClientId()
    clientIdSecret = settingsManager.getClientIs()

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'charset': 'utf-8'
    }
    params = {
        'grant_type': grant_type,
    }
    if 'authorization_code' in grant_type:
        params[ 'redirect_uri' ] = settingsManager.getRedirectUri()
        params[ 'code' ] = code
    elif 'refresh_token' in grant_type:
        params[ 'refresh_token' ] = refresh_token
    logger.debug( 'Token call to: "%s" (headers: "%s", parameters: "%s")' % ( tokenEndpoint, json.dumps( headers ), json.dumps( params ) ) )
    r = requests.post( tokenEndpoint, auth = ( clientId, clientIdSecret ), headers = headers, params = params )
    logger.debug( 'Token Response Status Code: %s' % r.status_code )
    logger.debug( 'Token Response Data: %s' % r.text )
    if 400 == r.status_code:
        tokenData = { 'error_message': 'login_required' }
    else:
        tokenData = json.loads( r.content )

    return tokenData

def update_token( user, access_token, refresh_token ):
    try:
        update_token = access_token is not None and refresh_token is not None
        if update_token:
            logger.debug( 'Action: Update Token' )
        else:
            logger.debug( 'Action: Get Token' )

        logger.debug( 'Gathering Token information...' )
        user_auth = User.objects.get( pk = user.id )
        try:
            user_token = User_tokens.objects.get( user = user_auth )
            if update_token:
                user_token.token = access_token
                user_token.refresh_token = refresh_token
                user_token.ins_tms = timezone.now()
            else:
                access_token = user_token.token
                refresh_token = user_token.refresh_token
            token_created = False
            logger.debug( 'Token loaded' )
        except:
            user_token = User_tokens( user = user_auth, token = access_token, refresh_token = refresh_token, ins_tms = timezone.now() )
            token_created = True
            logger.debug( 'Token created' )
        logger.debug( 'Token information gathered' )

        # Check Token validity
        ins_tms = user_token.ins_tms
        end_tms = ins_tms + timedelta( minutes = 25 ) # 5 minutes gap
        crt_tms = timezone.now()
        logger.debug( 'Token Timestamp: "%s"' % ins_tms )
        logger.debug( 'Token Expiration Timestamp: "%s"' % end_tms )
        logger.debug( 'Current Timestamp: "%s"' % crt_tms )
        need_login = False
        if not token_created and crt_tms >= end_tms:
            token_data = token_call( grant_type = 'refresh_token', refresh_token = user_token.refresh_token )
            if not 'error_message' in token_data:
                user_token.token = token_data[ 'access_token' ]
                user_token.refresh_token = token_data[ 'refresh_token' ]
                user_token.ins_tms = timezone.now()
                logger.debug( 'Token Renewed' )
            else:
                need_login = True
                logger.warning( 'Needs login' )
        else:
            logger.debug( 'No need to renew the Token' )

        if not need_login:
            # Save Token Information
            logger.debug( 'Updating token information...' )
            user_token.save()
            logger.debug( 'Token information updated' )

            return { 'access_token': user_token.token, 'error_message': None }
        else:
            return { 'access_token': None, 'error_message': 'login_required' }
    except Exception, e:
        return { 'access_token': None, 'error_message': e }
