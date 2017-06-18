import { Application } from './application';
import { HealthStatus } from './health-status';
import { HealthCheck, CombinedHealthCheck, HealthCheckMapper } from './health-check';

const anApplication: Application = new Application("anApplication", "anUrl");
const anotherApplication: Application = new Application("anotherApplication", "anotherUrl");

describe('HealthCheckMapper', () => {

  it('should group healthchecks with the same name', () => {
    const mapper = new HealthCheckMapper();
    const healthChecks = [
        new HealthCheck("check1", anApplication, HealthStatus.Unhealthy),
        new HealthCheck("check2", anApplication, HealthStatus.Unhealthy),
        new HealthCheck("check1", anotherApplication, HealthStatus.Unhealthy),
    ];

    let combined = mapper.combine(healthChecks);

    expect(combined)
        .toContain(
            new CombinedHealthCheck("check1", [anApplication, anotherApplication], HealthStatus.Unhealthy),
            new CombinedHealthCheck("check2", [anApplication], HealthStatus.Unhealthy));
  });
});
