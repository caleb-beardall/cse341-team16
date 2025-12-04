// tests/locations.test.js - Rick Shaw
jest.setTimeout(20000);

const request = require('supertest');
const app = require('../server'); 

describe('Locations API', () => {
  it('GET /locations should return 200 and an array', async () => {
    const res = await request(app).get('/locations');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /locations/:id with invalid id should return 400', async () => {
    const res = await request(app).get('/locations/not-a-valid-id');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message.toLowerCase()).toContain('invalid');
  });

  it('GET /locations/:id with a real id should return 200 or 404', async () => {
    const allRes = await request(app).get('/locations');

    expect(allRes.statusCode).toBe(200);
    expect(Array.isArray(allRes.body)).toBe(true);

    if (allRes.body.length === 0) {      
      return;
    }

    const id = allRes.body[0]._id;
    const res = await request(app).get(`/locations/${id}`);

    expect([200, 404]).toContain(res.statusCode);
  });
});

const mongoose = require('mongoose');

afterAll(async () => {
  await mongoose.connection.close();
});

