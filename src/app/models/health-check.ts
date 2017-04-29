import { Application } from './application';
import { HealthStatus } from './health-status';

export interface HealthChecksResponseFormat {
    [name: string]: {
        healthy: boolean
    }
};

export class HealthChecksResponse {
    
    public static fromResponse(response: any, application: Application): HealthChecksResponse {
        return HealthChecksResponse.hasValidFormat(response)
            ? new HealthChecksResponse(application, false, response)
            : new HealthChecksResponse(application, true, undefined);
    }

    private static hasValidFormat(object: any): boolean {
        return Object.keys(object)
                    .filter(key => object[key].healthy === undefined)
                    .length === 0;
    }

    public healthChecks: HealthCheck[];

    private constructor(
        public application: Application,
        public unreachable: boolean,
        public response?: HealthChecksResponseFormat
    ) {
        this.healthChecks = unreachable
            ? this.mapToUnreachable(application)
            : this.mapToHealthChecks(response, application);
    }

    public getUnHealthyChecks(): HealthCheck[] {
        return this.healthChecks.filter(check => !check.isHealthy());
    }

    private mapToHealthChecks(res: HealthChecksResponseFormat, application: Application): HealthCheck[] {
        return Object.keys(res)
                .map(name => new HealthCheck(name, application, this.toStatus(res[name].healthy)));
    }

    private mapToUnreachable(application: Application): HealthCheck[] {
        return [new HealthCheck("unreachable", application, HealthStatus.UnReachable)];
    }

    private toStatus(healthy: boolean): HealthStatus {
        return healthy ? HealthStatus.Healthy : HealthStatus.Unhealthy;
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
    public static combineHealthChecks(healthChecks: HealthCheck[]): CombinedHealthCheck[] {
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