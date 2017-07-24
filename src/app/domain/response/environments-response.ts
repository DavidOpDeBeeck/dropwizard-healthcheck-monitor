import { Response } from '@angular/http';

import { Application } from './../application';
import { Environment } from './../environment';

import { DomainResponse, DomainResponseFormat, DomainResponseParser, DomainResponseValidator } from "./domain-response";

export class EnvironmentsResponse implements DomainResponse {
    constructor(public environments: Environment[]) {}
}

export interface EnvironmentsResponseFormat extends DomainResponseFormat {
    [name: string]: Application[]
};

export class EnvironmentsResponseParser extends DomainResponseParser<EnvironmentsResponse, EnvironmentsResponseFormat>  {

    constructor() {
        super(new EnvironmentsResponseValidator());
    }

    protected parseValid(response: EnvironmentsResponseFormat): EnvironmentsResponse {
        return new EnvironmentsResponse(this.extractEnvironments(response));
    }

    protected parseInValid(response: object): EnvironmentsResponse {
        return new EnvironmentsResponse([]);
    }

    private extractEnvironments(response: EnvironmentsResponseFormat): Environment[] {
        let environmentNames: string[] = Object.keys(response);
        return environmentNames.map(name => this.createEnvironment(name, response[name]));
    }

    private createEnvironment(name: string, applications: any): Environment {
        return new Environment(name, this.extractApplications(applications));
    }

    private extractApplications(application: any): Application[] {
        return application.map(application => this.createApplication(application));
    }

    private createApplication(application: any): Application {
        return new Application(application.name, application.healthCheckUrl);
    }

}

export class EnvironmentsResponseValidator extends DomainResponseValidator {

    protected hasValidSchema(json: object): boolean {
        return this.isDefined(json)
            && this.hasValidEnvironments(json);
    }

    private hasValidEnvironments(json: object): boolean {
        let environmentNames: string[] = Object.keys(json);

        return environmentNames
                .map(name => this.isValidEnvironment(json[name]))
                .reduce(this.allElementsAreTruthy());
    }

    private isValidEnvironment(environment: object): boolean {
        return this.isDefined(environment)
            && this.hasValidApplications(environment);
    }
    
    private hasValidApplications(environment: object): boolean {
        let applicationIndexes: string[] = Object.keys(environment);

        return applicationIndexes
                .map(index => this.isValidApplication(environment[index]))
                .reduce(this.allElementsAreTruthy());
    }

    private isValidApplication(application: object): boolean {
        return this.isDefined(application)
            && this.isDefinedWithType(application['name'], 'string')
            && this.isDefinedWithType(application['healthCheckUrl'], 'string');
    }

}
