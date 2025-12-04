// Caleb Beardall
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Event = require('../models/event');

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
    await Event.deleteMany();
});

describe("GET /events", () => {
    test("returns empty array initially", async () => {
        const res = await request(app).get("/events");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test("returns a list of events", async () => {
        const event = await Event.create({
            title: "Test Event",
            description: "A test event",
            location: "Test Location",
            date: new Date(),
            time: "10:00 AM",
            createdBy: "tester",
            category: "Social"
        });

        const res = await request(app).get("/events");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]._id).toBe(event.id);
        expect(res.body[0].title).toBe("Test Event");
    });
});

describe("GET /events/:id", () => {
    test("returns a single event", async () => {
        const event = await Event.create({
            title: "Get One",
            description: "Description",
            location: "Location",
            date: new Date(),
            time: "2:00 PM",
            createdBy: "tester",
            category: "Social"
        });

        const res = await request(app).get(`/events/${event.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("Get One");
    });

    test("returns 404 if event missing", async () => {
        const badId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/events/${badId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Event not found");
    });
});