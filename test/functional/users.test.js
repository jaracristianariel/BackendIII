import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/user.js';
import { cleanDatabase } from '../helpers/cleanup.js';

describe('Users API', () => {
    after(cleanDatabase);

    describe('GET /api/users', () => {
        before(async () => {
            await cleanDatabase();
            await User.create({
                first_name: 'Ana',
                last_name: 'Pérez',
                email: 'ana.test@shipnow.com',
                password: '123456',
                role: 'user',
            });
        });

        it('devuelve 200 y una lista de usuarios con la estructura esperada', async () => {
            const res = await request(app).get('/api/users');

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data.length).to.be.greaterThan(0);
            expect(res.body).to.have.property('total');
            expect(res.body).to.have.property('page');
            expect(res.body).to.have.property('totalPages');

            const user = res.body.data[0];
            expect(user).to.have.property('_id');
            expect(user).to.have.property('email');
            expect(user).to.have.property('role');
        });
    });

    describe('POST /api/users', () => {
        it('crea un usuario y devuelve 201 con los datos correctos', async () => {
            const res = await request(app).post('/api/users').send({
                first_name: 'Luis',
                last_name: 'Gómez',
                email: 'luis.test@shipnow.com',
                password: '123456',
            });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('_id');
            expect(res.body.email).to.equal('luis.test@shipnow.com');
            expect(res.body.role).to.equal('user'); // rol por defecto
        });

        it('devuelve 400 con formato de error si faltan datos obligatorios', async () => {
            const res = await request(app).post('/api/users').send({
                first_name: 'Sin Email Ni Password',
            });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('cause');
        });

        it('devuelve 400 si el rol enviado no es válido', async () => {
            const res = await request(app).post('/api/users').send({
                email: 'rol-invalido@shipnow.com',
                password: '123456',
                role: 'superadmin',
            });

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
        });
    });
});