import { Application } from './application';

export class Environment {
    constructor(
        public name: string, 
        public applications: Application[]
    ) { }
};

