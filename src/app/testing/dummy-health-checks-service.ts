import { CombinedHealthCheck } from './../domain/health-check';
import { HealthChecksService } from './../health-checks.service';

import { Observable } from 'rxjs/Observable';

export class DummyHealthChecksService extends HealthChecksService {

  public static withResponse(healthChecks: CombinedHealthCheck[]): HealthChecksService {
    return new DummyHealthChecksService(healthChecks);
  }

  constructor(private healthChecks: CombinedHealthCheck[]) {
    super(null);
  }

  getHealthChecks() : Observable<Array<CombinedHealthCheck>> {
    return Observable.of(this.healthChecks);
  }
}