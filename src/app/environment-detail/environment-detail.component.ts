import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { HealthChecksService } from './../health-checks.service';
import { Environment } from './../models/environment';
import { Application } from './../models/application';
import { HealthStatus } from './../models/health-status';
import { HealthCheck, CombinedHealthCheck } from './../models/health-check';

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
  healthChecks: Observable<Array<CombinedHealthCheck>> = new Observable();

  constructor(
    private healthChecksService : HealthChecksService
  ) { }

  ngOnInit() {
    this.healthChecks = Observable
        .timer(0, 60 * 1000)
        .flatMap(() => this.healthChecksService.getHealthChecks(this.environment));
  }
}
