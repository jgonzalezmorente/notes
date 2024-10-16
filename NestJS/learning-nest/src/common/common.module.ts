import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsExtendFilter, AllExceptionsFilter, HttpExceptionFilter } from './filters';
import { HttpService, AuthService } from './services';
import { LoggerMiddelware, AuthMiddelware, loggerFun } from './middlewares';

const esperar = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
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
        // { provide: APP_FILTER, useClass: AllExceptionsExtendFilter },
        // { provide: APP_FILTER, useClass: HttpExceptionFilter },
        HttpService,
        AuthService
    ],
    exports: [
        HttpService,
        AuthService,
    ]
})
export class CommonModule implements NestModule {
    async configure(consumer: MiddlewareConsumer): Promise<void> {
        // await esperar(1000);
        return new Promise((resolve) => {
            console.log('configure síncrono!');
            setTimeout(() => {
                consumer
                    .apply(LoggerMiddelware, AuthMiddelware)
                    .exclude(
                        { path: 'cats', method: RequestMethod.GET },
                        'cats/(.*)'
                    )
                    .forRoutes('cats');
                console.log('Middlewares configurados');
                resolve();

            }, 500);
        });
    }
}
