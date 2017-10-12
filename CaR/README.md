# CaR - Countries and Regions application

The produciton application is reachable via the EEA Website under www.eea.europa.eu/countries-and-regions

## Setup

The CaR application is depoloyed via 
[EEA Rancher Catalog esbootstrap app](https://github.com/eea/eea.rancher.catalog/tree/master/templates/elastic-app-esbootstrap).

Some metadata is coming from EEA Plone Website (e.g. the name of countries, the description, background image and links). 
The above metadata content is exported as a Json file and retrieved on start-up by the CaR application.

If we have updated a bakcground image for a country or we have changed the introduction, 
the Json metadata file can be synced on-demand by triggering the following url:

```<your-car-app-ip>/tools/update_external_configs```

Instead of the car-app-ip you can use ```www.eea.europa.eu/countries-and-regions```, 
apache rewrite rules will take care on forwarding to the CaR application.

The external configs are also updated each time the container is restarted.

### Setting up the external configs
Add a section in your settings.json
```
"external_configs": {
    "protocol": "https",
    "host" : "www.eea.europa.eu",
    "path" : "/viewCountryRegionsJSON",
    "defaults" : "external_configs_defaults.json"
}
```
protocol, host and path fields are used for the url from where to download the external configs
defaults is the json file what is used for some default values, and it looks like:
```
{
    "fallback": {
        "body": "",
        "bg_url": "app_resources/images/backgrounds/austria_bg_web.jpg",
        "languages": [],
        "external_links": []
    },
    "austria": {
        "flag_url": "app_resources/images/flags/austria.png",
        "title": "Austria",
        "type": "country",
        "value": "Austria"
    },
    "arctic": {
        "flag_url": "",
        "title": "Arctic region",
        "type": "region",
        "value": ["Arctic", "Arctic Ocean", "Arctic Ocean (Alaska, United States)", "Marine Arctic Ocean", "Arctic (Arctic, NY 13730, Statele Unite ale Americii)"]
    },

...
}
```
In this file, optionally, we have the **fallback** section, where we can put all values what are the same for all countries/regions.
After the **fallback** section we have a section for each **country** and **region**.
Currently we have the following fields for each section:

 - title - the title of the country/region body - a short description
 - what is placed in top of the page, under the title flag_url - the flag of the country 
 - bg_url - the background image 
 - languages - a list with the available languages for the country, with the form: [["Croatian","hr"],["Turkish","tr"]]    
 - external_links - a list for the Official Country Pages, with the form: ["Environment Agency
   Austria|http://www.umweltbundesamt.at/en/"] 
 - type - the type of the section, it can be "country" or "region" 
 - value - the value what should be used for filtering the full database to get the required documents. It can be a single value for countries, or a list of valuse for regions

These are the currently used fields, but anytime we can add a new value in a section, and after that it can be used in the templates.

Example to add the capital of a country
configuration:
```
    "austria": {
        "flag_url": "app_resources/images/flags/austria.png",
        "title": "Austria",
        "type": "country",
        "value": "Austria",
        "capital": "Vienna"
    }
```
using in templates:
```
div(class='section-capital')
    if external_config.capital
        span(class='capital')!=external_config.capital
```

### Invalidate/refresh the EEA layout template

In order to manually refresh the header and the footer of the EEA template you should call /invalidate_templates
