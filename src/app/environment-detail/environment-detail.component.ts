import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscriber } from 'rxjs/Rx';

import { HealthChecksService } from './../health-checks.service';
import { Environment } from './../domain/environment';
import { Application } from './../domain/application';
import { HealthStatus } from './../domain/health-status';
import { HealthCheck, CombinedHealthCheck } from './../domain/health-check';

import 'rxjs';

@Component({
  selector: 'environment-detail',
  template: `
    <h1 fxFlex="none" [innerHtml]="environment.name"></h1>
    <health-check-list
      fxFlex fxLayout="column"
      [healthChecks]="healthChecks">
    </health-check-list>
  `,
  styleUrls: ['./environment-detail.component.sass']
})
export class EnvironmentDetailComponent implements OnInit {

  @Input() environment: Environment;
  healthChecks: Observable<CombinedHealthCheck[]> = new Observable();

  constructor(
    private healthChecksService : HealthChecksService
  ) { }

  ngOnInit() {
    this.healthChecks = Observable.timer(0, 60000)
        .flatMap(
          () => this.healthChecksService.getUnHealthyChecks(this.environment))
        .share();
  }
}
