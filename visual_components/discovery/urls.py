from django.conf.urls import url

from . import views

urlpatterns = [
    # data discovery
    url( r'^repoinit/$', views.repoinit, name='repoinit' ),
    url( r'^search/'   , views.search  , name='search'   ),
    url( r'^download/' , views.download, name='download' ),
]