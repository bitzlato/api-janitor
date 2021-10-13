USER = ${APP_USER}
HOST = ${APP_HOST}

.EXPORT_ALL_VARIABLES:

deploy:
	tar czf janitor.tar.gz --exclude node_modules --exclude build ./*
	scp janitor.tar.gz ${USER}@${HOST}:/tmp/janitor.tar.gz
	rm janitor.tar.gz
	ssh ${USER}@${HOST} mkdir -p /tmp/janitor
	ssh ${USER}@${HOST} tar xvf /tmp/janitor.tar.gz --directory=/tmp/janitor
	ssh ${USER}@${HOST} "cd /tmp/janitor && docker-compose up --build -d"
	ssh ${USER}@${HOST} rm -rf /tmp/janitor
	ssh ${USER}@${HOST} rm /tmp/janitor.tar.gz
