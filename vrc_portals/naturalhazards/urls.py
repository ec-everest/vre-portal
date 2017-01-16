from django.conf.urls import url

from . import views

urlpatterns = [
    # Natural Hazards
    url( r'^$'      , views.index, name = 'index' ), # VRC Home Page
    url( r'^index/$', views.index, name = 'index' ), # VRC Home Page
    #url( r'^init/'  , views.init , name = 'init'  ), # VRC Initializer
]