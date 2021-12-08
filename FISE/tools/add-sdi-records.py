import requests
import csv
from contextlib import closing
from datetime import datetime
import xml.etree.ElementTree as ET

SDI_API_URL = 'https://sdi.eea.europa.eu/catalogue/fise/api'

# get Spatial datasets form SDI

def querySDIDatasetsRecords():
    records  = {"datasets" : []}
    search_url = SDI_API_URL + "/search/records/_search?bucket=metadata"
    payload = {
        "from": 0,
        "size": 120,
        "sort": [
            "_score"
        ],
        "query": {
            "function_score": {
                "boost": "5",
                "functions": [
                    {
                        "filter": {
                            "exists": {
                                "field": "parentUuid"
                            }
                        },
                        "weight": 0.3
                    },
                    {
                        "filter": {
                            "match": {
                                "cl_status.key": "obsolete"
                            }
                        },
                        "weight": 0.3
                    },
                    {
                        "filter": {
                            "match": {
                                "codelist_status": "superseded"
                            }
                        },
                        "weight": 0.3
                    },
                    {
                        "gauss": {
                            "dateStamp": {
                                "scale": "365d",
                                "offset": "90d",
                                "decay": 0.5
                            }
                        }
                    }
                ],
                "score_mode": "multiply",
                "query": {
                    "bool": {
                        "must": [
                            {
                                "query_string": {
                                    "query": "(cl_hierarchyLevel.key:\"dataset\")"
                                }
                            },
                            {
                                "terms": {
                                    "isTemplate": [
                                        "n"
                                    ]
                                }
                            }
                        ],
                        "filter": [

                        ]
                    }
                }
            }
        },
        "aggregations": {
            "cl_hierarchyLevel.key": {
                "terms": {
                    "field": "cl_hierarchyLevel.key"
                },
                "aggs": {
                    "format": {
                        "terms": {
                            "field": "format"
                        }
                    }
                }
            },
            "groupOwner": {
                "terms": {
                    "field": "groupOwner",
                    "size": 10
                }
            },
            "th_gemet_tree": {
                "terms": {
                    "field": "thesaurus_geonetworkthesaurusexternalthemegemet_tree",
                    "size": 500,
                    "order": {
                        "_key": "asc"
                    },
                    "include": "[^^]+^?[^^]+"
                },
                "meta": {
                    "collapsed": True
                }
            },
            "inspireTheme": {
                "terms": {
                    "field": "inspireTheme",
                    "size": 20
                },
                "meta": {
                    "collapsed": True
                }
            },
            "th_httpinspireeceuropaeumetadatacodelistPriorityDatasetPriorityDataset_tree": {
                "terms": {
                    "field": "th_httpinspireeceuropaeumetadatacodelistPriorityDatasetPriorityDataset_tree",
                    "size": 100,
                    "order": {
                        "_key": "asc"
                    }
                },
                "meta": {
                    "collapsed": True
                }
            },
            "tag.default": {
                "terms": {
                    "field": "tag.default",
                    "include": ".*",
                    "size": 10
                },
                "meta": {
                    "userHasRole": "isAdministratorOrMore",
                    "collapsed": True,
                    "caseInsensitiveInclude": True
                }
            },
            "OrgForResource": {
                "terms": {
                    "field": "OrgForResource",
                    "include": ".*",
                    "size": 15
                },
                "meta": {
                    "caseInsensitiveInclude": True
                }
            },
            "creationYearForResource": {
                "histogram": {
                    "field": "creationYearForResource",
                    "interval": 5,
                    "keyed": True,
                    "min_doc_count": 1
                },
                "meta": {
                    "collapsed": True
                }
            },
            "cl_spatialRepresentationType.key": {
                "terms": {
                    "field": "cl_spatialRepresentationType.key",
                    "size": 10
                }
            },
            "cl_maintenanceAndUpdateFrequency.key": {
                "terms": {
                    "field": "cl_maintenanceAndUpdateFrequency.key",
                    "size": 10
                },
                "meta": {
                    "collapsed": True
                }
            },
            "cl_status.key": {
                "terms": {
                    "field": "cl_status.key",
                    "size": 10
                }
            },
            "resolutionScaleDenominator": {
                "histogram": {
                    "field": "resolutionScaleDenominator",
                    "interval": 100000,
                    "keyed": True,
                    "min_doc_count": 1
                },
                "meta": {
                    "collapsed": True
                }
            },
            "thesaurus_geonetworkthesaurusexternalplaceregions_tree": {
                "terms": {
                    "field": "thesaurus_geonetworkthesaurusexternalplaceregions_tree",
                    "size": 400,
                    "order": {
                        "_key": "asc"
                    },
                    "include": "Europe.*|EEA.*|EU.*"
                },
                "meta": {
                    "collapsed": True
                }
            }
        },
        "_source": {
            "includes": [
                "uuid"
            ]
        },
        "track_total_hits": True
    }

    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }

    with closing(requests.post(search_url, headers=headers, json=payload, stream=True)) as response:
        if response:
            results = response.json()

            for item in results['hits']['hits']:
                tmp = {"uuid": item['_source']['uuid']}
                records["datasets"].append(tmp)
        else:
            print("Error occured at SDI API POST request for Datasets" + search_url)

    return records["datasets"]

# Get SDI serfices records

def querySDIServicesRecords():
    records  = {"services" : []}
    search_url = SDI_API_URL + "/search/records/_search?bucket=metadata"
    payload = {
        "from":0,
        "size":120,
        "sort":[
            "_score"
        ],
        "query":{
            "function_score":{
                "boost":"5",
                "functions":[
                    {
                    "filter":{
                        "exists":{
                            "field":"parentUuid"
                        }
                    },
                    "weight":0.3
                    },
                    {
                    "filter":{
                        "match":{
                            "cl_status.key":"obsolete"
                        }
                    },
                    "weight":0.3
                    },
                    {
                    "filter":{
                        "match":{
                            "codelist_status":"superseded"
                        }
                    },
                    "weight":0.3
                    },
                    {
                    "gauss":{
                        "dateStamp":{
                            "scale":"365d",
                            "offset":"90d",
                            "decay":0.5
                        }
                    }
                    }
                ],
                "score_mode":"multiply",
                "query":{
                    "bool":{
                    "must":[
                        {
                            "query_string":{
                                "query":"(cl_hierarchyLevel.key:\"service\")"
                            }
                        },
                        {
                            "terms":{
                                "isTemplate":[
                                "n"
                                ]
                            }
                        }
                    ],
                    "filter":[
                        
                    ]
                    }
                }
            }
        },
        "aggregations":{
            "cl_hierarchyLevel.key":{
                "terms":{
                    "field":"cl_hierarchyLevel.key"
                },
                "aggs":{
                    "format":{
                    "terms":{
                        "field":"format"
                    }
                    }
                }
            },
            "groupOwner":{
                "terms":{
                    "field":"groupOwner",
                    "size":10
                }
            },
            "th_gemet_tree":{
                "terms":{
                    "field":"thesaurus_geonetworkthesaurusexternalthemegemet_tree",
                    "size":500,
                    "order":{
                    "_key":"asc"
                    },
                    "include":"[^^]+^?[^^]+"
                },
                "meta":{
                    "collapsed":True
                }
            },
            "inspireTheme":{
                "terms":{
                    "field":"inspireTheme",
                    "size":20
                },
                "meta":{
                    "collapsed":True
                }
            },
            "th_httpinspireeceuropaeumetadatacodelistPriorityDatasetPriorityDataset_tree":{
                "terms":{
                    "field":"th_httpinspireeceuropaeumetadatacodelistPriorityDatasetPriorityDataset_tree",
                    "size":100,
                    "order":{
                    "_key":"asc"
                    }
                },
                "meta":{
                    "collapsed":True
                }
            },
            "tag.default":{
                "terms":{
                    "field":"tag.default",
                    "include":".*",
                    "size":10
                },
                "meta":{
                    "userHasRole":"isAdministratorOrMore",
                    "collapsed":True,
                    "caseInsensitiveInclude":True
                }
            },
            "OrgForResource":{
                "terms":{
                    "field":"OrgForResource",
                    "include":".*",
                    "size":15
                },
                "meta":{
                    "caseInsensitiveInclude":True
                }
            },
            "creationYearForResource":{
                "histogram":{
                    "field":"creationYearForResource",
                    "interval":5,
                    "keyed":True,
                    "min_doc_count":1
                },
                "meta":{
                    "collapsed":True
                }
            },
            "cl_spatialRepresentationType.key":{
                "terms":{
                    "field":"cl_spatialRepresentationType.key",
                    "size":10
                }
            },
            "cl_maintenanceAndUpdateFrequency.key":{
                "terms":{
                    "field":"cl_maintenanceAndUpdateFrequency.key",
                    "size":10
                },
                "meta":{
                    "collapsed":True
                }
            },
            "cl_status.key":{
                "terms":{
                    "field":"cl_status.key",
                    "size":10
                }
            },
            "resolutionScaleDenominator":{
                "histogram":{
                    "field":"resolutionScaleDenominator",
                    "interval":100000,
                    "keyed":True,
                    "min_doc_count":1
                },
                "meta":{
                    "collapsed":True
                }
            },
            "th_regions_tree.default":{
                "terms":{
                    "field":"th_regions_tree.default",
                    "size":400,
                    "order":{
                    "_key":"asc"
                    },
                    "include":"Europe.*|EEA.*|EU.*"
                },
                "meta":{
                    "collapsed":True
                }
            }
        },
        "_source":{
            "includes":[
                "uuid",
                "id",
                "creat*",
                "group*",
                "logo",
                "category",
                "topic*",
                "inspire*",
                "resource*",
                "draft",
                "overview.*",
                "owner*",
                "link*",
                "image*",
                "status*",
                "rating",
                "tag*",
                "geom",
                "contact*",
                "*Org*",
                "hasBoundingPolygon",
                "isTemplate",
                "valid",
                "isHarvested",
                "dateStamp",
                "documentStandard",
                "standardNameObject.default",
                "cl_status*",
                "mdStatus*",
                "recordLink"
            ]
        },
        "track_total_hits":True
        }

    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }

    with closing(requests.post(search_url, headers=headers, json=payload, stream=True)) as response:
        if response:
            results = response.json()

            for item in results['hits']['hits']:
                tmp = {"uuid": item['_source']['uuid']}
                records["services"].append(tmp)
        else:
            print("Error occured at SDI API POST request for Services" + search_url)

    return records["services"]

# Parse record metadata xml file - eg: https://sdi.eea.europa.eu/catalogue/fise/api/records/94530236-1a4e-450f-8ae4-87899dc4b141/formatters/xml

def parseSDIMetadataXML(xml_content):
    record = {}

    try:
        tree = ET.fromstring(xml_content)
        record['RESOURCE_TITLE'] = 'Unknown'
        title = tree.find(
            ".//{http://www.isotc211.org/2005/gmd}MD_DataIdentification/{http://www.isotc211.org/2005/gmd}citation/{http://www.isotc211.org/2005/gmd}CI_Citation/{http://www.isotc211.org/2005/gmd}title/{http://www.isotc211.org/2005/gco}CharacterString")
        if title is not None:
            record['RESOURCE_TITLE'] = title.text.encode('utf8').strip()
        else:
            title = tree.find(
            ".//{http://www.isotc211.org/2005/gmd}identificationInfo/{http://www.isotc211.org/2005/srv}SV_ServiceIdentification/{http://www.isotc211.org/2005/gmd}citation/{http://www.isotc211.org/2005/gmd}CI_Citation/{http://www.isotc211.org/2005/gmd}title/{http://www.isotc211.org/2005/gco}CharacterString")

            if title is not None:
                record['RESOURCE_TITLE'] = title.text.encode('utf8').strip()

        record['Description'] = 'Unknown'
        abstract = tree.find(
            ".//{http://www.isotc211.org/2005/gmd}MD_DataIdentification/{http://www.isotc211.org/2005/gmd}abstract/{http://www.isotc211.org/2005/gco}CharacterString")

        if abstract is not None:
            record['Description'] = abstract.text.encode('utf8').strip()
        else:
            abstract = tree.find(
            ".//{http://www.isotc211.org/2005/gmd}identificationInfo/{http://www.isotc211.org/2005/srv}SV_ServiceIdentification/{http://www.isotc211.org/2005/gmd}abstract/{http://www.isotc211.org/2005/gco}CharacterString")

            if abstract is not None:
                record['Description'] = abstract.text.encode('utf8').strip()

        record['RESPONSIBLE_ORGANISATION_MAIN_PAGE'] = ''
        record['Organisation_name'] = tree.find(
            ".//{http://www.isotc211.org/2005/gmd}contact/{http://www.isotc211.org/2005/gmd}CI_ResponsibleParty/{http://www.isotc211.org/2005/gmd}organisationName/{http://www.isotc211.org/2005/gco}CharacterString").text.encode('utf8')
        record['Organisation_email'] = tree.find(".//{http://www.isotc211.org/2005/gmd}contact/{http://www.isotc211.org/2005/gmd}CI_ResponsibleParty/{http://www.isotc211.org/2005/gmd}contactInfo/{http://www.isotc211.org/2005/gmd}CI_Contact/{http://www.isotc211.org/2005/gmd}address/{http://www.isotc211.org/2005/gmd}CI_Address/{http://www.isotc211.org/2005/gmd}electronicMailAddress/{http://www.isotc211.org/2005/gco}CharacterString").text.encode('utf8')
        language = tree.find(".//{http://www.isotc211.org/2005/gmd}language/{http://www.isotc211.org/2005/gmd}LanguageCode")
        if language is None:
            language = tree.find(".//{http://www.isotc211.org/2005/gmd}language/{http://www.isotc211.org/2005/gco}CharacterString")

            if language is None:
                record['LANGUAGE'] = 'unknown'
            else:
                record['LANGUAGE'] = language.text.encode('utf8')
        else:
            record['LANGUAGE'] = language.get('codeListValue').encode('utf8')

        record['Content_type'] = 'SDI'

        resource_type = tree.find(".//{http://www.isotc211.org/2005/gmd}hierarchyLevel/{http://www.isotc211.org/2005/gmd}MD_ScopeCode").get('codeListValue').encode('utf8')

        if resource_type == 'dataset':
            record['Content_type'] = 'Spatial dataset'
        
        if resource_type == 'service':
            record['Content_type'] = 'Data services'

        record['UPDATE_FREQUENCY'] = 'unknown'

        maintain = tree.find(".//{http://www.isotc211.org/2005/gmd}maintenanceAndUpdateFrequency/{http://www.isotc211.org/2005/gmd}MD_MaintenanceFrequencyCode")

        if maintain is not None:
            record['UPDATE_FREQUENCY'] = maintain.get('codeListValue').encode('utf8')


        # tree.find(".//{http://www.isotc211.org/2005/gmd}resourceMaintenance/{http://www.isotc211.org/2005/gmd}MD_MaintenanceInformation/{http://www.isotc211.org/2005/gmd}maintenanceAndUpdateFrequency/{http://www.isotc211.org/2005/gmd}MD_MaintenanceFrequencyCode").get('codeListValue').encode('utf8')

        publish_date = tree.find(
            ".//{http://www.isotc211.org/2005/gmd}MD_DataIdentification/{http://www.isotc211.org/2005/gmd}citation/{http://www.isotc211.org/2005/gmd}CI_Citation/{http://www.isotc211.org/2005/gmd}date/{http://www.isotc211.org/2005/gmd}CI_Date/{http://www.isotc211.org/2005/gmd}dateType/{http://www.isotc211.org/2005/gmd}CI_DateTypeCode[@codeListValue='publication']/../../{http://www.isotc211.org/2005/gmd}date/{http://www.isotc211.org/2005/gco}Date")
        if publish_date is None:
            record['YEAR_PUBLISHED'] = ''
        else:
            record['YEAR_PUBLISHED'] = datetime.strptime(
                publish_date.text, '%Y-%m-%d').year

        record['KEYWORDS'] = ''
        
        keywords = tree.findall(
            ".//{http://www.isotc211.org/2005/gmd}descriptiveKeywords/{http://www.isotc211.org/2005/gmd}MD_Keywords/{http://www.isotc211.org/2005/gmd}type/{http://www.isotc211.org/2005/gmd}MD_KeywordTypeCode[@codeListValue='theme']/../../{http://www.isotc211.org/2005/gmd}keyword/{http://www.isotc211.org/2005/gco}CharacterString")

        for k in keywords:
            if k.text is not None:
                record['KEYWORDS'] += k.text.encode('utf8') + ', '
    except ET.ParseError as err:
        print(err)

    return record


def getSDIRecords(uuid_list):
    lang_names = {
        'ita': 'Italian',
        'eng': 'English',
        'ger': 'German',
        'deu': 'German',
        'spa': 'Spanish',
        'por': 'Portuguese',
        'unknown': 'Unknown'
    }

    country_names = {
        'ita': 'Italy',
        'eng': 'Pan European (EEA)',
        'ger': 'Switzerland',
        'deu': 'Switzerland',
        'spa': 'Spain',
        'por': 'Portugal',
        'unknown': 'Unknown'
    }

    sdirecords = []

    for item in uuid_list:
        record_url = SDI_API_URL + '/records/' + item['uuid']
        record_url_metadata = SDI_API_URL + \
            '/records/' + item['uuid'] + "/formatters/xml"
        with closing(requests.get(record_url_metadata, stream=True)) as response:
            print('Processing ' + record_url_metadata + '...')
            if response:
                print('Record ' + record_url_metadata +
                      ' retreived successfuly!')
                record = parseSDIMetadataXML(response.content)
                if (not record):
                    print('ERROR: For record ' + record_url_metadata + ' XML parse error arised!')
                else:
                    record['ID'] = item['uuid']
                    record['COUNTRY'] = country_names[record['LANGUAGE']]
                    record['COUNTRY_ID'] = 300
                    record['LANGUAGE'] = lang_names[record['LANGUAGE']]
                    record['Topics'] = 'All'
                    record['YEAR_DATA_COLLECTION_START'] = 'N.A.'
                    record['YEAR_DATA_COLLECTION_END'] = 'N.A.'
                    record['YEAR_NEXT_UPDATE'] = 'N.A.'
                    record['NUTS_levels'] = 'N.A.'
                    record['Source'] = record_url

                    sdirecords.append(record)
            else:
                print('Record ' + record_url_metadata + ' retrieving failed!')

    return sdirecords


def savetoCSV(records, filename):

    # specifying the fields for csv file
    fields = [
        'ID',
        'COUNTRY',
        'COUNTRY_ID',
        'DATA_TYPE',
        'DATA_SETS',
        'Content_type',
        'INFO_LEVEL',
        'Topics',
        'NFI_or_Forest_Stand_Info',
        'LINK_TO_HIGHER_INFORMATION_LEVEL',
        'ID_OF_HIGHER_INFORMATION_LEVEL',
        'ID_OF_OTHER_INFO_AT_SAME_LEVEL',
        'ID_OF_LOWER_INFORMATION_LEVEL',
        'RESOURCE_LOCATOR_INTERNAL',
        'RESOURCE_LOCATOR_INTERNAL_II',
        'Source',
        'RESPONSIBLE_ORGANISATION_MAIN_PAGE',
        'Organisation_name',
        'Organisation_email',
        'RESOURCE_TITLE',
        'Description',
        'LANGUAGE',
        'YEAR_PUBLISHED',
        'YEAR_DATA_COLLECTION_START',
        'YEAR_DATA_COLLECTION_END',
        'YEAR_NEXT_UPDATE',
        'NUTS_levels',
        'FOREST_OWNERSHIP_HA',
        'FOREST_TYPES_HA',
        'TREE_SPECIES_HA',
        'AGE_CLASSES_HA',
        'DIAMETER_(DBH)',
        'QUALITY_INDICATORS_HA',
        'FOREST_MANAGEMENT_HA',
        'AFFORESTATION_HA',
        'FELLING_HA',
        'ADDITIONAL_INFO_OLD',
        'ADDITIONAL_INFO',
        'KEYWORDS',
        'METADATA',
        'METADATA_LOCATION',
        'GEOGRAPHIC_BOUNDING_BOX_NORTH',
        'GEOGRAPHIC_BOUNDING_BOX_EAST',
        'GEOGRAPHIC_BOUNDING_BOX_SOUTH',
        'GEOGRAPHIC_BOUNDING_BOX_WEST',
        'PROJECTION',
        'SPATIAL_RESOLUTION',
        'FILE_SIZE',
        'To_transfer_Set_No',
        'Added_until_date',
        'Changed',
        'UPDATE_FREQUENCY'
    ]

    catalog_url = 'https://cmshare.eea.europa.eu/s/YZocgSHqKNbT4gn/download?path=/catalogue&files=catalogue.csv'

    # writing to csv file
    with open(filename, 'w') as csvfile:

        # creating a csv dict writer object
        writer = csv.DictWriter(csvfile, fieldnames=fields)

        # writing headers (field names)
        writer.writeheader()

        print('Writing records to ' + filename + ' csv file!')

        # get rows form catalog
        with closing(requests.get(catalog_url, stream=True)) as r:
            catalogReader = csv.DictReader(r.iter_lines())

            item = 0

            for row in catalogReader:
                if item != 0:
                    row['UPDATE_FREQUENCY'] = 'unknown'
                    writer.writerow(row)
                item += 1

        # writing data rows
        writer.writerows(records)

def main():
    # load sdi records from query file
    data = querySDIDatasetsRecords() + querySDIServicesRecords()

    # parse xml files and get records to be saved in catalog.csv
    sdirecords = getSDIRecords(data)

    # store new items in a csv file
    savetoCSV(sdirecords, '/tmp/FISE_catalogue_updated.csv')

if __name__ == "__main__":
    main()
