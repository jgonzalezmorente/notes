import { Inject, Optional } from '@nestjs/common';

export class HttpService<T> {
    constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}

    getClient(): T {
        if (this.httpClient) {
            console.log('Cliente HTTP inyectado:', this.httpClient);
            return this.httpClient;
        }
        console.log('No se ha inyectado ningún cliente HTTP');
        return null;
    }
}