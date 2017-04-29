import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions, ResponseType, RequestMethod } from '@angular/http';

class ErrorResponse extends Response implements Error {
    name: any
    message: any
}

export class MockBackendBuilder {

    public static mockBackend(mockBackend: MockBackend): MockBackendBuilder {
        return new MockBackendBuilder(mockBackend);
    }

    private mockBackend: MockBackend;
    private url: string;
    private method: RequestMethod = RequestMethod.Get;
    private response: any;
    private status: number = 200;
    private fail: boolean = false;

    constructor(mockBackend: MockBackend) {
        this.mockBackend = mockBackend;
    }

    public withUrl(url: string): MockBackendBuilder {
        this.url = url;
        return this;
    }

    public withMethod(method: RequestMethod): MockBackendBuilder {
        this.method = method;
        return this;
    }

    public withResponse(response: any): MockBackendBuilder {
        this.response = response;
        return this;
    }

    public withStatus(status: number): MockBackendBuilder {
        this.status = status;
        return this;
    }

    public withFail(): MockBackendBuilder {
        this.fail = true;
        return this;
    }

    public build() {
        this.mockBackend.connections.subscribe((connection: MockConnection) => {
            let request = connection.request;

            if (request.url !== this.url || request.method !== this.method) {
                connection.mockError(new Error(`expected request on url: ${this.url} with method: ${this.method}`)); 
                return;
            }

            if (this.fail) {
                connection.mockError(new Error("expected to fail")); 
                return;
            }

            let body = JSON.stringify(this.response);

            if (this.status !== 200) {
                let opts = { type: ResponseType.Error, status: this.status, body: body };
                connection.mockError(new ErrorResponse(new ResponseOptions(opts)));
            } else {
                let opts = { status: this.status, body: body };
                connection.mockRespond(new Response(new ResponseOptions(opts)));
            }
        });
    }
} 