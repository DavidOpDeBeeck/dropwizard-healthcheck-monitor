import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Environment } from './../core/environment';
import { Application } from './../core/application';
import { HealthStatus } from './../core/health-status';
import { CombinedHealthCheck } from './../core/health-check';

import { EnvironmentDetailComponent } from './environment-detail.component';
import { HealthCheckListComponent } from './../health-check-list/health-check-list.component';
import { HealthCheckDetailComponent } from './../health-check-detail/health-check-detail.component';
import { HealthChecksService } from './../health-checks.service';
import { StartCasePipe } from './../start-case.pipe'

const application: Application = { name: "application", healthCheckUrl: "url" };
const environment: Environment = { name: "environment", applications: [application] };
const healthCheck : CombinedHealthCheck = { name: "application", applications: [application], status: HealthStatus.Unhealthy };

class DummyHealthChecksService extends HealthChecksService {
  constructor() {
    super(null);
  }

  getHealthChecks(environment : Environment) : Observable<Array<CombinedHealthCheck>> {
    if (environment.name === environment.name) {
      return Observable.of([healthCheck]);
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
    component.environment = environment;
    fixture.detectChanges();
  });

  it('should load the healthchecks from the HealthchecksService', () => {
    component.healthChecks.subscribe((healthChecks) => {
      let actual = JSON.stringify(healthChecks);
      let expected = JSON.stringify([healthCheck]);

      expect(actual).toEqual(expected);
    });
  });
});
