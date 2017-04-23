import { Application } from './application';

export interface Environment {
    name: string,
    applications: Application[]
};

export interface EnvironmentResponse {
    [name: string]: Application[]
};