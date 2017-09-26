# CaR - Countries and Regions application

The produciton application is reachable via the EEA Website under www.eea.europa.eu/countries-and-regions

## Setup

The CaR application is depoloyed via 
[EEA Rancher Catalog esbootstrap app](https://github.com/eea/eea.rancher.catalog/tree/master/templates/elastic-app-esbootstrap).

Some metadata is coming from EEA Plone Website (e.g. the name of countries, the description, background image and links). 
The above metadata content is exported as a Json file and retrieved on start-up by the CaR application.

In we have updated a bakcground image for a country or we have changed the introduction, 
the Json metadata file can be synced on-demand by triggering the following url:

```<your-car-app-ip>/tools/update_external_configs```

Instead of the car-app-ip you can use ```www.eea.europa.eu/countries-and-regions```, 
apache rewrite rules will take care on forwarding to the CaR application.
