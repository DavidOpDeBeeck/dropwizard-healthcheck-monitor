import { HealthStatusPipe } from './health-status.pipe';
import { HealthStatus } from './core/health-status';

describe('HealthStatusPipe', () => {

  it('should return the string representation of a HealthStatus', () => {
    const pipe = new HealthStatusPipe();
    expect(pipe.transform(HealthStatus.Healthy)).toEqual("healthy");
    expect(pipe.transform(HealthStatus.Unhealthy)).toEqual("unhealthy");
    expect(pipe.transform(HealthStatus.UnReachable)).toEqual("unreachable");
  });

  it('should return "unknown" when the HealthStatus is invalid', () => {
    const pipe = new HealthStatusPipe();
    expect(pipe.transform(null)).toEqual("unknown");
    expect(pipe.transform(undefined)).toEqual("unknown");
    expect(pipe.transform("")).toEqual("unknown");
    expect(pipe.transform({})).toEqual("unknown");
  });
});
