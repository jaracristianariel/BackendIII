import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';
import Order from '../../src/models/order.js';
import { cleanDatabase } from '../helpers/cleanup.js';

describe('Orders API', () => {
    after(cleanDatabase);

    describe('POST /api/orders', () => {
        before(cleanDatabase);

        it('crea un pedido y devuelve 201 con status "pending" por defecto', async () => {
            const res = await request(app).post('/api/orders').send({
                customerName: 'Ana Pérez',
                address: 'Av. Siempre Viva 742',
                weight: 5,
            });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('_id');
            expect(res.body.customerName).to.equal('Ana Pérez');
            expect(res.body.status).to.equal('pending');
            expect(res.body.cost).to.equal(50); // weight * 10
        });

        it('devuelve 400 con formato de error si faltan datos obligatorios', async () => {
            const res = await request(app).post('/api/orders').send({
                customerName: 'Sin dirección ni peso',
            });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('message');
        });

        it('devuelve 400 si el peso no es un número válido', async () => {
            const res = await request(app).post('/api/orders').send({
                customerName: 'Peso Inválido',
                address: 'Calle Falsa 123',
                weight: 'pesado',
            });

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
        });
    });

    describe('GET /api/orders/:id', () => {
        let orderId;

        before(async () => {
            await cleanDatabase();
            const order = await Order.create({
                customerName: 'Luis Gómez',
                address: 'Calle 123',
                weight: 3,
                cost: 30,
                status: 'pending',
                priority: 'normal',
            });
            orderId = order._id.toString();
        });

        it('devuelve 200 y el pedido correcto por id', async () => {
            const res = await request(app).get(`/api/orders/${orderId}`);

            expect(res.status).to.equal(200);
            expect(res.body._id).to.equal(orderId);
            expect(res.body.customerName).to.equal('Luis Gómez');
        });

        it('devuelve 404 con formato de error si el pedido no existe', async () => {
            const idInexistente = '66f1a2b3c4d5e6f7a8b9c0aa';
            const res = await request(app).get(`/api/orders/${idInexistente}`);

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', 'error');
        });

        it('devuelve 400 si el id no tiene formato de ObjectId válido', async () => {
            const res = await request(app).get('/api/orders/id-invalido');

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
        });
    });

    describe('PATCH /api/orders/:id/status', () => {
        let orderId;

        before(async () => {
            await cleanDatabase();
            const order = await Order.create({
                customerName: 'Milla Test',
                address: 'Calle Test 456',
                weight: 2,
                cost: 20,
                status: 'pending',
                priority: 'normal',
            });
            orderId = order._id.toString();
        });

        it('actualiza el estado del pedido y lo devuelve actualizado', async () => {
            const res = await request(app)
                .patch(`/api/orders/${orderId}/status`)
                .send({ status: 'in_transit' });

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('in_transit');
        });

        it('devuelve 400 si no se envía el status', async () => {
            const res = await request(app)
                .patch(`/api/orders/${orderId}/status`)
                .send({});

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
        });

        it('devuelve 404 si el pedido no existe', async () => {
            const idInexistente = '66f1a2b3c4d5e6f7a8b9c0aa';
            const res = await request(app)
                .patch(`/api/orders/${idInexistente}/status`)
                .send({ status: 'delivered' });

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
        });
    });
});