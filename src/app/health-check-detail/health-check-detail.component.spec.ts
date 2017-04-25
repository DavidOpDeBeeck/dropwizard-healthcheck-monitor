import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Environment } from './../models/environment';
import { Application } from './../models/application';
import { HealthStatus } from './../models/health-status';
import { CombinedHealthCheck } from './../models/health-check';

import { HealthCheckDetailComponent } from './health-check-detail.component';
import { StartCasePipe } from './../start-case.pipe'
import { HealthStatusPipe } from './../health-status.pipe'

const APPLICATION : Application = {
  name: "application",
  healthCheckUrl: "url"
};

const UNHEALTHY_CHECK : CombinedHealthCheck = {
  name: "application",
  applications: [APPLICATION],
  status: HealthStatus.Unhealthy
};

const UNREACHABLE_CHECK : CombinedHealthCheck = {
  name: "application",
  applications: [APPLICATION],
  status: HealthStatus.UnReachable
};

describe('HealthCheckDetailComponent', () => {
  let component: HealthCheckDetailComponent;
  let fixture: ComponentFixture<HealthCheckDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ 
        HealthCheckDetailComponent,
        StartCasePipe ],
        providers: [ 
        {
          provide: HealthStatusPipe,
          useFactory: () => { return new HealthStatusPipe(); }
        }]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCheckDetailComponent);
    component = fixture.componentInstance;
  });

  it('should set the class to "unhealthy" if the healthcheck is unhealthy', () => {
    component.healthCheck = UNHEALTHY_CHECK;
    fixture.detectChanges();
    expect(component.status).toEqual('unhealthy');
  });

  it('should set the class to "unreachable" if the healthcheck is unreachable', () => {
    component.healthCheck = UNREACHABLE_CHECK;
    fixture.detectChanges();
    expect(component.status).toEqual('unreachable');
  });
});
