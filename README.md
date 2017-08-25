# eea.esbootstrap.configs
esbootstrap configs repository

## Setup

All apps configurations are place in the config folder. An app folder fully
customized contains these files:

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
        │   ├── custom.css
        │   └── custom.js
        └── views
            ├── cardview.jade
            ├── listview.jade
            └── landingview.jade
</pre>
While our current default app contains the minimum needed files:
<pre>
    └── default
        ├── mapping.json
        ├── query.sparql
        ├── facets.json
        ├── settings.json
        ├── public
        │   ├── custom.css
        │   └── custom.js
</pre>

### Development environment

If the image is launched with **DEV_CONFIG** environment variable, repository will clone/pull in **/code/config**.

For details about configuring the application, please read the [documentation](https://github.com/eea/eea.docker.esbootstrap/blob/master/docs/Details.md)
