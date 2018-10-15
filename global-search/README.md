
# Global Search application

## Ranking configuration

The configuration of ranking is done using the [relevance.json](https://github.com/eea/eea.esbootstrap.configs/blob/master/global-search/relevance.json) ([documentation](https://github.com/eea/eea.docker.esbootstrap/blob/master/docs/Details.md#relevance) 
We use:
- simple field boosting
- gauss and script_score functions
- reversed linear functions

### Field boosting:
We set different weight for fields, ex. title is more important than subject or description. 
```
"fields":[
            "title^2",
            "subject^1.5",
            "description^1.5",
            "searchable_spatial^1.2",
            "searchable_places^1.2",
            "searchable_objectProvides^1.4",
            "searchable_topics^1.2",
            "searchable_time_coverage^10",
            "searchable_organisation^2",
            "label",
            "all_fields_for_freetext"
        ]
```
But we have some special scenarios, where some fields are more important than others.
Ex 1: If the searched text is a year, the most important field for it is the time_coverage, so we 
Ex 2: If the searched text matches an organisation, it's more important than if it's mentioned somewhere in a description.

### Gauss function
```
"gauss": {
    "issued.date": {
        "scale": "2w"
    }
},
```
We prioritise newer documents, documents created in the last 14 days are more important than older ones.

### script_score on number of references
```
"script_score": {
    "script": "doc['items_count_references'].value*0.01"
}
```
We boost the documents with the most references

#### Reversed linear boost
```
"spatial": {
            "linear": {
                "items_count_spatial": {
                    "scale": 1,
                    "origin": 0
                }
            }
        }
```
Ex. if a country is selected, the documents with only 1 available country will have higher score than the ones with 2 available countries.