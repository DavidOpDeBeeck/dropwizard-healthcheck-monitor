import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CombinedHealthCheck } from './../models/health-check';

@Component({
  selector: 'health-check-list',
  template: `
    <health-check-detail 
      fxFlex fxLayout="column"
      [healthCheck]="healthCheck"
      *ngFor="let healthCheck of healthChecks | async"></health-check-detail>
  `,
  styleUrls: ['./health-check-list.component.sass']
})
export class HealthCheckListComponent implements OnInit {

  @Input() healthChecks: Observable<Array<CombinedHealthCheck>>;
  @HostBinding('class') status: string;

  constructor() { }

  ngOnInit() {
    this.healthChecks
        .subscribe(healthChecks => this.status = healthChecks.length > 0 ? 'has-issues' : 'has-no-issues');
  }

}
