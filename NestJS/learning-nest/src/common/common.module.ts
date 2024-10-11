import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsExtendFilter, AllExceptionsFilter, HttpExceptionFilter } from './filters';
import { HttpService, AuthService } from './services';


export class CustomHttpClient {
    request() {
        return 'Solicitud HTTP desde CustomHttpClient';
    }
}

@Global()
@Module({
    providers: [
        // { provide: 'HTTP_OPTIONS', useClass: CustomHttpClient },
        // { provide: APP_FILTER, useClass: AllExceptionsFilter },
        { provide: APP_FILTER, useClass: AllExceptionsExtendFilter },
        // { provide: APP_FILTER, useClass: HttpExceptionFilter },
        HttpService,
        AuthService
    ],
    exports: [
        HttpService,
        AuthService,
    ]
})
export class CommonModule {}
