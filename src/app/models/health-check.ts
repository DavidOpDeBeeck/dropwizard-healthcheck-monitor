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