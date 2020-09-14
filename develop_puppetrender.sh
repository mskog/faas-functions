#!/bin/bash

faas build -f puppetrender.yml && docker run --rm -p 3000:8080 docker-registry.mskog.com/puppetrender:latest
