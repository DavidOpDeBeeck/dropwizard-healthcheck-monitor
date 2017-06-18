import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, Request, ResponseOptions, ResponseType, RequestMethod } from '@angular/http';

class ErrorResponse extends Response implements Error {
    name: any
    message: any
}

export class MockResponse extends Response {
    constructor(response: any) {
        super(new ResponseOptions({ status: 200, body: JSON.stringify(response) }));
    }
}

export class MockBackendBuilder {

    public static withMockBackend(mockBackend: MockBackend): MockBackendBuilder {
        return new MockBackendBuilder(mockBackend);
    }

    private mockBackend: MockBackend;
    private url: string;
    private method: RequestMethod = RequestMethod.Get;
    private response: string;
    private status: number = 200;

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
        this.response = JSON.stringify(response);
        return this;
    }

    public withStatus(status: number): MockBackendBuilder {
        this.status = status;
        return this;
    }

    public withFail(): MockBackendBuilder {
        return this
            .withStatus(500)
            .withResponse("request was expected to fail");
    }

    public build() {
        this.mockBackend.connections.subscribe((connection: MockConnection) => {
            this.checkRequestExpectation(connection);

            if (this.status !== 200) {
                let opts = { type: ResponseType.Error, status: this.status, body: this.response };
                connection.mockError(new ErrorResponse(new ResponseOptions(opts)));
            } else {
                let opts = { status: this.status, body: this.response };
                connection.mockRespond(new Response(new ResponseOptions(opts)));
            }
        });
    }

    private checkRequestExpectation(connection: MockConnection): void {
        let request: Request = connection.request;

        if (request.url !== this.url || request.method !== this.method) {
            connection.mockError(new Error(`expected request on url: ${this.url} with method: ${this.method}`)); 
        }
    }
} 