import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Environment, EnvironmentResponseFormat } from './models/environment'

import 'rxjs';

@Injectable()
export class EnvironmentsService {

  constructor(
    @Inject(Http) private http
  ) { }

  getEnvironments(): Observable<Environment[]> {
    return this.http.get("./assets/environments.json")
      .map(res => res.json())
      .map(res => this.mapResponseToEnvironments(res))
      .catch(err => Observable.of([]))
      .share();
  }

  private mapResponseToEnvironments(res: EnvironmentResponseFormat): Environment[] {
    let names: string[] = Object.keys(res);
    return names.map(name => new Environment(name, res[name]));
  }
}
