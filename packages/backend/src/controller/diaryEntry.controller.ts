import { Request, Response } from 'express';
import { EntityManager, getConnection, getRepository, QueryRunner, Repository } from 'typeorm';
import { DiaryEntry } from '../entity/DiaryEntry';
import { Label } from '../entity/label';
import { validate } from 'class-validator';

/**
 * get all diary entries
 * @param _
 * @param res
 */
export const getDiaryEntries = async (_: Request, res: Response) => {
  try {
    const diaryEntryRepo = await getRepository(DiaryEntry);
    const diaryEntries = await diaryEntryRepo.find();
    res.send({
      data: diaryEntries,
    });
  } catch (e) {
    res.status(404).send({ status: e });
  }
};

/**
 * function convert diary entries json to csv data
 * @param diaries
 */
function convertToCsv(diaries: any) {
  const fields = Object.keys(diaries[0]);
  // tslint:disable-next-line:variable-name
  const replacer = (_key: string, value: any) => {
    return value === null ? '' : value;
  };
  const csv: string[] = diaries.map((row: any) => {
    return fields
      .map((fieldName) => {
        if (fieldName === 'labels') {
          let res: string = '{';
          // @ts-ignore
          // each label name start with a #, labels are in {}
          row[fieldName].map((i) => {
            // tslint:disable-next-line:prefer-template
            res += '#' + i.name;
          });
          res += '}';
          return res;
        }
        // @ts-ignore
        return JSON.stringify(row[fieldName], replacer);
      })
      .join(',');
  });
  csv.unshift(fields.join(',')); // add header column
  return csv.join('\r\n');
}

/**
 * export all diary entries as csv data
 * convert all json obj from diary entries to csv data
 * send csv data via response
 * @param _
 * @param res
 */
export const exportDiaryAsCsvData = async (_: Request, res: Response) => {
  try {
    const diaryEntryRepo = await getRepository(DiaryEntry);
    const diaryEntries = await diaryEntryRepo.find();
    const resultCsv = convertToCsv(diaryEntries);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.send(resultCsv);
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: 'Exporting error' });
  }
};

/**
 * get single diary entry by id
 * return 404 if diary entry not found
 * @param req
 * @param res
 */
export const getSingleDiaryEntryById = async (req: Request, res: Response) => {
  try {
    const diaryId: number = +req.params.diaryId;
    const diaryEntryRepo: Repository<DiaryEntry> = getRepository(DiaryEntry);
    const diary: DiaryEntry = await diaryEntryRepo.findOneOrFail(diaryId);
    res.send({
      data: diary,
    });
  } catch (error) {
    res.status(404).send({ status: 'not_found' });
  }
};

/**
 * const function check if a given label name existed in in db
 * if yes create a new label, save to entity manager then return it
 * other wise return existing label
 * @param labelName
 * @param manager
 */
const checkExisting = async (labelName: string, manager: EntityManager) => {
  const existingLabel = await manager.getRepository(Label).findOne({
    where: { name: labelName },
  });
  const newLabel = new Label();
  newLabel.name = labelName;
  return existingLabel || manager.save(newLabel);
};

/**
 * find all typed label, if label not exist create a new one
 * @param typedLabel
 * @param queryRunner
 */
async function createOrFindAllTypedLabel(typedLabel: string[], queryRunner: QueryRunner) {
  const promiseLabels = await Promise.all(
    typedLabel.reduce<Promise<Label | undefined>[]>((prev, label) => {
      prev.push(checkExisting(label, queryRunner.manager));
      return prev;
    }, []),
  );
  return promiseLabels.filter((i) => i !== undefined) as Label[];
}

/**
 * create a diary entry , if date is null then a default value will be initialized
 * return 500 if error happened
 * @param req
 * @param res
 */
// @ts-ignore
export const createDiaryEntry = async (req: Request, res: Response) => {
  const { name, text, date, labels } = req.body;
  const diaryEntry = new DiaryEntry();
  // @ts-ignore
  let dbLabels: Label[] = [];
  diaryEntry.labels = [];
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    // assume that space is also a "valid" name or text
    // return 400 bad request for following case
    if (name === '' || text === '' || !name || !text) {
      return res.status(400).send({ status: 'bad request' });
    }
    if (labels) {
      const typedLabel: string[] = labels.map((i: any) => i.name);
      dbLabels = await createOrFindAllTypedLabel(typedLabel, queryRunner);
    }

    diaryEntry.name = name;
    diaryEntry.date = new Date(date);
    diaryEntry.text = text;
    if (date != null) {
      const error = await validate(diaryEntry);
      if (error.length > 0) {
        return res.status(400).send({ status: 'bad request' });
      }
    }

    const diaryEntryRepo = await getRepository(DiaryEntry);
    const createdDiaries = await diaryEntryRepo.save(diaryEntry);
    // example code not work for me
    await queryRunner.commitTransaction();
    let createdNew = await diaryEntryRepo.findOneOrFail(createdDiaries.id);
    createdNew.labels = dbLabels;
    createdNew = await diaryEntryRepo.save(createdNew);

    res.send({
      data: createdNew,
    });
  } catch (e) {
    await queryRunner.rollbackTransaction();
    res.status(500).send(JSON.stringify(e));
  } finally {
    await queryRunner.release();
  }
};

/**
 * delete a diary entry with given id
 * return 404 not found if no diary with given id is found
 * @param req
 * @param res
 */
export const deleteDiaryEntry = async (req: Request, res: Response) => {
  const diaryEntryId: number = +req.params.diaryId;
  const diaryRepository: Repository<DiaryEntry> = getRepository(DiaryEntry);
  try {
    const diaryEntry: DiaryEntry = await diaryRepository.findOneOrFail(diaryEntryId);
    await diaryRepository.remove(diaryEntry);
    res.send({ status: 'oke' });
  } catch (error) {
    res.status(404).send({ status: 'not_found' });
  }
};

/**
 * get all labels of a diary entry with id
 * return 404 not found if no diary entry with given id is found
 * @param req
 * @param res
 */
export const getAllLabelsByDiaryId = async (req: Request, res: Response) => {
  const diaryId: number = +req.params.diaryId;
  const diaryEntryRepository: Repository<DiaryEntry> = getRepository(DiaryEntry);
  try {
    const diaryEntry: DiaryEntry = await diaryEntryRepository.findOneOrFail(diaryId);
    const labels: Label[] = diaryEntry.labels;
    res.send({
      data: labels,
    });
  } catch (error) {
    res.status(404).send({ status: 'not_found' });
  }
};

/**
 * update a diary entry
 * return 404 not found if no diary entry with given id is found
 * @param req
 * @param res
 */
// @ts-ignore
export const updateDiaryEntry = async (req: Request, res: Response) => {
  const diaryId: number = +req.params.diaryId;
  const { name, text, date, labels } = req.body;
  let dbLabels: Label[] = [];
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.startTransaction();

  const diaryEntryRepository = await getRepository(DiaryEntry);

  try {
    let diaryEntry: DiaryEntry = await diaryEntryRepository.findOneOrFail(diaryId);
    if (name === '' || text === '' || !name || !text) {
      return res.status(400).send({ status: 'bad request' });
    }
    if (labels) {
      const typedLabel: string[] = labels.map((i: any) => i.name);
      dbLabels = await createOrFindAllTypedLabel(typedLabel, queryRunner);
      diaryEntry.labels = dbLabels;
    }
    diaryEntry.name = name;
    diaryEntry.text = text;
    diaryEntry.date = date;
    await queryRunner.commitTransaction();
    diaryEntry = await diaryEntryRepository.save(diaryEntry);
    res.send({ status: 'ok', data: diaryEntry });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    res.status(404).send({ status: 'not_found' });
  } finally {
    await queryRunner.release();
  }
};
