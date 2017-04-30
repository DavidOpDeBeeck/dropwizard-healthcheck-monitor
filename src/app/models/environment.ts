import { Application } from './application';

export interface EnvironmentResponseFormat {
    [name: string]: Application[]
};

export class EnvironmentResponse {

    public static fromResponse(response: any): EnvironmentResponse {
        return EnvironmentResponse.hasValidFormat(response)
            ? new EnvironmentResponse(false, response)
            : new EnvironmentResponse(true, undefined);
    }

    private static hasValidFormat(response: any): boolean {
        let names: string[] = Object.keys(response);

        return names
                .filter(key => response[key]
                    .filter(application => application.name === undefined 
                                        || application.healthCheckUrl === undefined)
                    .length === 0)
                .length === names.length;
    }

    public environments: Environment[];

    private constructor(
        public invalid: boolean,
        public response?: EnvironmentResponseFormat
    ) {
        this.environments = invalid
            ? []
            : this.mapToEnvironments(response);
    }

    private mapToEnvironments(res: EnvironmentResponseFormat): Environment[] {
        let names: string[] = Object.keys(res);
        return names.map(name => new Environment(name, res[name]));
    }
}

export class Environment {
    constructor(
        public name: string, 
        public applications: Application[]
    ) { }
};

