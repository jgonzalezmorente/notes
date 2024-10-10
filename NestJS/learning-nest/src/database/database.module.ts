import { DynamicModule, Module } from '@nestjs/common';
import { createDatabaseProviders } from './create-database-providers';

@Module({})
export class DatabaseModule {
    static forRoot(entities = [], options?): DynamicModule {
        const providers = createDatabaseProviders(options, entities);
        return {
            module: DatabaseModule,
            providers: providers,
            exports: providers,
            global: true
        }
    }
}
