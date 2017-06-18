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
        let names : Set<string> = new Set(healthChecks
            .map(check => check.name));

        return Array.from(names)
            .map(name => this.createCombinedHealthCheck(name, healthChecks));
    }

    private createCombinedHealthCheck(name: string, healthChecks: HealthCheck[]): CombinedHealthCheck {
        let checksWithName: HealthCheck[] = healthChecks.filter(check => check.name === name);
        let applications: Application[] = checksWithName.map(check => check.application);
        return new CombinedHealthCheck(name, applications, checksWithName[0].status);
    }
};