# eea.climateadapt.search
Search Appliance for Climate-Adapt

### How to run

1) git clone https://github.com/eea/eea.docker.esbootstrap.git
2) git clone https://github.com/eea/eea.esbootstrap.configs.git
3) git clone https://github.com/eea/eea.searchserver.js.git
4) git clone https://github.com/eea/eea.climateadapt.search and copy the content to eea.esbootstrap.configs/climateadapt/
5) run from eea.esbootstrap.configs/climateadapt/ 
<pre>docker-compose -f docker-compose-es.yml up</pre>
<pre>docker-compose -f docker-compose-app.yml up</pre>
