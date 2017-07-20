import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Environment } from './../domain/environment';
import { Application } from './../domain/application';
import { HealthStatus } from './../domain/health-status';
import { CombinedHealthCheck } from './../domain/health-check';

import { HealthCheckDetailComponent } from './health-check-detail.component';
import { StartCasePipe } from './../start-case.pipe'
import { HealthStatusPipe } from './../health-status.pipe'

const application: Application = { name: "application", healthCheckUrl: "url" };
const unhealthyCheck : CombinedHealthCheck = { name: "application", applications: [application], status: HealthStatus.Unhealthy };
const unreachableCheck : CombinedHealthCheck = { name: "application", applications: [application], status: HealthStatus.UnReachable };

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
    component.healthCheck = unhealthyCheck;
    fixture.detectChanges();
    expect(component.status).toEqual('unhealthy');
  });

  it('should set the class to "unreachable" if the healthcheck is unreachable', () => {
    component.healthCheck = unreachableCheck;
    fixture.detectChanges();
    expect(component.status).toEqual('unreachable');
  });
});
