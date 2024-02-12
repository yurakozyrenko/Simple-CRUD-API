import { Server, createServer } from 'http';
import { usersControllers } from './controllers/usersControllers';
import { handleRequest } from './helpers/handlers';
import { WorkerMessage } from './types/worker-types';
import { HttpResponse } from './types/server-types';

process.on('message', (data: Buffer) => {
    const message: WorkerMessage = JSON.parse(data.toString());

    process.stdout.write(`Updating users on worker ${process.pid}\n`);

    usersControllers.setUsers(message.users);
});

export const app = (): Server => {
    const server: Server = createServer(async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-type', 'application/json');

        console.log(`\nServer started ${process.pid}`);

        try {
            const data: HttpResponse = await handleRequest(req, res);
            const isSuccess = !!data.status;
            res.statusCode = isSuccess ? data.status : 404;

            res.end(
                isSuccess
                    ? data.response
                    : JSON.stringify({ error: 'Not found' })
            );
        } catch (error: any) {
            res.statusCode = 500;
            res.end(
                JSON.stringify({
                    error: error.message || 'Unexpected server side error!',
                })
            );
        }
    });
    return server;
};
