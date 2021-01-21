#!/bin/bash

docker build --file $2 -t $1 .
docker run -it -p 3000:3000 $1
