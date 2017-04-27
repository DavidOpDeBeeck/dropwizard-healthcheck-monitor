import { Application } from './application';
import { HealthStatus } from './health-status';

export class HealthCheck {
    constructor(
        public name: string, 
        public application: Application,
        public status: HealthStatus
    ) { }
};

export class CombinedHealthCheck {
    constructor(
        public name: string, 
        public applications: Application[],
        public status: HealthStatus
    ) { }
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