import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Environment } from './../models/environment';
import { Application } from './../models/application';
import { HealthStatus } from './../models/health-status';
import { CombinedHealthCheck } from './../models/health-check';

import { EnvironmentDetailComponent } from './environment-detail.component';
import { HealthCheckListComponent } from './../health-check-list/health-check-list.component';
import { HealthCheckDetailComponent } from './../health-check-detail/health-check-detail.component';
import { HealthChecksService } from './../health-checks.service';
import { StartCasePipe } from './../start-case.pipe'

const APPLICATION : Application = {
  name: "application",
  healthCheckUrl: "url"
};

const ENVIRONMENT : Environment = {
    name: "environment",
    applications: [APPLICATION]
};

const HEALTH_CHECK : CombinedHealthCheck = {
  name: "application",
  applications: [APPLICATION],
  status: HealthStatus.Unhealthy
};

class DummyHealthChecksService extends HealthChecksService {
  constructor() {
    super(null);
  }

  getHealthChecks(environment : Environment) : Observable<Array<CombinedHealthCheck>> {
    if (environment.name === ENVIRONMENT.name) {
      return Observable.of([HEALTH_CHECK]);
    }
    return Observable.of([]);
  }
}

describe('EnvironmentDetailComponent', () => {
  let component: EnvironmentDetailComponent;
  let fixture: ComponentFixture<EnvironmentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ 
        EnvironmentDetailComponent, 
        HealthCheckListComponent,
        HealthCheckDetailComponent,
        StartCasePipe ],
        providers: [ 
        {
          provide: HealthChecksService,
          useFactory: () => { return new DummyHealthChecksService(); }
        }]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentDetailComponent);
    component = fixture.componentInstance;
    component.environment = ENVIRONMENT;
    fixture.detectChanges();
  });

  it('should load the healthchecks from the HealthchecksService', () => {
    component.healthChecks.subscribe((healthChecks) => {
      let actual = JSON.stringify(healthChecks);
      let expected = JSON.stringify([HEALTH_CHECK]);

      expect(actual).toEqual(expected);
    });
  });
});
