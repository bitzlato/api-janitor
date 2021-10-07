USER = ${APP_USER}
HOST = ${APP_HOST}

.EXPORT_ALL_VARIABLES:

deploy:
	tar czf api-janitor.tar.gz ./*
	scp api-janitor.tar.gz ${USER}@${HOST}:/tmp/api-janitor.tar.gz
	rm api-janitor.tar.gz
	ssh ${USER}@${HOST} mkdir -p /tmp/api-janitor
	ssh ${USER}@${HOST} tar xvf /tmp/api-janitor.tar.gz --directory=/tmp/api-janitor
	ssh ${USER}@${HOST} "cd /tmp/api-janitor && docker-compose up --build -d"
	ssh ${USER}@${HOST} rm -rf /tmp/api-janitor
	ssh ${USER}@${HOST} rm /tmp/api-janitor.tar.gz
