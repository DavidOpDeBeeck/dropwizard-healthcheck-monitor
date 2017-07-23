import { Response } from '@angular/http';

import { Application } from './../application';
import { HealthCheck } from './../health-check';
import { HealthStatus } from './../health-status';

export interface HealthChecksResponseFormat {
    [name: string]: {
        healthy: boolean
    }
}

export class HealthChecksResponse {
    public static valid(application: Application, healthChecks: HealthCheck[]): HealthChecksResponse {
        return new HealthChecksResponse(application, healthChecks);
    }

    public static invalid(application: Application): HealthChecksResponse {
        return new HealthChecksResponse(application, [HealthCheck.unreachable(application)]);
    }
  
    private constructor(
        public application: Application,
        public healthChecks: HealthCheck[]
    ) {}

    public getUnHealthyChecks(): HealthCheck[] {
        return this.healthChecks.filter(check => !check.isHealthy());
    }
}

export class HealthChecksResponseParser {

    private validator: HealthChecksResponseValidator;

    constructor() {
        this.validator = new HealthChecksResponseValidator();
    }

    public parseResponse(response: Response, application: Application): HealthChecksResponse {
        return this.validator.isValidResponse(response)
            ? HealthChecksResponse.valid(application, this.extractHealthChecks(response.json(), application))
            : HealthChecksResponse.invalid(application);
    }

    private extractHealthChecks(response: HealthChecksResponseFormat, application: Application): HealthCheck[] {
        return Object.keys(response)
                .map(name => this.createHealthCheck(name, application, response[name].healthy));
    }

    private createHealthCheck(name: string, application: Application, healthy: boolean): HealthCheck {
        return new HealthCheck(name, application, this.toStatus(healthy));
    }
    
    private toStatus(healthy: boolean): HealthStatus {
        return healthy ? HealthStatus.Healthy : HealthStatus.Unhealthy;
    }  
}

class HealthChecksResponseValidator {
    public isValidResponse(response: Response): boolean {
        return this.hasValidJSON(response) && this.hasValidFormat(response.json());
    }

    private hasValidJSON(response: Response): boolean {
        try { response.json(); return true; } catch(e) { return false; }
    }

    private hasValidFormat(response: any): boolean {
        return response !== undefined 
            && response !== null 
            && this.hasValidHealthChecks(response);
    }

    private hasValidHealthChecks(response: any): boolean {
        return Object.keys(response)
                    .filter(healthCheckName => ! this.isValidHealthCheck(response, healthCheckName))
                    .length === 0;
    }

    private isValidHealthCheck(response: any, healthCheckName: string): boolean {
        return response[healthCheckName] !== null 
            && response[healthCheckName] !== undefined
            && response[healthCheckName].healthy !== null 
            && response[healthCheckName].healthy !== undefined
    }
}