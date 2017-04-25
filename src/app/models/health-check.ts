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
    let parsable = true;
    let keys = Object.keys(object);

    keys.forEach(key => {
        if (object[key].healthy === undefined) {
            parsable = false;
        }
    });

    if (parsable) {
        return object;
    }
    throw new Error("Object is not a valid HealthChecksResponse");
};