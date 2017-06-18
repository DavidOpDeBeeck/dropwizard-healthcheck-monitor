import { Application } from './application';
import { Environment } from './environment';

export interface EnvironmentResponseFormat {
    [name: string]: Application[]
};

export class EnvironmentResponse {
    constructor(public environments: Environment[]) {}
}

export class EnvironmentResponseParser {
    public parseResponse(response: any): EnvironmentResponse {
        return this.isValidEnvironmentResponse(response)
            ? new EnvironmentResponse(this.toEnvironments(response.json()))
            : new EnvironmentResponse([]);
    }

    private isValidEnvironmentResponse(response: any): boolean {
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

    private toEnvironments(response: EnvironmentResponseFormat): Environment[] {
        let names: string[] = Object.keys(response);
        return names.map(name => new Environment(name, response[name].map(application => this.toApplication(application))));
    }

    private toApplication(application: any): Application {
        return new Application(application.name, application.healthCheckUrl);
    }
}
