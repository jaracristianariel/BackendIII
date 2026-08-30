import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';

describe('Logger API', () => {
    describe('GET /api/logs/test', () => {
        it('devuelve 200 y confirma que se generaron los 6 niveles de log', async () => {
            const res = await request(app).get('/api/logs/test');

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message');
            expect(res.body.niveles).to.have.members([
                'debug', 'http', 'info', 'warning', 'error', 'fatal',
            ]);
        });
    });
});