// Sergio Coria - Organizations
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Organization = require('../models/organizations');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: 'test' });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Organization.deleteMany();
});

describe('GET /organizations', () => {
    test('returns empty array initially', async () => {
        const res = await request(app).get('/organizations');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('returns a list of organizations', async () => {
        const org = await Organization.create({
            name: 'Test Organization',
            description: 'Test description',
            address: '123 Test Street',
            email: 'test@example.com',
            phone: '555-555-5555',
            website: 'https://example.com',
            createdBy: 'tester'
        });

        const res = await request(app).get('/organizations');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]._id).toBe(org.id);
        expect(res.body[0].name).toBe('Test Organization');
    });
});

describe('GET /organizations/:id', () => {
    test('returns a single organization', async () => {
        const org = await Organization.create({
            name: 'Single Organization',
            description: 'Single description',
            address: '456 Other Street',
            email: 'single@example.com',
            phone: '555-111-2222',
            website: 'https://single.com',
            createdBy: 'tester'
        });

        const res = await request(app).get(`/organizations/${org.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Single Organization');
    });

    test('returns 404 if organization not found', async () => {
        const badId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/organizations/${badId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Organization not found');
    });
});
