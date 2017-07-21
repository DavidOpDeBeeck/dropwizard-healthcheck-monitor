import { Application } from './../application';
import { Environment } from './../environment';

export interface EnvironmentsResponseFormat {
    [name: string]: Application[]
};

export class EnvironmentsResponse {
    constructor(public environments: Environment[]) {}
}

export class EnvironmentsResponseParser {
    public parseResponse(response: any): EnvironmentsResponse {
        return this.isValidEnvironmentsResponse(response)
            ? new EnvironmentsResponse(this.toEnvironments(response.json()))
            : new EnvironmentsResponse([]);
    }

    private isValidEnvironmentsResponse(response: any): boolean {
        return this.isValidJSON(response) 
            && this.hasValidFormat(response.json());
    }

    private isValidJSON(response: any): boolean {
        try { response.json(); return true; } catch(e) { return false; }
    }

    private hasValidFormat(response: any): boolean {
        return response !== undefined && Object.keys(response)
                .filter(environmentName => ! this.isValidEnvironment(response[environmentName]))
                .length === 0;
    }

    private isValidEnvironment(environment: any): boolean {
        return environment !== undefined 
            && environment !== null 
            && Object.keys(environment)
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

    private toEnvironments(response: EnvironmentsResponseFormat): Environment[] {
        let names: string[] = Object.keys(response);
        return names.map(name => new Environment(name, response[name].map(application => this.toApplication(application))));
    }

    private toApplication(application: any): Application {
        return new Application(application.name, application.healthCheckUrl);
    }
}
