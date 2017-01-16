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
import re
import sys

from os import path
from Utility import Utility

class RoUtility():
    """
    Utility class used to manage Research Objects (ROs).
    
    RO API Methods:
        * getRoList: get a list of ROs
        * getRo: retrieve a RO
        * createRo: create a RO
    * delete a RO
        * uploadResourceToRo: aggregate a Resource within a RO
    * de-aggregate a resource within a RO
    * Update/retrieve an aggregated Resource
        * annotateResource: annotate a Resource within a RO
    * Update/retrieve/delete an annotation
    * Create/retrieve/delete a folder
    * Add/delete a resource to/from a folder
    
    RO Evolution (EVO) API Methods:
    * Create a copy job
    * Create a finalization job
    * Check the status of a job
    * Get the evolution history of a research object
    
    Checklist Evaluation API Methods:
    * Get an evaluation for an RO, a minim model and a target defined in this model
    
    Stability Evaluation API Methods:
    * Get a stability evaluation for an RO, a minim model and a target defined in this model
    
    Recommendation API Methods:
    * Get a recommendation set for a user
    * Get a contextualized recommendation for a user
    
    Workflow Abstraction API Methods:
    * Find workflows that contain a provided set of workflow processes
    * Get a recommended workflow process following a provided sequence of workflow processes
    
    Workflow Runner API Methods:
    * Finding default workspace to redirect to the RO workspace of the default server
    * Retrieving runs in workspace
    * Submitting a new run to workspace
    * Retrieving a run
    * Retrieving the workflow status
    * Changing the workflow status to initiate running of the workflow
    * Retrieving the outputs when the workflow run has finished
    
    Workflow-RO Transformation API Methods:
    * Create a transformation job
    * Get a status of a transformation job
    * Cancel a transformation job
    
    User Management API Methods:
    * Create/retrieve/update/delete a user.
    * Create/retrieve/delete a client application.
    * Create/delete an access token.
    * Get the owner of an access token
    ###############
    """
    
    #STD_PATH        = '/opt/mea/gui/static/ros/'
    ##STD_PATH        = '/home/ferraresi/repository/mea/branches/maas/mea/gui/static/ros/'
    #STD_EXTENSION   = '.zip'
    
    BASE_URL = 'http://sandbox.wf4ever-project.org/rodl/'
    BEARER  = 'Bearer f3b38e91-34c0-4ece-94f7-2b955fd93d60'
    
    def __init__(self, roName=None, roFilename=None, retrieveAndCreate=True):
        """
        Create an empty Research Object in the STD_PATH directory (/opt/mea/gui/static/ros/).
        
        Args:
            roName: the Name of the Research Object
            roFilename: the file name of the Research Object
        """
        self.created = False
        self.found = False
        self.location = None
        self.content = {}
        
        if roName is None:
            raise TypeError( "The 'roName' parameter MUST be a valid string." )
        if roFilename is None:
            raise TypeError( "The 'roFilename' parameter MUST be a valid string." )
        
        # Research Object Name
        self.roName = roName
        self.roFilename = roFilename;
        ##self.roFilenameExt = self.roFilename + self.STD_EXTENSION
        ## Research Object file path
        #self.roPath = self.STD_PATH + self.roFilename
        ##self.roPathExt = self.STD_PATH + self.roFilenameExt
        #
        ## Create Research Object folder
        #if not path.exists(self.roPath):
        #    makedirs(self.roPath)
        #
        #call( [ "/home/ferraresi/repository/git/ro-manager/src/ro", "create", self.roName, "-d", self.roPath ] )
        
        if retrieveAndCreate:
            try:
                [self.found, self.content] = self.getRo( downloadZip=False )
            except Exception as e:
                # If the Exception contains a 404 message, then the RO does not exist. So, we need to create it.
                if '404' in e.message:
                    [self.created, self.location, self.roFilename] = self.createRo()
                else:
                    raise e
        else:
            [self.created, self.location, self.roFilename] = self.createRo()
    
    def createRo(self):
        """
        Create a Research Object (RO).
        
        Returns:
            True if no errors, an Exception otherwise
        """
        
        if self.roFilename is None:
            raise TypeError( "The 'roName' parameter MUST be a valid string." )
        
        try:
            # Compose URL
            url = self.BASE_URL + 'ROs/'
            
            # Create POST Header
            headers = { 'Accept': 'text/turtle', 'Slug': self.roFilename, 'Authorization': self.BEARER }
            
            # POST call
            r = requests.post( url, headers=headers )
            
            # Check Response
            if r.ok:
                location = r.headers['location']
                split = location.split('/')
                return [True, location, split[len(split) - 2]]
            
            return [False, None]
            
        except Exception as e:
            # Generic Error
            raise e
        else:
            # Response Error
            raise Exception( 'Error creating RO: ' + str(r.status_code) + ' - ' + r.text )
    
    @staticmethod
    def getRoList():
        """
        Retrive the Research Object (RO) list.
        
        Returns:
            a list of ROs if no errors, an Exception otherwise
        """
        
        try:
            # Compose URL
            url = RoUtility.BASE_URL + 'ROs/'
            
            # Create POST Header
            headers = { 'Authorization': RoUtility.BEARER }
            
            # POST call
            r = requests.get( url, headers=headers )
            
            # Check Response
            if r.ok:
                return r.text.split()
            
        except Exception as e:
            # Generic Error
            raise e
        else:
            # Response Error
            raise Exception( 'Error retriving RO list: ' + str(r.status_code) + ' - ' + r.text )
    
    def getRo(self, downloadZip=False):
        """
        Retrive the Research Object (RO).
        
        Args:
            downloadZip: True to download the zip in the current working directory, False otherwise
        
        Returns:
            True if no errors, an Exception otherwise
        """
        
        try:
            # Compose URL
            url = self.BASE_URL + 'ROs/' + self.roFilename + '/'
            
            # Create POST Header
            headers = { 'Accept': 'application/zip' if downloadZip else 'text/turtle', 'Authorization': self.BEARER }
            
            # POST call
            r = requests.get( url, headers=headers )
            
            # Check Response
            if r.ok:
                if downloadZip:
                    try:
                        Utility.saveZip( zipName=self.roFilename, response=r )
                        
                    except Exception as e:
                        return 'Error retriving RO as ZIP file: ' + str(e)
                else:
                    # TODO
                    lines = r.content.split('\n')
                    for l in lines:
                        if 'ore:aggregates' in l:
                            m = re.findall('<(.+?)>', l)
                            
                            return [True, m]
                return [True, None]
            
        except Exception as e:
            # Generic Error
            raise e
        else:
            # Response Error
            raise Exception( 'Error retriving RO: ' + str(r.status_code) + ' - ' + r.text )
    
    def uploadResourceToRo(self, resourcePath, resourcePathInRo=None, resourceMimeType='text/plain'):
        """
        Upload a resource to a Research Object (RO).
        
        Args:
            resourcePath: the Path of the Resource to upload
            resourcePathInRo: the Research Object internal Path where to save the Resource. If not specified, the Resource is external
            resourceMimeType: the MIME Type of the Resource (default: text/plain). See: http://www.freeformatter.com/mime-types-list.html
        
        Returns:
            True if no errors, an Exception otherwise
        
        Examples:
            internal resource upload:
                uploadResourceToRo( resourcePath='/path/to/the/workflow.t2flow', resourcePathInRo='path/in/ro/workflow.t2flow', resourceMimeType='application/xml' )
            
            external resource upload:
                uploadResourceToRo( resourcePath='https://sandbox.zenodo.org/record/445', resourceMimeType='application/vnd.wf4ever.proxy' )
        """
        
        if self.roFilename is None:
            raise TypeError( "The 'roName' parameter MUST be a valid string." )
        if resourcePath is None:
            raise TypeError( "The 'resourcePath' parameter MUST be a valid string." )
        if resourcePathInRo is not None and not path.exists( resourcePath ):
            raise TypeError( "The 'resourcePath' parameter does not exist." )
        #if resourcePathInRo is None:
        #    raise TypeError( "The 'resourcePathInRo' parameter MUST be a valid string." )
        if resourceMimeType is None:
            raise TypeError( "The 'resourceMimeType' parameter MUST be a valid MIME Type string." )
        
        try:
            # Compose URL
            url = self.BASE_URL + 'ROs/' + self.roFilename
            
            # Create POST Header
            if not url.endswith( '/' ):
                url += '/'
            slug = resourcePathInRo if resourcePathInRo is not None else resourcePath
            headers = { 'Content-Type': resourceMimeType, 'Slug': slug, 'Authorization': self.BEARER }
            
            if resourcePathInRo is not None:
                # If internal resource, Prepare POST Data
                f = open( resourcePath, 'r' )
                wfTxt = f.read()
                f.close()
                
                # POST call
                r = requests.post( url, headers=headers, data=wfTxt )
            else:
                # POST call
                r = requests.post( url, headers=headers )
            
            # Check Response
            if r.ok:
                return True
            
        except Exception as e:
            # Generic Error
            raise e
        else:
            # Response Error
            reType = 'Internal' if resourcePathInRo is not None else 'External'
            raise Exception( reType + ' Resource Addition error: ' + str(r.status_code) + ' - ' + r.text )
    
    def annotateResource(self, resourcePathInRo, annotationName, annotationPathInRo, annotation):
        """
        Add an annotation to a resource.
        
        Args:
            resourcePathInRo: the Research Object (RO) path of the Resource to annotate
            annotationName: the Name of the file in which save the Annotation 
            annotationPathInRo: the Research Object (RO) path of the Annotation
            annotation: the Text of the Annotation
        
        Returns:
            True if no errors, an Exception otherwise
        """
        
        if resourcePathInRo is None:
            raise TypeError( "The 'resourcePathInRo' parameter does not exist." )
        
        try:
            # Compose URL
            url = self.BASE_URL + 'ROs/' + self.roFilename
            
            # Create POST Header
            if not url.endswith( '/' ):
                url += '/'
            link = url + resourcePathInRo
            slug = annotationPathInRo
            if not slug.endswith( '/' ):
                slug += '/'
            slug += annotationName 
            if not slug.endswith( '.ttl' ):
                slug += '.ttl'
            headers = { 'Content-Type': 'text/turtle', 'Link': link, 'Slug': slug, 'Authorization': self.BEARER }
            
            # Prepare POST Data    
            annText = '<' + url + slug + '> dcterm:description ' + annotation
    
            # POST call
            r = requests.post( url, headers=headers, data=annText )
            
            # Check Response
            if r.ok:
                return True
            
        except Exception as e:
            # Generic Error
            raise e
        else:
            # Response Error
            raise Exception( 'Resource Annotation Error: ' + str(r.status_code) + ' - ' + r.text )