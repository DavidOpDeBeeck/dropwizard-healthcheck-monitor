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

export class HealthCheckCombiner {
    public combine(healthChecks: HealthCheck[]): CombinedHealthCheck[] {
        let statuses: Set<HealthStatus> = new Set(healthChecks.map(check => check.status));
        
        if (statuses.size === 0) 
            return [];

        return Array.from(statuses)
            .map(status => {
                let healthChecksWithStatus: HealthCheck[] = 
                    healthChecks.filter(check => check.status === status);

                return this.combineWithSameName(healthChecksWithStatus, status);
            })
            .reduce((prev, cur) => prev.concat(cur));
    }

    private combineWithSameName(healthChecks: HealthCheck[], status: HealthStatus): CombinedHealthCheck[] {
        let healCheckNames: Set<string> = new Set(healthChecks.map(check => check.name));
        
        return Array.from(healCheckNames)
            .map(name => {
                let healthChecksWithName: HealthCheck[] = 
                    healthChecks.filter(check => check.name === name);
                let applications: Application[] = 
                    healthChecksWithName.map(check => check.application);

                return new CombinedHealthCheck(name, applications, status);
            });
    }
};