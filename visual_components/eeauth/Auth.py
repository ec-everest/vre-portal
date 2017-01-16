
'''
Created on Set 07, 2016

@author: ferraresi
'''

import json
import logging
import requests
import sys

from datetime import timedelta, datetime
from django.contrib.auth import authenticate, login, logout, get_user
from django.contrib.auth.models import User, Group, Permission
from django.shortcuts import redirect, render
from django.utils import timezone
from models import User_tokens, User_community
from postman.api import pm_broadcast, pm_write
from pyejabberd import EjabberdAPIClient
from settings.SettingsManager import SettingsManager
from token_utils import token_call, update_token
from user_group_utils import register_group, get_comm_users, registerUser

logger = logging.getLogger( __name__ )

def get_login():
    settingsManager = SettingsManager()

    url = '%s?response_type=%s&scope=%s&client_id=%s&redirect_uri=%s' % ( settingsManager.getAuthorizationEndpoint(), 'code', 'openid', settingsManager.getClientId(), settingsManager.getRedirectUri() )
    logger.debug( 'Auth. call to: %s' % url )

    return url

def is_auth( request ):
    auth = request.user.is_authenticated()
    logger.debug( 'User status: %s' % 'Authenticated' if auth else 'NOT Authenticated' )

    out_call = { 'access_token': None, 'error_message': None }
    if auth:
        # Get User Communityuser_groups
        user_community = User_community.objects.get( user = request.user )

        # Get User Access Token
        out_call = update_token( request.user, None, None )

    out = { 'auth': auth, 'community': user_community.community_name if user_community else None, 'access_token': out_call[ 'access_token' ], 'error_message': out_call[ 'error_message' ] }

    return out

def get_community_users( user ):
    try:
        user_list_tmp = get_comm_users( user )
        logger.debug( 'Community users: "%s"' % user_list_tmp )

        user_list = []
        for u in user_list_tmp:
            user_list.append( { 'name': '%s %s' % ( u.first_name, u.last_name ), 'username': u.username, 'email': u.email } )

        return { 'users': user_list, 'error_message': None }
    except Exception, e:
        return { 'error_message': e }

def get_community_users_class( user ):
    django_user_list = []
    try:
        user_list_tmp = get_comm_users( user )
        logger.debug( 'Community users: "%s"' % user_list_tmp )

        for u in user_list_tmp:
            django_user_list.append( u )
    except Exception, e:
        pass

    return django_user_list

def do_login( request, context ):
    if 'code' in request.GET and 'session_state' in request.GET:
        code = request.GET[ 'code' ]
        session_state = request.GET[ 'session_state' ]
        logger.debug( 'Auth. Response Code: %s' % code )
        logger.debug( 'Auth. Response Session State: %s' % session_state )

        # Token Call
        tokenData = token_call( grant_type = 'authorization_code', code = code )
        logger.debug( tokenData )
        access_token = tokenData[ 'access_token' ]
        refresh_token = tokenData[ 'refresh_token' ]

        # Get UserInfo Call
        # Init Settings Manager
        settingsManager = SettingsManager()
        userinfoEndpoint = settingsManager.getUserInfoEndpoint()
        headers = {
            'Authorization': 'Bearer %s' % access_token
        }
        params = {
            'schema': 'openid'
        }
        logger.debug( 'UserInfo call to: "%s" (headers: "%s", parameters: "%s")' % ( userinfoEndpoint, json.dumps( headers ), json.dumps( params ) ) )
        r = requests.get( userinfoEndpoint, headers = headers, params = params )
        logger.debug( 'UserInfo Response Status Code: %s' % r.status_code )
        logger.debug( 'UserInfo Response Data: %s' % r.text )
        userData = json.loads( r.text )
        username = userData[ 'sub' ]
        password = username + 'everpwd' # TODO
        community = userData[ 'VRC' ]
        firstName = userData[ 'given_name' ]
        lastName = userData[ 'family_name' ]
        email = userData[ 'email' ]
        logger.debug( 'User Information:' )
        logger.debug( '  Username: %s' % username )
        logger.debug( '  Community: %s' % community )
        logger.debug( '  First Name: %s' % firstName )
        logger.debug( '  Last Name: %s' % lastName )
        logger.debug( '  E-Mail: %s' % email )

        # Check user existance
        try:
            logger.debug( 'Authenticating user "%s" into the system' % username )
            user = authenticate( username = username, password = password )
            logger.debug( 'User "%s" authenticated into the system' % username )
        except:
            user = None
            logger.debug( 'User "%s" NOT authenticated into the system' % username )

        # User creation (if required)
        if user is None:
            user = registerUser( username, password, email, firstName, lastName, community, settingsManager.getXmppServerName() )

        # Update User Community
        logger.debug( 'Updating user Community to "%s"...' % community )
        try:
            user_community = User_community.objects.get( user = user )
            user_community.community_name = community
            user_community.save()
        except Exception, e:
            user_community = User_community( user = user, community_name = community )
            user_community.save()
        logger.debug( 'User Community updated' )

        # Create/Get user group
        if len( user.groups.all() ) == 0:
            logger.debug( 'Getting/Creating user''s group "%s"' % community )
            parent_group, user_group = register_group( community, user )
            logger.debug( 'User''s group: "%s"' % community )

        if user is not None:
            # Password verified for the user
            if user.is_active:
                try:
                    # User Active
                    login(request, user)

                    # Update Access Token on Login
                    update_token( user, access_token, refresh_token )

                    logger.debug( 'User "%s" active. Redirecting to "index.html"' % username )

                    return render( request, 'index.html', context = context )
                except Exception, e:
                    msg = 'Error during user login: "%s"' % e
            else:
                # User Not Active
                msg = 'Account "%s" not enabled' % user.username
        else:
            # Username or password incorrect
            msg = 'Error during authentication. Username and/or password are incorrect. Redirecting to "index.html"'
    else:
        return render( request, 'index.html', context = context )

    # Error
    logger.error( msg )
    return render( request, 'index.html', context = {
        'error_message': msg,
    } )

def send_notification( user, subject, body, only_owner = False ):
    if not only_owner:
        user_list = get_community_users_class( user )
        filtered_user_list = []
        for tmp in user_list:
            if user.username not in tmp.username:
                filtered_user_list.append( tmp )
        pm_broadcast( sender = user, recipients = filtered_user_list, subject = subject, body = body, skip_notification = False )
    pm_write( sender = user, recipient = user, subject = subject, body = body, skip_notification = False, auto_archive = False, auto_delete = False, auto_moderators = [] )
