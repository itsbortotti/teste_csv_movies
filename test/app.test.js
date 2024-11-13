const request = require('supertest');
const { app, db } = require('../SERVER.JS');

describe('GET /awards/intervals', () => {
    beforeAll((done) => {
        db.serialize(() => {
            db.run("INSERT INTO awards (title, year, producer, winner) VALUES ('Test Movie 1', 2000, 'Producer 1', 1)");
            db.run("INSERT INTO awards (title, year, producer, winner) VALUES ('Test Movie 2', 2005, 'Producer 1', 1)");
            db.run("INSERT INTO awards (title, year, producer, winner) VALUES ('Test Movie 3', 2008, 'Producer 2', 1)");
            db.run("INSERT INTO awards (title, year, producer, winner) VALUES ('Test Movie 4', 2009, 'Producer 2', 1)", done);
        });
    });

    afterAll(() => {
        db.close();
    });

    it('should return producers with max and min award intervals', async () => {
        const res = await request(app).get('/awards/intervals');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('min');
        expect(res.body).toHaveProperty('max');
    });
});