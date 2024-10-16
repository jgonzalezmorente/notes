export const createConnection = async ({ entities, ...options }) => {
    return new Promise((resolve) => {
        console.log('Conectado a la base de datos con las opciones: ', options);
        setTimeout(() => {
            console.log('Conectado a la base de datos!');
            resolve({
                connected: true,
                entities,
                options,
                query: (sql: string) => `Ejecutando query: ${sql}`
            });
        }, 200);
    });
}