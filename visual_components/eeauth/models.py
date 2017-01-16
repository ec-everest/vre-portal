from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

class User_tokens ( models.Model ):
    #id = models.AutoField(primary_key = True)
    user = models.ForeignKey( User, on_delete = models.CASCADE )
    token = models.CharField( max_length = 100 )
    refresh_token = models.CharField( max_length = 100 )
    ins_tms = models.DateTimeField()

    class Meta:
        db_table = u'user_tokens'

class User_community ( models.Model ):
    #id = models.AutoField(primary_key = True)
    user = models.ForeignKey( User, on_delete = models.CASCADE )
    community_name = models.CharField( max_length = 100 )

    class Meta:
        db_table = u'user_community'
