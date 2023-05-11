import { afterAll, beforeAll } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | undefined;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
});

afterAll(async () => {
    await mongoServer?.stop();
});

process.env.MONGO_URL = mongoServer?.getUri() || '';
