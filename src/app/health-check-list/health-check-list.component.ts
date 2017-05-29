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
    <span class="time" [innerHtml]="currentTime"></span>
  `,
  styleUrls: ['./health-check-list.component.sass']
})
export class HealthCheckListComponent implements OnInit {

  @Input() healthChecks: Observable<CombinedHealthCheck[]>;
  @HostBinding('class') status: string;
  currentTime: string;

  constructor() { }

  ngOnInit() {
    this.healthChecks
      .subscribe(healthChecks => {
        this.updateTime();
        this.updateStatus(healthChecks);
      });
  }

  updateStatus(healthChecks: CombinedHealthCheck[]) {
    this.status = healthChecks.length > 0 ? 'has-issues' : 'has-no-issues';
  }

  updateTime() {
    let date = new Date();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    this.currentTime = `${hour}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }
}
