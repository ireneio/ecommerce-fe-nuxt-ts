#!/bin/bash

docker build --file $2 -t $1 .
docker push $1
