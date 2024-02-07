import { Server } from 'socket.io';
import Redis from 'ioredis';

const pub = new Redis({
    host: 'redis-4ccc0a8-realmadrid83527-fe92.a.aivencloud.com',
    port: 10882,
    username: 'default',
    password: 'AVNS_WCG6p1Yh7aSOdtQO5uQ'
});

const sub = new Redis({
    host: 'redis-4ccc0a8-realmadrid83527-fe92.a.aivencloud.com',
    port: 10882,
    username: 'default',
    password: 'AVNS_WCG6p1Yh7aSOdtQO5uQ'
});

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Init Socket Services...")
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*'
            }
        });
        sub.subscribe('MESSAGES');

    }

    public initListeners() {
        const io = this._io;
        console.log("Init Socket Listeners...");
        io.on("connect", (socket) => {
            console.log("New connection", socket.id);

            socket.on("event:message", async ({ message }: { message: string }) => {
                console.log("New message received", message);
                await pub.publish('MESSAGES', JSON.stringify({ message }));
            });
        });
        sub.on('message', (channel, message) => {
            if (channel === 'MESSAGES') {
                console.log("New message received from Redis", message);
                io.emit("message", message);
            }
        })
    }


    get io() {
        return this._io;
    }
}

export default SocketService;