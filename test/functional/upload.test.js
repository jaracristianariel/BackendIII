import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/user.js';
import Order from '../../src/models/order.js';
import Delivery from '../../src/models/delivery.js';
import { cleanDatabase } from '../helpers/cleanup.js';

const SAMPLE_PDF = 'test/fixtures/sample.pdf';
const INVALID_FILE = 'test/fixtures/invalid.txt';

describe('Uploads API', () => {
    after(cleanDatabase);

    describe('POST /api/users/:id/documents', () => {
        let userId;

        before(async () => {
            await cleanDatabase();
            const user = await User.create({
                email: 'con-documentos@shipnow.com',
                password: '123456',
            });
            userId = user._id.toString();
        });

        it('sube un documento válido y lo asocia al usuario', async () => {
            const res = await request(app)
                .post(`/api/users/${userId}/documents`)
                .field('documentType', 'dni')
                .attach('document', SAMPLE_PDF);

            expect(res.status).to.equal(201);
            expect(res.body.documents).to.have.lengthOf(1);
            expect(res.body.documents[0]).to.have.property('originalName', 'sample.pdf');
            expect(res.body.documents[0]).to.have.property('documentType', 'dni');
        });

        it('devuelve 400 si no se envía ningún archivo', async () => {
            const res = await request(app)
                .post(`/api/users/${userId}/documents`)
                .field('documentType', 'dni');

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
        });

        it('devuelve 400 si el tipo de archivo no está permitido', async () => {
            const res = await request(app)
                .post(`/api/users/${userId}/documents`)
                .attach('document', INVALID_FILE);

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
        });

        it('devuelve 400 si el documentType enviado no es válido', async () => {
            const res = await request(app)
                .post(`/api/users/${userId}/documents`)
                .field('documentType', 'pasaporte')
                .attach('document', SAMPLE_PDF);

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
        });

        it('devuelve 404 si el usuario no existe', async () => {
            const idInexistente = '66f1a2b3c4d5e6f7a8b9c0aa';
            const res = await request(app)
                .post(`/api/users/${idInexistente}/documents`)
                .attach('document', SAMPLE_PDF);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
        });
    });

    describe('POST /api/orders/:id/receipt', () => {
        let orderId;

        before(async () => {
            await cleanDatabase();
            const order = await Order.create({
                customerName: 'Cliente Test',
                address: 'Calle Test 123',
                weight: 2,
                cost: 20,
            });
            orderId = order._id.toString();
        });

        it('sube un comprobante y lo asocia al pedido', async () => {
            const res = await request(app)
                .post(`/api/orders/${orderId}/receipt`)
                .attach('receipt', SAMPLE_PDF);

            expect(res.status).to.equal(201);
            expect(res.body.receipt).to.have.property('originalName', 'sample.pdf');
        });

        it('devuelve 404 si el pedido no existe', async () => {
            const idInexistente = '66f1a2b3c4d5e6f7a8b9c0aa';
            const res = await request(app)
                .post(`/api/orders/${idInexistente}/receipt`)
                .attach('receipt', SAMPLE_PDF);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
        });
    });

    describe('POST /api/deliveries/:id/receipt', () => {
        let deliveryId;

        before(async () => {
            await cleanDatabase();
            const delivery = await Delivery.create({});
            deliveryId = delivery._id.toString();
        });

        it('sube un comprobante y lo asocia a la entrega', async () => {
            const res = await request(app)
                .post(`/api/deliveries/${deliveryId}/receipt`)
                .attach('receipt', SAMPLE_PDF);

            expect(res.status).to.equal(201);
            expect(res.body.receipt).to.have.property('originalName', 'sample.pdf');
        });

        it('devuelve 404 si la entrega no existe', async () => {
            const idInexistente = '66f1a2b3c4d5e6f7a8b9c0aa';
            const res = await request(app)
                .post(`/api/deliveries/${idInexistente}/receipt`)
                .attach('receipt', SAMPLE_PDF);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
        });
    });
});