import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Environment, EnvironmentResponse } from './models/environment'

import 'rxjs';

@Injectable()
export class EnvironmentsService {

  constructor(
    @Inject(Http) private http
  ) { }

  getEnvironments(): Observable<Environment[]> {
    return this.http.get("./assets/environments.json")
      .map(
        (response: any) => {
          return response.json();
        })
      .map(
        (response: any) => {
          return EnvironmentResponse.fromResponse(response);
        })
      .map(
        (response: EnvironmentResponse) => {
          return response.environments;
        })
      .catch(err => Observable.of([]))
      .share();
  }
}
