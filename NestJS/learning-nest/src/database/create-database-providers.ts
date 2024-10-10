import { createConnection } from './create-connection';

export const createDatabaseProviders = (options, entities) => {
    return [
        {
            provide: 'DATABASE_CONNECTION',
            useFactory: async () => {
                const connection = await createConnection({
                    entities,
                    ...options
                });
                return connection;
            }
        }
    ];
}