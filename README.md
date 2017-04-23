# dropwizard-healthcheck-monitor
An in-browser healthcheck monitor for dropwizard

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
    "healthCheckName": [{
        "healthy": "boolean"
    }],
}
```

## Reverse Proxy
If you have trouble reaching your remote healthchecks due to `Access-Control-Allow-Origin` header restrictions, you can use the included reverse proxy. The reverse proxy will listen on all available network interfaces and on port `12345`. Example usage `http://localhost:12345/http://application-address.com/healthchecks.json`.

```sh
node reverse-proxy.js
```