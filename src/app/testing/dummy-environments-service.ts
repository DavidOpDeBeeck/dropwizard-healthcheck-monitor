import { Environment } from './../domain/environment';
import { EnvironmentsService } from './../environments.service';

import { Observable } from 'rxjs/Observable';

export class DummyEnvironmentsService extends EnvironmentsService {

  public static withResponse(environments: Environment[]): EnvironmentsService {
    return new DummyEnvironmentsService(environments);
  }

  constructor(private environments: Environment[]) {
    super(null);
  }

  getEnvironments() : Observable<Array<Environment>> {
    return Observable.of(this.environments);
  }
}