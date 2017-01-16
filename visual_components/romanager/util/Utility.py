#############################################
#Author:        Sergio Ferraresi <ferraresi@meeo.it>
#Version:       0.1
#Description:   RO file generation module
#Changelog:
#               Wed Jul 27 14:39:14 CEST 2016 (ferraresi)
#               File Created
#############################################

import requests
import json
import sys

from os import path

class Utility():
    """
    Generic Utility class.
    """
    
    def saveZip(self, response, zipName, zipPath=None):
        """
        Save the response returned object as a zip.
        
        Args:
            response: the Response which contains the zip
            zipName: the Name of the zip file. The 'zip' extension is not required
            zipPath: the Path where to save the zip file (optional, if not specified the path will be the script current working directory)
        
        Returns:
            the zip file
        """
        
        if response is None:
            raise TypeError( "The 'response' parameter MUST be a valid response." )
        if zipName is None:
            raise TypeError( "The 'zipName' parameter MUST be a valid string." )
    
        # Create zip file path
        p = ''
        if zipPath is not None:
            p = zipPath
            if not p.endswith( '/' ):
                p += '/'
        p += zipName
        if not p.endswith( '.zip' ):
            p += '.zip'
        
        # Create zip file
        f = open( p, 'wb' )
        for block in response.iter_content( 1024 ):
            f.write( block )
        f.close()
        
        # Return zip file
        return f