
'''
Created on Nov 21, 2016

@author: ferraresi
'''

import json
import logging
import requests
import sys

from django.contrib.auth import authenticate
from django.contrib.auth.models import User, Group, Permission
from pyejabberd import EjabberdAPIClient

logger = logging.getLogger( __name__ )

def registerUser( username, password, email, firstName, lastName, community, xmppServerName ):
    try:
        # TODO diamo per scontato che l'username che reperiamo sia univoco. Non e' stata specificata alcuna password.
        logger.debug( 'Registering user "%s" into the system' % username )
        user = User.objects.create_user( username = username, password = password, email = email, first_name = firstName, last_name = lastName )
        logger.debug( 'User "%s" registered' % username )

        logger.debug( 'Authenticating user "%s" into the system' % username )
        user = authenticate( username = username, password = password )
        logger.debug( 'User "%s" authenticated into the system' % username )

        # Create a new XMPP user
        logger.debug( 'Registering user "%s" into the XMPP system' % username )
        # TODO USER/PWD/LOCALHOST
        client = EjabberdAPIClient( host = xmppServerName, port = 4560, username = 'admin', password = 'meeousr', user_domain = 'localhost', protocol = 'http' )
        registered = client.register( user = username, host = 'localhost', password = password )
        if registered:
            logger.debug( 'User "%s" registered into the XMPP system' % username )
        else:
            logger.debug( 'User "%s" NOT registered into the XMPP system' % username )
            # TODO send mail
        return user
    except:
        logger.error( 'Error during user registration' )
        return None

def get_comm_users( user ):
    group_list = get_user_groups( user )

    users_list = []
    logger.debug( group_list )
    for group in group_list:
        group_name = group.name

        if group_name.upper() in [ 'CNR', 'INGV', 'NERC', 'SatCen' ]:
            users_list += get_group_users( group_name )

    return users_list

def get_user_groups( user ):
    logger.debug( "Getting user's groups" )
    user_groups = user.groups.all()
    logger.debug( 'Groups: "%s"' % user_groups )

    return user_groups

def get_group_users( group_name ):
    logger.debug( 'Getting users for group "%s"' % group_name )
    group_users = User.objects.filter( groups__name = group_name )
    logger.debug( 'Users: "%s"' % group_users )

    return group_users

def register_group( group_name, user ):
    # Get parent group permission
    parent_group = get_parent_group( group_name )

    # Get/Create the user group and add parent permissions
    user_group, created = Group.objects.get_or_create( name = group_name )

    for pg in parent_group:
        logger.debug( 'User''s parent group "%s"' % pg.name )
        # Add parent group permissions
        user_group.permissions.set( pg.permissions.all() )
        # Add user to parent group
        user.groups.add( pg )
        logger.debug( 'User added to "%s" group' % pg.name )
    # Add user to VRC group
    user.groups.add( user_group )
    logger.debug( 'User added to "%s" group' % user_group.name )

    return parent_group, user_group

def get_parent_group( group_name ):
    if group_name.upper() in [ 'CNR' ]:
        return [ Group.objects.get( name = 'SeaMonitoring' ) ]
    if group_name.upper() in [ 'INGV' ]:
        return [ Group.objects.get( name = 'SuperSites' ) ]
    if group_name.upper() in [ 'NERC' ]:
        return [ Group.objects.get( name = 'NaturalHazards' ) ]
    if group_name.upper() in [ 'SatCen' ]:
        return [ Group.objects.get( name = 'LandMonitoring' ) ]
    # TODO
    if group_name.upper() in [ 'MEEO' ]:
        return [ Group.objects.get( name = 'SeaMonitoring' ), Group.objects.get( name = 'SuperSites' ), Group.objects.get( name = 'NaturalHazards' ), Group.objects.get( name = 'LandMonitoring' ), Group.objects.get( name = 'Citizens' ), Group.objects.get( name = 'UserSupport' ) ]
    # TODO admin
    #if group_name.upper() in [ 'Citizens' ]:

    return [ Group.objects.get( name = 'Citizens' ) ]
