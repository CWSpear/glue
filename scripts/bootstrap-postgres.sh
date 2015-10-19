#!/bin/bash
psql -U postgres -c "CREATE ROLE glue WITH LOGIN PASSWORD 'glue';"
psql -U postgres -c "CREATE DATABASE glue WITH OWNER=glue;"
