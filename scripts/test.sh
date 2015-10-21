#!/bin/bash
docker-compose -f ./docker/test.yml build
docker-compose -f ./docker/test.yml up -d

docker run --link glue_postgres:glue_postgres aanand/wait

cat ./scripts/bootstrap-postgres.sh | docker exec -i glue_postgres sh -c 'cat > /bootstrap-postgres.sh'

docker exec -ti glue_postgres chmod 755 /bootstrap-postgres.sh
docker exec -ti glue_postgres /bootstrap-postgres.sh

docker exec -ti glue_web npm test

docker-compose -f ./docker/test.yml kill
docker-compose -f ./docker/test.yml rm -f -v
