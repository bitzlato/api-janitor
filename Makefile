.EXPORT_ALL_VARIABLES:

deploy:
	cp config/settings.example.yml config/settings.yml
	sed -i '' -e "s/bugsnag_api_key/${BUGSNAG_API_KEY}/g" config/settings.yml
	sed -i '' -e "s/app_url/${APP_URL}/g" config/settings.yml
	tar czf janitor.tar.gz --exclude node_modules --exclude build ./*
	scp janitor.tar.gz ${APP_USER}@${APP_HOST}:/tmp/janitor.tar.gz
	rm janitor.tar.gz
	ssh ${APP_USER}@${APP_HOST} mkdir -p /tmp/janitor
	ssh ${APP_USER}@${APP_HOST} tar xvf /tmp/janitor.tar.gz --directory=/tmp/janitor
	ssh ${APP_USER}@${APP_HOST} "cd /tmp/janitor && docker-compose up --build -d"
	ssh ${APP_USER}@${APP_HOST} rm -rf /tmp/janitor
	ssh ${APP_USER}@${APP_HOST} rm /tmp/janitor.tar.gz

clean:
	rm -rf ./build
	rm -rf ./node_modules