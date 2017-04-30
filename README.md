# Dropwizard health check monitor
An in-browser healthcheck monitor for dropwizard healthchecks

## Environments
You can define your environments in the json file located at `assets/environments.json` with the following structure.

```javascript
{
    "environmentName": [{
        "name": "applicationName",
        "healthCheckUrl": "urlToHealthCheck.json"
    }],
}
```

## Health Checks
The remote health check files need to have the following structure.

```javascript
{
    "healthCheckName": {
        "healthy": "boolean"
    },
}
```

## Reverse Proxy
If you have trouble reaching your remote healthchecks due to `Access-Control-Allow-Origin` header restrictions, you can use the included reverse proxy. The reverse proxy will listen on all available network interfaces and on port `12345`.

```sh
node reverse-proxy.js
```

```
Example usage: 
http://localhost:12345/http://application-address.com/healthchecks.json
```

## Docker

### Application
If you want to run the healthcheck application as a Docker container. You have to edit the `assets/environments.json` file and build the container using `docker build .` in the root directory.

### Reverse Proxy
If you want to run the reverse proxy as a Docker container. You have to build the container using `docker build .` in the `/proxy` directory.

### Both
For your convenience there is a Docker compose file that builds and runs both the application and the reverse proxy. You have to execute the `docker-compose up -d` command in the root directory.
