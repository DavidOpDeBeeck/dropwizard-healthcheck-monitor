import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Environment, EnvironmentResponse } from './models/environment'
import { Application } from './models/application'
import { HealthStatus } from './models/health-status'

import 'rxjs';

@Injectable()
export class EnvironmentsService {

  constructor(
    @Inject(Http) private http
  ) { }

  getEnvironments(): Observable<Environment[]> {
    return this.http.get("./assets/environments.json")
      .map(res => res.json())
      .map(res => this.mapToEnvironments(res))
      .catch(err => Observable.of([]))
      .share();
  }

  private mapToEnvironments(response: EnvironmentResponse): Environment[] {
    let environmentNames : string[] = Object.keys(response);
    return environmentNames.map(name => new Environment(name, response[name]));
  }
}
