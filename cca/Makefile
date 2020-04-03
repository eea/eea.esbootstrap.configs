.DEFAULT_GOAL := help

bootstrap: setup start reindex		## Show the steps how to setup data and start the search app.
	@echo "Done".
	# @echo "1. run command 'make -i setup-search'"
	# @echo "2. run command 'make start-search'"
	# @echo "3. run command 'make search-reindex'"
	# @echo "4. wait until the indexing finishes, access the search app at http://localhost:30021"

.PHONY: setup
setup:		## Clone required github repositories needed for development.
	@echo "No setup needed for now, please check Makefile if you need more"
	# git clone https://github.com/eea/eea.searchserver.js.git
	# git clone https://github.com/eea/eea.esbootstrap.configs.git
	# git clone https://github.com/eea/eea.docker.esbootstrap.git

# git clone https://github.com/eea/eea.climateadapt.search.git

.PHONY: start
start:stop 		## Start the search app.
	docker-compose up -d climate-search
	docker-compose up -d esmaster
	docker-compose up -d es-sysctl

.PHONY: stop
stop: 		## Stop the search app.
	docker-compose stop climate-search
	docker-compose stop esmaster
	docker-compose stop es-sysctl

reindex: 		## Remove all data from elasticsearch, recreate the index and start indexing the data.
	docker-compose exec climate-search code/app.js remove_data
	docker-compose exec climate-search code/app.js create_index

shell:		## Start a shell on search-app.
	docker-compose exec climate-search bash

help:		## Show this help.
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"
