import { Response } from '@angular/http';

import { Application } from './../application';
import { Environment } from './../environment';

export interface EnvironmentsResponseFormat {
    [name: string]: Application[]
};

export class EnvironmentsResponse {
    constructor(public environments: Environment[]) {}
}

export class EnvironmentsResponseParser {

    private validator: EnvironmentsResponseValidator;

    constructor() {
        this.validator = new EnvironmentsResponseValidator();
    }

    public parseResponse(response: Response): EnvironmentsResponse {
        return this.validator.isValidResponse(response)
            ? new EnvironmentsResponse(this.extractEnvironments(response.json()))
            : new EnvironmentsResponse([]);
    }

    private extractEnvironments(response: EnvironmentsResponseFormat): Environment[] {
        let environmentNames: string[] = Object.keys(response);
        return environmentNames.map(name => this.createEnvironment(name, response[name]));
    }

    private createEnvironment(name: string, environment: any): Environment {
        return new Environment(name, this.extractApplications(environment));
    }

    private extractApplications(environment: any): Application[] {
        return environment.map(application => this.createApplication(application));
    }

    private createApplication(application: any): Application {
        return new Application(application.name, application.healthCheckUrl);
    }
}

class EnvironmentsResponseValidator {
    public isValidResponse(response: Response): boolean {
        return this.hasValidJSON(response) && this.hasValidFormat(response.json());
    }

    private hasValidJSON(response: Response): boolean {
        try { response.json(); return true; } catch(e) { return false; }
    }

    private hasValidFormat(response: any): boolean {
        return response !== undefined
            && response !== null
            && this.hasValidEnvironments(response);
    }

    private hasValidEnvironments(response: any): boolean {
        return Object.keys(response)
                .filter(environmentName => ! this.isValidEnvironment(response[environmentName]))
                .length === 0;
    }

    private isValidEnvironment(environment: any): boolean {
        return environment !== undefined 
            && environment !== null 
            && this.hasValidApplications(environment);
    }
    
    private hasValidApplications(environment: any): boolean {
        return Object.keys(environment)
                .filter(application => ! this.isValidApplication(environment[application]))
                .length === 0;
    }

    private isValidApplication(application: any): boolean {
        return application !== undefined 
            && application !== null 
            && application.name !== undefined
            && application.name !== null
            && application.healthCheckUrl !== undefined
            && application.healthCheckUrl !== null;
    }
}
