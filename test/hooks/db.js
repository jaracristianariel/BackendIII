import mongoose from 'mongoose';
import connectDB from '../../src/db.js';

export const mochaHooks = {
    async beforeAll() {
        await connectDB();
    },
    async afterAll() {
        await mongoose.connection.close();
    },
};