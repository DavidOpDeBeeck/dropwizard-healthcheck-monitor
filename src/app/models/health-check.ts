import { Application } from './application';
import { HealthStatus } from './health-status';

export interface HealthChecksResponseFormat {
    [name: string]: {
        healthy: boolean
    }
};

export class HealthChecksResponse {

    public static fromResponse(application: Application, response?: HealthChecksResponseFormat): HealthChecksResponse {
        return response
            ? new HealthChecksResponse(application, HealthChecksResponse.toHealthChecks(application, response))
            : new HealthChecksResponse(application, HealthChecksResponse.toUnreachable(application))
    }

    public static toHealthChecks(application: Application, response: HealthChecksResponseFormat): HealthCheck[] {
        return Object.keys(response)
                .map(name => new HealthCheck(name, application, this.toStatus(response[name].healthy)));
    }

    private static toUnreachable(application: Application): HealthCheck[] {
        return [new HealthCheck("unreachable", application, HealthStatus.UnReachable)];
    }

    private static toStatus(healthy: boolean): HealthStatus {
        return healthy ? HealthStatus.Healthy : HealthStatus.Unhealthy;
    }

    private constructor(
        public application: Application,
        public healthChecks: HealthCheck[]
    ) {}

    public getUnHealthyChecks(): HealthCheck[] {
        return this.healthChecks.filter(check => !check.isHealthy());
    }
}

export class HealthCheck {
    constructor(
        public name: string, 
        public application: Application,
        public status: HealthStatus
    ) { }

    public isHealthy() : boolean {
        return this.status === HealthStatus.Healthy;
    }
};

export class CombinedHealthCheck {
    constructor(
        public name: string, 
        public applications: Application[],
        public status: HealthStatus
    ) { }
};

export class HealthCheckMapper {

    /*
    * CREATE HEALTHCHECKSRESPONSE
    */

    public toHealthChecksResponse(response: any, application: Application): HealthChecksResponse {
        return this.isValidHealthCheckResponse(response)
            ? HealthChecksResponse.fromResponse(application, response.json())
            : HealthChecksResponse.fromResponse(application);
    }

    private isValidHealthCheckResponse(response: any): boolean {
        return this.isValidJSON(response) && this.isValidFormat(response.json());
    }

    private isValidJSON(response: any): boolean {
        try { response.json(); return true; } catch(e) { return false; }
    }

    private isValidFormat(response: any): boolean {
        return Object.keys(response)
                    .filter(key => ! this.isValidKey(response, key))
                    .length === 0;
    }

    private isValidKey(response: any, key: string): boolean {
        return response[key] !== null 
            && response[key] !== undefined
            && response[key].healthy !== null 
            && response[key].healthy !== undefined
    }

    /*
    * COMBINE HEALTHCHECKS
    */

    public combineHealthChecks(healthChecks: HealthCheck[]): CombinedHealthCheck[] {
        let combined : Map<string, HealthCheck[]> = new Map();

        healthChecks.forEach(healthCheck => {
            let name: string = healthCheck.name;
            if (combined.has(name)) {
                combined.get(name).push(healthCheck);
            } else {
                combined.set(name, [healthCheck]);
            }
        });

        let names: string[] = Array.from(combined.keys());

        return names.map(name => {
            let checks = combined.get(name);
            let applications = checks.map(check => check.application);
            return new CombinedHealthCheck(name, applications, checks[0].status);
        });
    }
};