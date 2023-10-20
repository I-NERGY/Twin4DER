# Preliminary setup during development
TODO: move all this into Helm and deploy in Kubernetes so that there is a single configuration source later on.

## Grafana
Run Grafana as a docker container:
```
docker run -d -p 3001:3000 --name=grafana grafana/grafana-oss
```

## Nginx
Nginx is needed to route requests between different backend resources.

Build docker image with configuration:
```
docker build -f NginxDockerfile -t twin-nginx . 
```

Run docker container:
```
docker run -d -p 80:80 --name twin-nginx-container twin-nginx
```