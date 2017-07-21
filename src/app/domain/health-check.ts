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
                .concat(this.combineWithStatus(healthChecks, HealthStatus.Unhealthy))
                .concat(this.combineWithStatus(healthChecks, HealthStatus.UnReachable));
    }

    private combineWithStatus(healthChecks: HealthCheck[], status: HealthStatus): CombinedHealthCheck[] {
        let healthChecksWithStatus: HealthCheck[] = 
            healthChecks.filter(check => check.status === status);
        let uniqueHealthCheckNames: Set<string> = 
            new Set(healthChecksWithStatus.map(check => check.name));

        return Array.from(uniqueHealthCheckNames)
            .map(name => this.combineWithName(healthChecksWithStatus, name, status));
    }  

    private combineWithName(healthChecks: HealthCheck[], name: string, status: HealthStatus): CombinedHealthCheck {
        let healthChecksWithName: HealthCheck[] = healthChecks.filter(check => check.name === name);
        let applications: Application[] = healthChecksWithName.map(check => check.application);

        return new CombinedHealthCheck(name, applications, status);
    }
};