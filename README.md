# eea.esbootstrap.configs
esbootstrap configs repository

## Setup

All apps configurations are place in the config folder. An app folder contains these files

<pre>
    └── default
        ├── mapping.json
        ├── filtersQuery.sparql
        ├── query.sparql
        ├── facets.json
        ├── settings.json
        ├── riverconfig.example.json
        ├── riverconfig_1.json
        ├── riverconfig_2.json
        ├── public
        │   ├── custom_css
        │   └── custom_js
        └── views
            ├── cardview.jade
            ├── listview.jade
            └── landingview.jade
</pre>

### Development environment

If the image is launched with **DEV_CONFIG** environment variable, repository will clone/pull in **/code/config**.

For details about configuring the application, please read the [documentation](https://github.com/eea/eea.docker.esbootstrap/blob/master/docs/Details.md)