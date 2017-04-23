export enum HealthStatus {
    Healthy,
    Unhealthy,
    UnReachable,
    Unknown
};

export function toHealthStatus(healthy: boolean) : HealthStatus {
    return healthy ? HealthStatus.Healthy : HealthStatus.Unhealthy;
};

export function toHealthStatusString(healthStatus: HealthStatus) : string {
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
