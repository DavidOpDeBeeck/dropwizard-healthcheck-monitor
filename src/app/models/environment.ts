import { Application } from './application';

export interface EnvironmentResponseFormat {
    [name: string]: Application[]
};

export class Environment {
    constructor(
        public name: string, 
        public applications: Application[]
    ) { }
};