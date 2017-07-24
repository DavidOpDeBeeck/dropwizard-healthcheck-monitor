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

export class MockResource {

    public static withMockBackend(mockBackend: MockBackend): MockResource {
        return new MockResource(mockBackend);
    }

    private url: string;
    private method: RequestMethod;
    private response: string;
    private status: number;
    private responseExpectations = {};

    constructor(private mockBackend: MockBackend) { 
        this.reset();
    }

    public withUrl(url: string): MockResource {
        this.url = url;
        return this;
    }

    public withMethod(method: RequestMethod): MockResource {
        this.method = method;
        return this;
    }

    public withResponse(response: any): MockResource {
        this.response = JSON.stringify(response);
        return this;
    }

    public withStatus(status: number): MockResource {
        this.status = status;
        return this;
    }

    public withErrorResponse(): MockResource {
        return this
            .withStatus(500)
            .withResponse("request was expected to fail");
    }

    public and(): MockResource {
        this.saveCurrentResponseExpectation();
        this.reset();
        return this;
    }

    private reset(): void {
        this.url = '';
        this.method = RequestMethod.Get;
        this.response = '';
        this.status = 200;
    }

    private saveCurrentResponseExpectation(): void {
        if (this.status === 200) {
            this.responseExpectations[this.url] = {
                method: this.method,
                options: { status: this.status, body: this.response }
            };
        } else {
            this.responseExpectations[this.url] = {
                method: this.method,
                options: { type: ResponseType.Error, status: this.status, body: this.response }
            };
        }
    }

    public build() {
        this.saveCurrentResponseExpectation();
        this.reset();
        this.mockBackend.connections.subscribe((connection: MockConnection) => {
            this.checkRequestExpectation(connection);
            let opts = this.responseExpectations[connection.request.url].options;

            if (this.status === 200) {
                connection.mockRespond(new Response(new ResponseOptions(opts)));                
            } else {
                connection.mockError(new ErrorResponse(new ResponseOptions(opts)));
            }
        });
    }

    private checkRequestExpectation(connection: MockConnection): void {
        let request: Request = connection.request;
        let validUrls: string[] = Object.keys(this.responseExpectations);

        if (validUrls.indexOf(request.url) === -1 && this.responseExpectations[request.url] === request.method) {
            connection.mockError(new Error(`expected request on url: ${this.url} with method: ${this.method}`)); 
        }
    }
} 