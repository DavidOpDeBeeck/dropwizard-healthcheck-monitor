import { Response } from '@angular/http'

export interface DomainResponse {}

export interface DomainResponseFormat {}

export abstract class DomainResponseParser<R extends DomainResponse, F extends DomainResponseFormat> {

    constructor(private validator: DomainResponseValidator) {}

    public parseResponse(response: Response): R {
        return this.validator.isValid(response)
            ? this.parseValid(response.json())
            : this.parseInValid(response);
    }

    protected abstract parseValid(response: F): R;

    protected abstract parseInValid(response: object): R;

}

export abstract class DomainResponseValidator {

    public isValid(response: Response): boolean {
        return this.hasValidJSON(response) && this.hasValidSchema(response.json());
    }

    protected abstract hasValidSchema(json: object): boolean;

    protected hasValidJSON(response: Response): boolean {
        try { response.json(); return true; } catch(e) { return false; }
    }

    protected isDefined(object: object): boolean {
        return object !== undefined && object !== null;
    }

    protected isDefinedWithType(object: object, type: string): boolean {
        return this.isDefined(object) && typeof object === type;
    }

    protected allElementsAreTruthy(): any {
        return (previous, current) => previous && current;
    }

}