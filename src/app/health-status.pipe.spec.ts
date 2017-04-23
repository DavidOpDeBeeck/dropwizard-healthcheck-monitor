import { HealthStatusPipe } from './health-status.pipe';
import { HealthStatus } from './models/health-status';

describe('HealthStatusPipe', () => {

  it('should return the string representation of a HealthStatus', () => {
    const pipe = new HealthStatusPipe();
    expect(pipe.transform(HealthStatus.Healthy)).toEqual("healthy");
    expect(pipe.transform(HealthStatus.Unhealthy)).toEqual("unhealthy");
    expect(pipe.transform(HealthStatus.UnReachable)).toEqual("unreachable");
    expect(pipe.transform(HealthStatus.Unknown)).toEqual("unknown");
  });

  it('should return "unknown" when the HealthStatus is invalid', () => {
    const pipe = new HealthStatusPipe();
    expect(pipe.transform(null)).toEqual("unknown");
    expect(pipe.transform(undefined)).toEqual("unknown");
    expect(pipe.transform("")).toEqual("unknown");
    expect(pipe.transform({})).toEqual("unknown");
  });
});