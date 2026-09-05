import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';

describe('Health check', () => {
    it('GET /health devuelve el estado sin datos sensibles', async () => {
        const res = await request(app).get('/health');

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'ok');
        expect(res.body).to.have.property('environment');
        expect(res.body).to.have.property('uptime');
        expect(res.body).to.have.property('timestamp');

        // Nada de datos sensibles en la respuesta.
        const bodyAsString = JSON.stringify(res.body);
        expect(bodyAsString).to.not.include('mongodb');
        expect(bodyAsString).to.not.include(process.env.SECRET);
    });
});