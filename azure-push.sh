#!/bin/bash

# $1 = azure username
# $2 = azure password
# $3 = acr repo name
# $4 = acr repo password
# $5 = docker image name

# push to ACR
az login --username $1 --password $2
az acr login --name $3 --username $3 --password $4
docker build --file Dockerfile -t $5 .

echo ⭐ Image built locally...

docker tag $5 $3.azurecr.io/$5/frontend
docker push $3.azurecr.io/$5/frontend

echo 🤘 Deploy Azure App Service complete.
