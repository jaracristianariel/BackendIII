import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';

describe('Swagger docs', () => {
    it('GET /api/docs responde 200 y sirve HTML de la documentación', async () => {
        const res = await request(app).get('/api/docs/');

        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.include('text/html');
    });
});