import { afterAll, beforeAll, describe, expect } from '@jest/globals';
import { it } from 'node:test';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import connect from '../schemas';
let mongoServer: MongoMemoryServer;
// await connect(process.env.EPSILON_DATABASE_IP || '127.0.0.1');

describe('MongoDB Connection', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as Parameters<typeof mongoose.connect>[1]);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    // it('should connect to the database', async () => {
    //     // 0: 연결이 아직 되지 않은 상태
    //     // 1: 연결되어 있는 상태
    //     // 2: 연결 진행 중인 상태
    //     // 3: 연결이 끊어진 상태
    //     console.log(mongoose.connection.readyState);
    //     expect(mongoose.connection.readyState).toBe(1);
    // });

    describe('Mongoose Test', () => {
        it('should be able to save and retrieve a document', async () => {
            // Create a Mongoose model and save a document
            const Cat = mongoose.model('Cat', { name: String });
            const kitty = new Cat({ name: 'Garfield' });
            await kitty.save();

            // Retrieve the saved document
            const garfield = await Cat.findOne({ name: 'Garfield' });

            // Assert that the retrieved document matches the saved document
            expect(garfield?.name).toEqual(kitty.name);
        });
    });
});
