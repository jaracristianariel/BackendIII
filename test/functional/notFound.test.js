import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';

describe('Ruta inexistente', () => {
    it('devuelve 404 con el formato de error estándar', async () => {
        const res = await request(app).get('/api/esta-ruta-no-existe');

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message', 'Ruta no encontrada');
        expect(res.body).to.have.property('cause');
    });
});