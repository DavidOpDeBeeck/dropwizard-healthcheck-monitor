import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EnvironmentsService } from './../environments.service';
import { Environment } from './../models/environment';

import "rxjs/add/operator/merge";

@Component({
  selector: 'environment-list',
  template: `
    <environment-detail 
        fxLayout="column" fxFlexFill fxFlex
        [environment]="environment"
        *ngFor="let environment of environments | async">
    </environment-detail>
  `,
  styleUrls: ['./environment-list.component.sass']
})
export class EnvironmentListComponent implements OnInit {

  environments: Observable<Array<Environment>>;

  constructor(
    private environmentsService : EnvironmentsService
  ) { }

  ngOnInit() {
    this.environments = this.environmentsService.getEnvironments();
  }
}
