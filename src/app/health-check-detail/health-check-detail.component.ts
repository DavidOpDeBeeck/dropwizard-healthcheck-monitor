import { Component, OnInit, Input, HostBinding } from '@angular/core';

import { HealthStatus } from './../models/health-status';
import { CombinedHealthCheck } from './../models/health-check';
import { HealthStatusPipe } from './../health-status.pipe';

@Component({
  selector: 'health-check-detail',
  template: `
    <section class="applications" fxFlex="none" fxLayout="row">
      <h2 fxFlex *ngFor="let application of healthCheck.applications" [innerHtml]="application.name"></h2>
    </section>
    <section class="name"  fxFlex fxLayoutAlign="center center">
      <h3 [innerHtml]="healthCheck?.name | startCase"></h3>
    </section>`,
  styleUrls: ['./health-check-detail.component.sass']
})
export class HealthCheckDetailComponent implements OnInit {

  @Input() healthCheck: CombinedHealthCheck;
  @HostBinding('class') status: string;

  constructor(private healthStatusPipe: HealthStatusPipe) { }

  ngOnInit() {
    this.status = this.healthStatusPipe.transform(this.healthCheck.status);
  }
}
