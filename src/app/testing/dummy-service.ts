import { Environment } from './../domain/environment';
import { CombinedHealthCheck } from './../domain/health-check';
import { EnvironmentsService } from './../environments.service';
import { HealthChecksService } from './../health-checks.service';

import { Observable } from 'rxjs/Observable';

export class DummyEnvironmentsService extends EnvironmentsService {

  public static withResponse(environments: Environment[]): EnvironmentsService {
    return new DummyEnvironmentsService(environments);
  }

  constructor(private environments: Environment[]) {
    super(null);
  }

  public getEnvironments() : Observable<Array<Environment>> {
    return Observable.of(this.environments);
  }
}

export class DummyHealthChecksService extends HealthChecksService {

  public static withResponse(healthChecks: CombinedHealthCheck[]): HealthChecksService {
    return new DummyHealthChecksService(healthChecks);
  }

  constructor(private healthChecks: CombinedHealthCheck[]) {
    super(null);
  }

  public getUnHealthyChecks() : Observable<Array<CombinedHealthCheck>> {
    return Observable.of(this.healthChecks);
  }
}