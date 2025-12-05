// Caleb Beardall
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Rsvp = require('../models/rsvp');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "test" });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Rsvp.deleteMany();
});

describe("GET /rsvps", () => {
    test("returns empty array initially", async () => {
        const res = await request(app).get("/rsvps");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test("returns a list of RSVPs", async () => {
        const rsvp = await Rsvp.create({
            userId: "user123",
            eventId: "eventABC",
            status: "Going"
        });

        const res = await request(app).get("/rsvps");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]._id).toBe(rsvp.id);
        expect(res.body[0].status).toBe("Going");
    });
});

describe("GET /rsvps/:id", () => {
    test("returns a single RSVP", async () => {
        const rsvp = await Rsvp.create({
            userId: "user123",
            eventId: "eventABC",
            status: "Undecided"
        });

        const res = await request(app).get(`/rsvps/${rsvp.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("Undecided");
    });

    test("returns 404 if RSVP not found", async () => {
        const badId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/rsvps/${badId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("RSVP not found");
    });
});