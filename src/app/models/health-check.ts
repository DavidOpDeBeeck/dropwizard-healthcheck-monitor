import { Application } from './application';
import { HealthStatus } from './health-status';

export interface HealthCheck {
    name: string,
    application: Application,
    status: HealthStatus
};

export interface CombinedHealthCheck {
    name: string,
    applications: Application[],
    status: HealthStatus
};

export interface HealthChecksResponse {
    [name: string]: {
        healthy: boolean
    }
};

export function parseHealthChecksResponse(object: any) : HealthChecksResponse {
    let json = toJSON(object);
    if (json && isHealthChecksResponse(json)) {
        return (<HealthChecksResponse> json);
    }
    throw new Error("Object is not a valid HealthChecksResponse");
};

function toJSON(object: any) {
    try {        
        return JSON.parse(object);
    } catch(e) {
        return undefined;
    }
};

function isHealthChecksResponse(object: any): object is HealthChecksResponse {
    return (<HealthChecksResponse> object) !== undefined;
};