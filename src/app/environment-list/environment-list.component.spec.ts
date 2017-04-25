import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Environment } from './../models/environment';
import { Application } from './../models/application';
import { HealthStatus } from './../models/health-status';
import { CombinedHealthCheck } from './../models/health-check';

import { EnvironmentListComponent } from './environment-list.component';
import { EnvironmentDetailComponent } from './../environment-detail/environment-detail.component';
import { HealthCheckListComponent } from './../health-check-list/health-check-list.component';
import { HealthCheckDetailComponent } from './../health-check-detail/health-check-detail.component';
import { EnvironmentsService } from './../environments.service';
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

class DummyEnvironmentsService extends EnvironmentsService {
  constructor() {
    super(null);
  }

  getEnvironments() : Observable<Array<Environment>> {
    return Observable.of([ENVIRONMENT]);
  }
}

class DummyHealthChecksService extends HealthChecksService {
  constructor() {
    super(null);
  }

  getHealthChecks() : Observable<Array<CombinedHealthCheck>> {
    return Observable.of([HEALTH_CHECK]);
  }
}

describe('EnvironmentListComponent', () => {
  let component: EnvironmentListComponent;
  let fixture: ComponentFixture<EnvironmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ 
        EnvironmentListComponent, 
        EnvironmentDetailComponent, 
        HealthCheckListComponent,
        HealthCheckDetailComponent,
        StartCasePipe ],
        providers: [ 
        {
          provide: EnvironmentsService,
          useFactory: () => { return new DummyEnvironmentsService(); }
        },{
          provide: HealthChecksService,
          useFactory: () => { return new DummyHealthChecksService(); }
        }]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the environments from the EnvironmentsService', () => {
    component.environments.subscribe(environments => {
      let actual = JSON.stringify(environments);
      let expected = JSON.stringify([ENVIRONMENT]);

      expect(actual).toEqual(expected);
    });
  });
});
