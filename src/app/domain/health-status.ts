export enum HealthStatus {
    Healthy = 0,
    Unhealthy = 1,
    UnReachable = 2
};

export function toHealthStatusValue(healthStatus: HealthStatus): string {
    switch (healthStatus) {
        case HealthStatus.Healthy: 
            return "healthy";
        case HealthStatus.Unhealthy: 
            return "unhealthy";
        case HealthStatus.UnReachable: 
            return "unreachable";
        default:
            return "unknown";
    }
};
