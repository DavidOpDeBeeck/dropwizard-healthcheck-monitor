import { Component, AfterViewInit, Input, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CombinedHealthCheck } from './../domain/health-check';

@Component({
  selector: 'health-check-list',
  template: `
    <health-check-detail 
        fxFlex fxLayout="column"
        [healthCheck]="healthCheck"
        *ngFor="let healthCheck of healthChecks | async">
    </health-check-detail>
    <span class="time" [innerHtml]="lastUpdatedTime"></span>
  `,
  styleUrls: ['./health-check-list.component.sass']
})
export class HealthCheckListComponent implements OnInit {

  @Input() healthChecks: Observable<CombinedHealthCheck[]>;
  @HostBinding('class') status: string;
  lastUpdatedTime: string;

  constructor() { }

  ngOnInit() {
    this.healthChecks
      .subscribe(healthChecks => {
        this.updateLastUpdatedTime(new Date());
        this.updateStatus(healthChecks);
      });
  }

  updateStatus(healthChecks: CombinedHealthCheck[]) {
    this.status = healthChecks.length > 0 ? 'has-issues' : 'has-no-issues';
  }

  updateLastUpdatedTime(lastUpdatedTime: Date) {
    let hour = lastUpdatedTime.getHours();
    let minutes = lastUpdatedTime.getMinutes();
    let seconds = lastUpdatedTime.getSeconds();
    
    this.lastUpdatedTime = `${hour}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }
}
