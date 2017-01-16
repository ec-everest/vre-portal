import Auth
import logging
import os

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.shortcuts import render, redirect

logger = logging.getLogger( __name__ )

def get_login( request ):
    return redirect( Auth.get_login() )

def is_auth( request ):
    out_call = Auth.is_auth( request )
    if out_call[ 'error_message' ] is not None and 'login_required' in out_call[ 'error_message' ]:
        return JsonResponse( { 'error_message': 'login_required', 'url': Auth.get_login() } )
    else:
        return JsonResponse( out_call )

def fallback_login( request ):
    return render( request, 'login.html' )

def do_login( request ):
    # Check user existance
    try:
        username=request.POST[ 'usr' ]
        password=request.POST[ 'pwd' ]
        user = authenticate( username = username, password = password )
    except:
        user = None
    
    if user is not None:
        # Password verified for the user
        if user.is_active:
            # User Active
            login( request, user )

            return redirect( '/index.html' )
        else:
            # User Not Active
            return render( request, 'login.html', context = {
                'error_message': 'Sorry "%s" but this account is not enabled' % user.username,
            } )
    else:
        # Username or password incorrect
        return render( request, 'login.html', context = {
            'error_message': 'The username or password were incorrect.',
        } )

def get_community_users( request ):
    return JsonResponse( Auth.get_community_users( request.user ) )

def do_logout( request ):
    logout( request )
    
    return redirect( '/index.html' )
