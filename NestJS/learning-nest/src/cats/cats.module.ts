import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CatsController } from './controllers';
import { CatsService } from './services';
import { AuthMiddelware, loggerFun, LoggerMiddelware } from './middlewares';

const esperar = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

@Module({
    controllers: [
        CatsController
    ],
    providers: [
        CatsService
    ],
    imports: [
        // CommonModule
    ],
    exports: [
        //CatsService,
        //CommonModule
    ],

})
export class CatsModule implements NestModule {

    constructor(private readonly catsService: CatsService) {
        // catsService.config = {...}
    }

    async configure(consumer: MiddlewareConsumer) {
        // await esperar(1000);
        consumer
            .apply(LoggerMiddelware, AuthMiddelware, loggerFun)
            .exclude(
                { path: 'cats', method: RequestMethod.GET },
                'cats/(.*)'
            )
            .forRoutes(CatsController);
    }
}