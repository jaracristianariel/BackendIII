import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';
import { cleanDatabase } from '../helpers/cleanup.js';

describe('Mocks API', () => {
    after(cleanDatabase);

    describe('GET /api/mocks/users (simulados, sin guardar)', () => {
        it('devuelve la cantidad pedida de usuarios simulados', async () => {
            const res = await request(app).get('/api/mocks/users?qty=3');

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').with.lengthOf(3);
            expect(res.body[0]).to.have.property('email');
            expect(res.body[0]).to.have.property('role');
        });

        it('no guarda nada en la base (son simulados)', async () => {
            await cleanDatabase();
            await request(app).get('/api/mocks/users?qty=5');

            const res = await request(app).get('/api/users');
            expect(res.body.data).to.have.lengthOf(0);
        });

        it('devuelve 400 si qty es negativo', async () => {
            const res = await request(app).get('/api/mocks/users?qty=-5');

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
        });

        it('devuelve 400 si qty no es un número', async () => {
            const res = await request(app).get('/api/mocks/users?qty=abc');

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
        });
    });

    describe('POST /api/mocks/users/seed (carga real en Mongo)', () => {
        before(cleanDatabase);

        it('inserta usuarios reales y devuelve el formato esperado', async () => {
            const res = await request(app).post('/api/mocks/users/seed?qty=4');

            expect(res.status).to.equal(201);
            expect(res.body).to.deep.equal({ insertados: 4, coleccion: 'usuarios' });

            const listado = await request(app).get('/api/users');
            expect(listado.body.data).to.have.lengthOf(4);
        });

        it('devuelve 400 si qty es inválido', async () => {
            const res = await request(app).post('/api/mocks/users/seed?qty=0');

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
        });
    });
});