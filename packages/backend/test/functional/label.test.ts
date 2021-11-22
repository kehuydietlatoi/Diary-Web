import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();
import 'jest';
import request from 'supertest';
import { Helper } from '../helper';
import { Label } from '../../src/entity/label';

describe('label', () => {
  const helper = new Helper();

  beforeAll(async () => {
    await helper.init();
  });

  afterAll(async () => {
    await helper.shutdown();
  });

  it('should be able to create new label', async (done) => {
    await helper.resetDatabase();
    request(helper.app)
      .post('/api/label')
      .send({
        name: 'new label',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.name).toBe('new label');
        done();
      });
  });

  it('should not be able to create label with duplicate name', async (done) => {
    await helper.resetDatabase();
    const label = new Label();
    label.name = 'new label';
    // @ts-ignore
    const savedLabel = await helper.getRepo(Label).save(label);
    request(helper.app)
      .post('/api/label')
      .send({
        name: 'new label',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.status).toBe('bad_request already exist');
        done();
      });
  });

  it('should be able to get all labels ', async (done) => {
    await helper.resetDatabase();
    const label = new Label();
    label.name = 'new label';
    // @ts-ignore
    const savedLabel = await helper.getRepo(Label).save(label);
    const label2 = new Label();
    label2.name = 'new label2';
    // @ts-ignore
    const savedLabel2 = await helper.getRepo(Label).save(label2);
    request(helper.app)
      .get('/api/label')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data[0].name).toBe(savedLabel.name);
        expect(res.body.data[1].name).toBe(savedLabel2.name);
        done();
      });
  });

  it('should be able to get  label by id ', async (done) => {
    await helper.resetDatabase();
    const label = new Label();
    label.name = 'new label';
    const savedLabel = await helper.getRepo(Label).save(label);
    const labelId = savedLabel.id;
    request(helper.app)
      .get(`/api/label/${labelId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe(savedLabel.name);
        expect(res.body.data.id).toBe(labelId);
        done();
      });
  });

  it('should be able to throw error when get label by wrong id ', async (done) => {
    await helper.resetDatabase();
    const label = new Label();
    label.name = 'new label';
    const savedLabel = await helper.getRepo(Label).save(label);
    const labelId = savedLabel.id;
    request(helper.app)
      .get(`/api/label/${labelId + 1}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.status).toBe('not_found');
        done();
      });
  });

  it('should be able to delete  label by id ', async (done) => {
    await helper.resetDatabase();
    const label = new Label();
    label.name = 'new label';
    const savedLabel = await helper.getRepo(Label).save(label);
    const labelId = savedLabel.id;
    request(helper.app)
      .delete(`/api/label/${labelId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end(async (err) => {
        if (err) throw err;
        const [, transactionCount] = await helper.getRepo(Label).findAndCount();
        expect(transactionCount).toBe(0);
        done();
      });
  });

  it('should be able to throw error when delete label by wrong id ', async (done) => {
    await helper.resetDatabase();
    const label = new Label();
    label.name = 'new label';
    const savedLabel = await helper.getRepo(Label).save(label);
    const labelId = savedLabel.id;
    request(helper.app)
      .delete(`/api/label/${labelId + 1}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404)
      .end(async (err, res) => {
        if (err) throw err;
        expect(res.body.status).toBe('not_found');
        done();
      });
  });

  it('should be able to throw error when update a label with existed name ', async (done) => {
    await helper.resetDatabase();
    const label = new Label();
    label.name = 'new label';
    const savedLabel = await helper.getRepo(Label).save(label);
    const label2 = new Label();
    label2.name = 'new';
    // @ts-ignore
    const savedLabel2 = await helper.getRepo(Label).save(label2);
    const labelId = savedLabel.id;
    request(helper.app)
      .patch(`/api/label/${labelId}`)
      .send({
        name: 'new',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .end(async (err, res) => {
        if (err) throw err;
        expect(res.body.status).toBe('bad_request already exist');
        done();
      });
  });

  it('should be able to throw error when update a label with wrong id ', async (done) => {
    await helper.resetDatabase();
    const label = new Label();
    label.name = 'new label';
    const savedLabel = await helper.getRepo(Label).save(label);
    const labelId = savedLabel.id;
    request(helper.app)
      .patch(`/api/label/${labelId + 1}`)
      .send({
        name: 'new',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404)
      .end(async (err, res) => {
        if (err) throw err;
        expect(res.body.status).toBe('not_found');
        done();
      });
  });

  it('should be able to  update a label with new name ', async (done) => {
    await helper.resetDatabase();
    const label = new Label();
    label.name = 'new label';
    const savedLabel = await helper.getRepo(Label).save(label);
    const labelId = savedLabel.id;
    request(helper.app)
      .patch(`/api/label/${labelId}`)
      .send({
        name: 'new',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end(async (err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe('new');
        done();
      });
  });
});
