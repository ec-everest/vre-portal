from django.conf.urls import url

from . import views

urlpatterns = [
    # ro manager
    url( r'^$'       , views.init   , name='init'    ),
    url( r'^init/$'  , views.init   , name='init'    ),
    url( r'^create/' , views.create , name='create'  ),
    url( r'^delete/' , views.delete , name='delete'  ),
    url( r'^search/' , views.search , name='search'  ),
    url( r'^content/', views.content, name='content' ),
]
