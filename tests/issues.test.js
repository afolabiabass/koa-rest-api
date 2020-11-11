'use strict';

const app = require('../index');
const supertest = require("supertest");
const request = supertest(app);
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFmb2xhYmlAdGVzdGxpby5jb20iLCJpYXQiOjE2MDUxMDk4MTV9.cozvHVL0YBOnjaVoJ9Q4827L7vVzehzn975YQ7q6dE0';

describe('Issue Application Tests', () => {
  it('Should return Status 200', (done) => {
    request
      .get('/health')
      .end((error, response) => {
        if (error) {}
        expect(response.status).toBe(200);
        done()
      })
  })

  it('Route Not Found', (done) => {
    request
      .get('/random')
      .end((error, response) => {
        if (error) {}
        expect(response.status).toBe(404);
        done()
      })
  })

  it('Should Login',  (done) => {
    request
      .post('/login')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'afolabi@testlio.com',
        password: 'secret',
      })
      .end((error, response) => {
        if (error) {}
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        done()
      })
  })

  it('Should Not Create With Authorization',  (done) => {
    request
      .post('/issues')
      .send({
        title: 'New Issue',
        description: 'Please fix bug',
      })
      .end((error, response) => {
        if (error) {}
        expect(response.status).toBe(401);
        done()
      })
  })

  it('Should Create Issue',  (done) => {
    request
      .post('/issues')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Issue',
        description: 'Please fix bug',
      })
      .end((error, response) => {
        if (error) {}
        expect(response.status).toBe(200);
        expect(response.body.issue.title).toBe('New Issue');
        done()
      })
  })

  it('Should List All Issues', (done) => {
    request
      .get('/issues')
      .end((error, response) => {
        if (error) {}
        expect(response.status).toBe(200);
        expect(response.body.issues.length).toBeGreaterThanOrEqual(1);
        done()
      })
  })

  it('Should Return Issue', (done) => {
    request
      .get('/issues/1')
      .end((error, response) => {
        if (error) {}
        expect(response.status).toBe(200);
        expect(response.body.issue).toBeDefined();
        done()
      })
  })

  it('Should Return List of Issue\'s Revisions', (done) => {
    request
      .get('/issues/1/revisions')
      .end((error, response) => {
        if (error) {}
        expect(response.status).toBe(200);
        expect(response.body.issue.revisions.length).toBeGreaterThanOrEqual(1);
        done()
      })
  })

  it('Should Not Update With Authorization',  (done) => {
    request
      .put('/issues/1')
      .send({
        title: 'Updated Issue',
      })
      .end((error, response) => {
        if (error) {}
        expect(response.status).toBe(401);
        done()
      })
  })

  it('Should Update Issue',  (done) => {
    request
      .put('/issues/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Update Issue',
      })
      .end((error, response) => {
        if (error) {}
        expect(response.status).toBe(200);
        expect(response.body.issue.title).toBe('Update Issue');
        done()
      })
  })
})
