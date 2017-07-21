import { Application } from './../application';
import { HealthCheck } from './../health-check';
import { HealthStatus } from './../health-status';

export interface HealthChecksResponseFormat {
    [name: string]: {
        healthy: boolean
    }
}

export class HealthChecksResponse {
    constructor(
        public application: Application,
        public healthChecks: HealthCheck[]
    ) {}

    public getUnHealthyChecks(): HealthCheck[] {
        return this.healthChecks.filter(check => !check.isHealthy());
    }
}

export class HealthChecksResponseParser {
    public parseResponse(response: any, application: Application): HealthChecksResponse {
        return this.isValidHealthCheckResponse(response)
            ? new HealthChecksResponse(application, this.toHealthChecks(application, response.json()))
            : new HealthChecksResponse(application, this.toUnreachable(application));
    }

    private isValidHealthCheckResponse(response: any): boolean {
        return this.isValidJSON(response) 
            && this.hasValidFormat(response.json());
    }

    private isValidJSON(response: any): boolean {
        try { response.json(); return true; } catch(e) { return false; }
    }

    private hasValidFormat(response: any): boolean {
        return response !== undefined 
            && response !== null 
            && Object.keys(response)
                    .filter(key => ! this.isValidKey(response, key))
                    .length === 0;
    }

    private isValidKey(response: any, key: string): boolean {
        return response[key] !== null 
            && response[key] !== undefined
            && response[key].healthy !== null 
            && response[key].healthy !== undefined
    }

    private toHealthChecks(application: Application, response: HealthChecksResponseFormat): HealthCheck[] {
        return Object.keys(response)
                .map(name => new HealthCheck(name, application, this.toStatus(response[name].healthy)));
    }

    private toUnreachable(application: Application): HealthCheck[] {
        return [HealthCheck.unreachable(application)];
    }

    private toStatus(healthy: boolean): HealthStatus {
        return healthy ? HealthStatus.Healthy : HealthStatus.Unhealthy;
    }
}