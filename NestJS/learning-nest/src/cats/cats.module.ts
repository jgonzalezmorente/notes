import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CatsController } from './controllers';
import { CatsService } from './services';
import { AuthMiddelware, loggerFun, LoggerMiddelware } from './middlewares';

const esperar = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

@Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService]
})
export class CatsModule implements NestModule {
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