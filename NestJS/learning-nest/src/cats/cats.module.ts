import { Module } from '@nestjs/common';
import { CatsController } from './controllers';
import { CatsService, TestService } from './services';

@Module({
    controllers: [
        CatsController
    ],
    providers: [
        CatsService,
        TestService,
    ],
    imports: [
        // CommonModule
    ],
    exports: [
        //CatsService,
        //CommonModule
    ],

})
export class CatsModule {

    constructor(private readonly catsService: CatsService) {
        // catsService.config = {...}
    }


}