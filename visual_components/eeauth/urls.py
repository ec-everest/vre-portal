from django.conf.urls import url

from . import views

urlpatterns = [
    # user management login and logout
    url( r'^login/$'              , views.get_login          , name='get_login'           ),
    url( r'^do_login/$'           , views.do_login           , name='do_login'            ),
    url( r'^do_logout/$'          , views.do_logout          , name='do_logout'           ),
    url( r'^is_auth/$'            , views.is_auth            , name='is_auth'             ),
    url( r'^get_community_users/$', views.get_community_users, name='get_community_users' ),

    # fallback login without Identity Service Provider
    url( r'^fallback/$'           , views.fallback_login     , name='fallback_login'      ),
]
