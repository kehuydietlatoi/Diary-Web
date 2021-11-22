import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();
import 'jest';
import request from 'supertest';
import { Helper } from '../helper';
import { DiaryEntry } from '../../src/entity/DiaryEntry';
import { Label } from '../../src/entity/label';

// hooray, 96% code coverage
describe('diaryEntry', () => {
  const helper = new Helper();

  beforeAll(async () => {
    await helper.init();
  });

  afterAll(async () => {
    await helper.shutdown();
  });

  // create test
  it('should be able to create a new diary entry without date value', async (done) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    await helper.resetDatabase();
    request(helper.app)
      .post('/api/diary')
      .send({
        name: 'diary name for testing',
        text: '1st text',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.name).toBe('diary name for testing');
        expect(res.body.data.text).toBe('1st text');
        expect(Number(res.body.data.date.toString().slice(0, 4))).toBe(Number(yyyy));
        expect(Number(res.body.data.date.toString().slice(5, 7))).toBe(Number(mm));
        expect(Number(res.body.data.date.toString().slice(8, 10))).toBe(Number(dd));
        done();
      });
  });

  it('should be able to create a new diary entry with date value', async (done) => {
    await helper.resetDatabase();
    request(helper.app)
      .post('/api/diary')
      .send({
        date: '2021-10-10',
        name: 'test2',
        text: ' text',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.name).toBe('test2');
        expect(res.body.data.text).toBe(' text');
        expect(res.body.data.date).toBe('2021-10-10T00:00:00.000Z');
        done();
      });
  });

  it('should not be able to create a new diary entry with wrong date value format', async (done) => {
    await helper.resetDatabase();
    request(helper.app)
      .post('/api/diary')
      .send({
        date: '2021dd10-10',
        name: 'test3',
        text: ' text',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('bad request');
        done();
      });
  });

  it('should not be able (return 400 badrequest) to create a new diary entry with empty text or name', async (done) => {
    await helper.resetDatabase();
    request(helper.app)
      .post('/api/diary')
      .send({
        date: '2021-10-10',
        name: '',
        text: '',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('bad request');
        done();
      });
  });

  it('should be able to create a new diary entry with 2 labels', async (done) => {
    await helper.resetDatabase();
    request(helper.app)
      .post('/api/diary')
      .send({
        labels: [{ name: 'test label1' }, { name: 'test label2' }],
        name: 'test4',
        text: '1st text',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.name).toBe('test4');
        expect(res.body.data.text).toBe('1st text');
        expect(res.body.data.labels[0].name).toBe('test label1');
        expect(res.body.data.labels[1].name).toBe('test label2');
        done();
      });
  });

  // get test
  it('should be able to get all diary entries', async (done) => {
    await helper.resetDatabase();
    const diary1 = new DiaryEntry();
    diary1.name = 'test1';
    diary1.text = 'text1';
    const diary2 = new DiaryEntry();
    diary2.name = 'test2';
    diary2.text = 'text2';
    const savedDiary1 = await helper.getRepo(DiaryEntry).save(diary1);
    const savedDiary2 = await helper.getRepo(DiaryEntry).save(diary2);
    request(helper.app)
      .get('/api/diary')
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

  it('should be able to get diary entry by id', async (done) => {
    await helper.resetDatabase();
    const diary1 = new DiaryEntry();
    diary1.name = 'test1';
    diary1.text = 'text1';
    const savedDiary1 = await helper.getRepo(DiaryEntry).save(diary1);
    const savedDiaryId = savedDiary1.id;
    request(helper.app)
      .get(`/api/diary/${savedDiaryId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe(savedDiary1.name);
        expect(res.body.data.id).toBe(savedDiaryId);
        done();
      });
  });

  it('should be able to throw error when get diary entry by wrong id', async (done) => {
    await helper.resetDatabase();
    request(helper.app)
      .get(`/api/diary/2`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404)
      .end(async (err, res) => {
        if (err) throw err;
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('not_found');
        done();
      });
  });

  it('should be able to get all labels of a diary entry by id', async (done) => {
    await helper.resetDatabase();
    const diary1 = new DiaryEntry();
    diary1.name = 'test1';
    diary1.text = 'text1';
    const label1 = new Label();
    label1.name = 'new label 1';
    const label2 = new Label();
    label2.name = 'new label 2';
    diary1.labels = [label1, label2];
    const savedDiary1 = await helper.getRepo(DiaryEntry).save(diary1);
    const savedDiaryId = savedDiary1.id;
    request(helper.app)
      .get(`/api/diary/${savedDiaryId}/label`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data[0].name).toBe('new label 1');
        expect(res.body.data[1].name).toBe('new label 2');
        done();
      });
  });

  // delete test
  it('should be able to delete a diary entry by id', async (done) => {
    await helper.resetDatabase();
    const diary1 = new DiaryEntry();
    diary1.name = 'test1';
    diary1.text = 'to be delete text';
    const savedDiary1 = await helper.getRepo(DiaryEntry).save(diary1);
    const savedDiaryId = savedDiary1.id;
    request(helper.app)
      .delete(`/api/diary/${savedDiaryId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end(async (err) => {
        if (err) throw err;
        const [, transactionCount] = await helper.getRepo(DiaryEntry).findAndCount();
        expect(transactionCount).toBe(0);
        done();
      });
  });

  it('should be able to return 404 error when delete a diary entry by wrong id', async (done) => {
    await helper.resetDatabase();
    request(helper.app)
      .delete(`/api/diary/2`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404)
      .end(async (err, res) => {
        if (err) throw err;
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('not_found');
        done();
      });
  });

  it('should be able to update a diary entry', async (done) => {
    await helper.resetDatabase();
    const diary1 = new DiaryEntry();
    diary1.name = 'test1';
    diary1.text = 'to be delete text';
    const savedDiary1 = await helper.getRepo(DiaryEntry).save(diary1);
    const savedDiaryId = savedDiary1.id;
    request(helper.app)
      .patch(`/api/diary/${savedDiaryId}`)
      .send({
        name: 'new name',
        text: 'new text',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end(async (err, res) => {
        if (err) throw err;
        expect(res.body.data.name).toBe('new name');
        expect(res.body.data.text).toBe('new text');
        done();
      });
  });

  it('should be able to return 404 error when update a diary entry by wrong id', async (done) => {
    await helper.resetDatabase();
    request(helper.app)
      .patch(`/api/diary/2`)
      .send({
        name: 'new name',
        text: 'new text',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404)
      .end(async (err, res) => {
        if (err) throw err;
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('not_found');
        done();
      });
  });

  it('should be able to return 404 error when get labels of a diary entry by wrong id', async (done) => {
    await helper.resetDatabase();
    request(helper.app)
      .get(`/api/diary/2/label`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404)
      .end(async (err, res) => {
        if (err) throw err;
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('not_found');
        done();
      });
  });

  it('should be able to export a diary entry in csv type ', async (done) => {
    await helper.resetDatabase();
    const diary1 = new DiaryEntry();
    diary1.name = 'test1';
    diary1.text = 'text';
    const label1 = new Label();
    label1.name = 'new label 1';
    const label2 = new Label();
    label2.name = 'new label 2';
    diary1.labels = [label1, label2];
    const savedDiary1 = await helper.getRepo(DiaryEntry).save(diary1);
    request(helper.app)
      .get('/api/diary/csv')
      .set('Content-Type', 'text/csv; charset=utf-8')
      .set('Accept', 'text/csv')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        // remove all spaces cause i have problem with extra space at beginning of received response
        expect(res.text.replace(/\s+/g, '')).toBe(
          'id,name,text,date,createdAt,updatedAt,labels1,"test1","text",' +
            `"${savedDiary1.date.toISOString()}","${new Date(savedDiary1.createdAt).toISOString()}","${new Date(
              savedDiary1.updatedAt,
            ).toISOString()}",{#newlabel1#newlabel2}`,
        );
        done();
      });
  });
});
