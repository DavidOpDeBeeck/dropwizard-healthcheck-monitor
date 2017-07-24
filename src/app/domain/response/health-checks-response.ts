import { Response } from '@angular/http';

import { Application } from './../application';
import { HealthCheck } from './../health-check';
import { HealthStatus } from './../health-status';

import { DomainResponse, DomainResponseFormat, DomainResponseValidator, DomainResponseParser } from './domain-response';

export class HealthChecksResponse implements DomainResponse {

    constructor(
        public application: Application,
        public healthChecks: HealthCheck[]
    ) {}

    public getUnHealthyChecks(): HealthCheck[] {
        return this.healthChecks.filter(check => !check.isHealthy());
    }

}

export interface HealthChecksResponseFormat extends DomainResponseFormat {
    [name: string]: {
        healthy: boolean
    }
}

export class HealthChecksResponseParser extends DomainResponseParser<HealthChecksResponse, HealthChecksResponseFormat> {
    
    constructor(private application: Application) {
        super(new HealthChecksResponseValidator());
    }

    protected parseValid(response: HealthChecksResponseFormat): HealthChecksResponse {
        return new HealthChecksResponse(this.application, this.extractHealthChecks(response))
    }
    protected parseInValid(response: object): HealthChecksResponse {
        return new HealthChecksResponse(this.application, [HealthCheck.unreachable(this.application)]);
    }

    private extractHealthChecks(response: HealthChecksResponseFormat): HealthCheck[] {
        let healthCheckNames: string[] = Object.keys(response);

        return healthCheckNames
                .map(name => this.createHealthCheck(name, response[name].healthy));
    }

    private createHealthCheck(name: string, healthy: boolean): HealthCheck {
        return new HealthCheck(name, this.application, this.toStatus(healthy));
    }
    
    private toStatus(healthy: boolean): HealthStatus {
        return healthy ? HealthStatus.Healthy : HealthStatus.Unhealthy;
    }
    
}

export class HealthChecksResponseValidator extends DomainResponseValidator {
    
    protected hasValidSchema(json: object): boolean {
        return this.isDefined(json)
            && this.hasValidHealthChecks(json);
    }

    private hasValidHealthChecks(json: object): boolean {
        let healthCheckNames: string[] = Object.keys(json);

        return healthCheckNames
                    .map(name => this.isValidHealthCheck(json, name))
                    .reduce(this.allElementsAreTruthy())
    }

    private isValidHealthCheck(json: object, healthCheckName: string): boolean {
        return this.isDefined(json[healthCheckName])
            && this.isDefinedWithType(json[healthCheckName].healthy, 'boolean');
    }

}