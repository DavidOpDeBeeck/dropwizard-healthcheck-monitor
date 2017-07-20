import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Environment } from './domain/environment'
import { EnvironmentResponse, EnvironmentResponseParser } from './domain/response/environment-response'

import 'rxjs';

@Injectable()
export class EnvironmentsService {

  private parser: EnvironmentResponseParser;

  constructor(@Inject(Http) private http) {
    this.parser = new EnvironmentResponseParser();
  }

  getEnvironments(): Observable<Environment[]> {
    return this.http.get("./assets/environments.json")
      .map(response => this.parser.parseResponse(response))
      .map(response => response.environments)
      .catch(err => Observable.of([]))
      .share();
  }
}
