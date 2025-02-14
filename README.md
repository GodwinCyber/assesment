### Step to step guid to set up and start containerized ProsgreSQL database using docker

## creat a docker file docker-compose.yml;
    this include pull the latest ProgreSQL.
    setup environment variable such as passwrd, username, database_name.
    map port 5432 for ProgreSQL.
    uses a progres_data for persistence Storage

## start progreSQL container using docker-compose up -d
    This wil download ProgreSQL image
    start the container in detached mode (-d)
    and map the volume to the host machine

## Verify the running container using docker ps command

## Connect to the PostgreSQL database using docker exec -it postgres_container(assesment) psql -U myUser(admin) -d database(assesmeent_db)

## connect to the host using psql -h localhost -U myUser(admin) -p 5432
    this will connect to the PostgreSQL database on the host machine


## Stop the container using docker-compose down



| Action                   | Command                                                      |
|--------------------------|--------------------------------------------------------------|
| Start the database       | `docker-compose up -d`                                       |
| Check running containers | `docker ps`                                                  |
| Connect to the database  | `docker exec -it postgres_container psql -U myuser -d mydatabase` |
| Stop the database        | `docker-compose down`                                        |

