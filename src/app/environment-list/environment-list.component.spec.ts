import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Environment } from './../domain/environment';
import { Application } from './../domain/application';
import { HealthStatus } from './../domain/health-status';
import { CombinedHealthCheck } from './../domain/health-check';

import { EnvironmentListComponent } from './environment-list.component';
import { EnvironmentDetailComponent } from './../environment-detail/environment-detail.component';
import { HealthCheckListComponent } from './../health-check-list/health-check-list.component';
import { HealthCheckDetailComponent } from './../health-check-detail/health-check-detail.component';
import { EnvironmentsService } from './../environments.service';
import { HealthChecksService } from './../health-checks.service';
import { StartCasePipe } from './../start-case.pipe'

import { DummyEnvironmentsService, DummyHealthChecksService } from './../testing/dummy-service'

const application: Application = { name: "application", healthCheckUrl: "url" };
const environment: Environment = { name: "environment", applications: [application] };
const healthCheck: CombinedHealthCheck = { name: "application", applications: [application], status: HealthStatus.Unhealthy };

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
          useFactory: () => { return DummyEnvironmentsService.withResponse([environment]); }
        },{
          provide: HealthChecksService,
          useFactory: () => { return DummyHealthChecksService.withResponse([healthCheck]); }
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
      let expected = JSON.stringify([environment]);

      expect(actual).toEqual(expected);
    });
  });
});
