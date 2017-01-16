'''
Created on Oct 3, 2016

@author: ferraresi
'''

import logging
import unittest

from Client import Client

class Test( unittest.TestCase ):

    def test1( self ):
        logging.basicConfig( level = logging.DEBUG )

        # Check Input Parameters
        with self.assertRaises( ValueError ):
            errorClient = Client()

        # Terra2 results search
        t2OsClient = Client( endpoint = 'https://data2.terradue.com/eop/ever-est/dataset/search/', type = 'results' )
        self.assertIsInstance(t2OsClient, Client)

        # FEDEO collection search
        # TODO httpS
        feOsClient = Client( descriptionUrl = 'http://fedeo.esa.int/opensearch/description.xml', type = 'collection' )
        self.assertIsInstance(feOsClient, Client)
        
        # FEDEO results search
        # TODO httpS
        feOsClient = Client( descriptionUrl = 'http://fedeo.esa.int/opensearch/description.xml?parentIdentifier=EOP:ESA:SMOS:MIR_SCSx1C', type = 'results' )
        self.assertIsInstance(feOsClient, Client)


if __name__ == "__main__":
    unittest.main()
