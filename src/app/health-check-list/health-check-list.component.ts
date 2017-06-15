import { Component, AfterViewInit, Input, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CombinedHealthCheck } from './../models/health-check';

@Component({
  selector: 'health-check-list',
  template: `
    <health-check-detail 
        fxFlex fxLayout="column"
        [healthCheck]="healthCheck"
        *ngFor="let healthCheck of healthChecks | async">
    </health-check-detail>
    <span class="time">update in {{ refreshCount - countdown }} seconds</span>
  `,
  styleUrls: ['./health-check-list.component.sass']
})
export class HealthCheckListComponent implements OnInit {

  @Input() healthChecks: Observable<CombinedHealthCheck[]>;
  @HostBinding('class') status: string;

  countdown: number = 0;
  refreshCount: number = 60;

  constructor() { }

  ngOnInit() {
    this.initCountdown();
    this.initHealthChecks();
  }

  initCountdown() {
    Observable.timer(0, 1000)
        .forEach(() => this.updateCountDown());
  }

  initHealthChecks() {
    this.healthChecks
      .subscribe(healthChecks => {
        this.resetCountDown();
        this.updateStatus(healthChecks);
      });
  }

  updateStatus(healthChecks: CombinedHealthCheck[]) {
    this.status = healthChecks.length > 0 ? 'has-issues' : 'has-no-issues';
  }

  resetCountDown() {
    this.countdown = 0;
  }

  updateCountDown() {
    this.countdown++;
  }
}
