import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();
import 'jest';
import request from 'supertest';
import { Helper } from '../helper';
import { DiaryEntry } from '../../src/entity/DiaryEntry';
import { Label } from '../../src/entity/label';

describe('diaryEntry-label', () => {
  const helper = new Helper();

  beforeAll(async () => {
    await helper.init();
  });

  afterAll(async () => {
    await helper.shutdown();
  });

  it('should be able to get all diary entries by label', async (done) => {
    await helper.resetDatabase();
    const diary1 = new DiaryEntry();
    diary1.name = 'test1';
    diary1.text = 'text1';
    const diary2 = new DiaryEntry();
    diary2.name = 'test2';
    diary2.text = 'text2';
    const label1 = new Label();
    label1.name = 'new label 1';
    const savedLabel = await helper.getRepo(Label).save(label1);
    diary1.labels = [label1];
    diary2.labels = [label1];
    const savedDiary1 = await helper.getRepo(DiaryEntry).save(diary1);
    const savedDiary2 = await helper.getRepo(DiaryEntry).save(diary2);

    request(helper.app)
      .get(`/api/label/${savedLabel.id}/diary`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data[0].name).toBe(savedDiary1.name);
        expect(res.body.data[1].name).toBe(savedDiary2.name);
        done();
      });
  });

  it('should be able to delete label from diary entry', async (done) => {
    await helper.resetDatabase();
    const diary1 = new DiaryEntry();
    diary1.name = 'test1';
    diary1.text = 'test1 text';
    const label1 = new Label();
    label1.name = 'new label 1';
    const savedLabel = await helper.getRepo(Label).save(label1);
    diary1.labels = [label1];
    const savedDiary1 = await helper.getRepo(DiaryEntry).save(diary1);

    request(helper.app)
      .delete(`/api/label/${savedLabel.id}/diary/${savedDiary1.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.labels.length).toBe(0);
        done();
      });
  });

  it('should not be able to delete a non bound label from diary entry', async (done) => {
    await helper.resetDatabase();
    const diary1 = new DiaryEntry();
    diary1.name = 'test1';
    diary1.text = 'text1';
    const savedDiary1 = await helper.getRepo(DiaryEntry).save(diary1);
    const label2 = new Label();
    label2.name = 'new label 2';
    const savedLabel2 = await helper.getRepo(Label).save(label2);

    request(helper.app)
      .delete(`/api/label/${savedLabel2.id}/diary/${savedDiary1.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.status).toBe('bad_request');
        done();
      });
  });

  it('should not be able to delete a label from non existing diary entry', async (done) => {
    await helper.resetDatabase();
    const diary1 = new DiaryEntry();
    diary1.name = 'test1';
    diary1.text = 'test1 text';
    const label1 = new Label();
    label1.name = 'new label 1';
    // @ts-ignore
    const savedLabel = await helper.getRepo(Label).save(label1);
    diary1.labels = [label1];
    const savedDiary1 = await helper.getRepo(DiaryEntry).save(diary1);

    request(helper.app)
      .delete(`/api/label/${savedLabel.id}/diary/${savedDiary1.id + 1}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.status).toBe('not_found');
        done();
      });
  });
  it('should be able to add a label to diary entry', async (done) => {
    await helper.resetDatabase();
    const diary1 = new DiaryEntry();
    diary1.name = 'test1';
    diary1.text = 'test1 text';
    const label1 = new Label();
    label1.name = 'new label 1';
    // @ts-ignore
    const savedLabel = await helper.getRepo(Label).save(label1);
    const savedDiary1 = await helper.getRepo(DiaryEntry).save(diary1);

    request(helper.app)
      .post(`/api/label/${savedLabel.id}/diary/${savedDiary1.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.labels[0].name).toBe(savedLabel.name);
        done();
      });
  });
  it('should not be able to add a label to a wrong diary entry', async (done) => {
    await helper.resetDatabase();
    const diary1 = new DiaryEntry();
    diary1.name = 'test1';
    diary1.text = 'test1 text';
    const label1 = new Label();
    label1.name = 'new label 1';
    // @ts-ignore
    const savedLabel = await helper.getRepo(Label).save(label1);
    const savedDiary1 = await helper.getRepo(DiaryEntry).save(diary1);

    request(helper.app)
      .post(`/api/label/${savedLabel.id}/diary/${savedDiary1.id + 1}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.status).toBe('not_found');
        done();
      });
  });
});
