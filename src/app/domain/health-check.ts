import { Application } from './application';
import { HealthStatus } from './health-status';

export class HealthCheck {
    public static unreachable(application: Application) {
        return new HealthCheck("unreachable", application, HealthStatus.UnReachable);
    }

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
    public combine(healthChecks: HealthCheck[]): CombinedHealthCheck[] {
        return []
                .concat(this.createCombinedHealthChecks(HealthStatus.Unhealthy, healthChecks))
                .concat(this.createCombinedHealthChecks(HealthStatus.UnReachable, healthChecks));
    }

    private createCombinedHealthChecks(status: HealthStatus, healthChecks: HealthCheck[]): CombinedHealthCheck[] {
        let healthChecksWithStatus = healthChecks
            .filter(check => check.status === status);

        let uniqueHealthCheckNames : Set<string> 
            = new Set(healthChecksWithStatus.map(check => check.name));

        return Array.from(uniqueHealthCheckNames)
            .map(name => this.createCombinedHealthCheck(name, status, healthChecksWithStatus));
    }  

    private createCombinedHealthCheck(name: string, status: HealthStatus, healthChecks: HealthCheck[]): CombinedHealthCheck {
        let healthChecksWithName: HealthCheck[] = healthChecks.filter(check => check.name === name);
        let applications: Application[] = healthChecksWithName.map(check => check.application);
        return new CombinedHealthCheck(name, applications, status);
    }
};