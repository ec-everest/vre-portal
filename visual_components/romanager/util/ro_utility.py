#############################################
#Author:        Sergio Ferraresi <ferraresi@meeo.it>
#Version:       0.1
#Description:   RO file generation module
#Changelog:
#               Wed Nov 25 12:13:14 CEST 2015 (Sergio)
#               File Created
#############################################

import requests
import json
import sys

from os import path
from util import RoUtility

def main():
    # Get RO list
    print "RO List"
    raw_input("Press Enter to continue...")
    roList = RoUtility.getRoList()
    for ro in roList:
        print ro

    raw_input("Press Enter to continue...")
    
    # Create/Retrive a RO
    print "RO Creation: 'My Ro 5'"
    raw_input("Press Enter to continue...")
    ro = RoUtility( "My Ro 5", "my_ro_5" ) # "EVER-EST RO Test", "ever-est-ro-test"

    raw_input("Press Enter to continue...")
    
    
    # Add a t2flow file to the RO 
    print "RO Resource Upload and Annotate: 'AL1_OESR_AV2_OBS_11_20071114T104027_20071114T104354_009618_0324_2880_0001_BI.PNG'"
    raw_input("Press Enter to continue...")
    p = 'AL1_OESR_AV2_OBS_11_20071114T104027_20071114T104354_009618_0324_2880_0001_BI.PNG'
    baseName = path.basename(p)
    fileName = path.splitext(baseName)[0]
    ro.uploadResourceToRo(resourcePath=p, resourcePathInRo="wfs/" + fileName, resourceMimeType='application/xml') # title="MEA Call Workflow", description="Workflow creation test."
    ro.annotateResource(resourcePathInRo="wfs/" + baseName, annotationName="ann2", annotationPathInRo='ann/', annotation="Test Annotation 2")

    raw_input("Press Enter to continue...")

    print 'Finished'
    raw_input("Press Enter to continue...")
    
    #doiDesc = ZenodoUtility().upload(filePath=pngPath)
    #print "ID:\t" + str(doiDesc.id_)
    #print "DOI:\t" + doiDesc.doi
    #print "DOI URL:\t" + doiDesc.doi_url
    #print "TITLE:\t" + doiDesc.title
    #print "CREATED:\t" + str(doiDesc.createdOn)
    #print "RECORD ID:\t" + str(doiDesc.record_id)
    #print "RECORD URL:\t" + doiDesc.record_url
    
    # doiDesc.doi_url => but not in test "http://dx.doi.org/10.5281/zenodo.30977"
    #ro.uploadResourceToRo(resourcePath='http://dx.doi.org/10.5281/zenodo.30977', resourceMimeType='application/vnd.wf4ever.proxy') # title="MEA Workflow Output", description="Output PNG (uploaded on Zenodo)."


class DoiDescriptor():
    """
    TODO
    """
    
    def __init__(self, id_=None, doi=None, doi_url=None, title=None, createdOn=None, record_id=None, record_url=None):
        """
        TODO
        """
        # TODO checks
        
        self.id_ = id_
        self.doi = doi
        self.doi_url = doi_url
        self.title = title
        self.createdOn = createdOn
        self.record_id = record_id
        self.record_url = record_url


class ZenodoUtility():
    """
    Utility class used to upload data on Zenodo.
    """
    ZENODO_ACCESS_TOKEN = 'access_token=v3oao0Ugsf1vRFYf6ljGwMOy265iR1kZ1kvlZ8ybbREDvoyUqhvRoTXMsIQ0'
    ZSNDBX_ACCESS_TOKEN = 'access_token=mjFYkvzvWymhr6YcmuOx2iSuY52vr7C8gb8bHFkEOgDtaUb9vNOgEcKLLo1w'
    ZENODO_URL = 'https://zenodo.org/api/deposit/depositions'
    ZSNDBX_URL = 'https://sandbox.zenodo.org/api/deposit/depositions'
    
    def __init__(self):
        pass
    
    def upload(self, filePath=None):
        """
        TODO
        """
        if filePath is None:
            raise TypeError( "The 'filePath' parameter MUST be a valid string." )
        
        # Create deposition
        headers = {"Content-Type": "application/json"}
        data = {"metadata": {"title": "Upload Test", "upload_type": "image", "image_type": "figure", "description": "<p>Test</p>", "publication_date": "2015-11-27", "creators": [{"name":"Ferraresi, Sergio", "affiliation": "MEEO S.r.l."}], "access_right": "open", "license": "cc-by"}}
        r = requests.post(self.ZSNDBX_URL + "?" + self.ZSNDBX_ACCESS_TOKEN, data=json.dumps(data), headers=headers)
        if r.status_code == 201:
            deposition_id = r.json()[ 'id' ]
            
            print "Deposition ID: " + str(deposition_id)
            
            # File Upload
            data = {'filename': path.basename(filePath)}
            files = {'file': open(filePath, 'rb')}
            r = requests.post(self.ZSNDBX_URL + "/" + str(deposition_id) + "/files?" + self.ZSNDBX_ACCESS_TOKEN, data=data, files=files)
            if r.status_code == 201:
                # Pubish File
                r = requests.post(self.ZSNDBX_URL + "/" + str(deposition_id) + "/actions/publish?" + self.ZSNDBX_ACCESS_TOKEN)
                
                if r.status_code == 202:
                    print "Final JSON"
                    print r.json()
                    
                    id_ = r.json()[ 'id' ]
                    doi = r.json()[ 'doi' ]
                    doi_url = r.json()[ 'doi_url' ]
                    title = r.json()[ 'title' ]
                    createdOn = r.json()[ 'created' ]
                    record_id_ = r.json()['record_id']
                    record_url = r.json()['record_url']
                    return DoiDescriptor(id_, doi, doi_url, title, createdOn, record_id_, record_url)
                else:
                    self.manageError(r)
            else:
                self.manageError(r)
        else:
            self.manageError(r)
        
        return None
    
    def manageError(self, request):
        """
        TODO
        """
        status = request.json()[ 'status' ]
        message = request.json()[ 'message' ]
        errors = request.json()[ 'errors' ] if request.json().has_key('errors') else None # a JSON array of objects, with the attributes message and code, and possibly field for validation errors
        print str(status) + " - " + message
        if errors is not None:
            print errors

if __name__ == "__main__":
    sys.exit(main())