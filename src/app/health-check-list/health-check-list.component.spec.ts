import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Environment } from './../models/environment';
import { Application } from './../models/application';
import { HealthStatus } from './../models/health-status';
import { CombinedHealthCheck } from './../models/health-check';

import { HealthCheckListComponent } from './health-check-list.component';
import { HealthCheckDetailComponent } from './../health-check-detail/health-check-detail.component';
import { StartCasePipe } from './../start-case.pipe'
import { HealthStatusPipe } from './../health-status.pipe'

const APPLICATION : Application = {
  name: "application",
  healthCheckUrl: "url"
};

const HEALTH_CHECK : CombinedHealthCheck = {
  name: "application",
  applications: [APPLICATION],
  status: HealthStatus.Unhealthy
};

describe('HealthCheckListComponent', () => {
  let component: HealthCheckListComponent;
  let fixture: ComponentFixture<HealthCheckListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ 
        HealthCheckListComponent,
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
    fixture = TestBed.createComponent(HealthCheckListComponent);
    component = fixture.componentInstance;
  });

  it('should set the class to "has-issues" if there are unhealthy checks', () => {
    component.healthChecks = Observable.of([HEALTH_CHECK]);
    fixture.detectChanges();
    expect(component.status).toEqual('has-issues');
  });

  it('should set the class to "has-no-issues" if there are no unhealthy checks', () => {
    component.healthChecks = Observable.of([]);
    fixture.detectChanges();
    expect(component.status).toEqual('has-no-issues');
  });
});
