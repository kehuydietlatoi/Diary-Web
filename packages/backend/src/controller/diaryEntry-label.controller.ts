import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { DiaryEntry } from '../entity/DiaryEntry';
import { Label } from '../entity/label';

/**
 * get all diary entries with given label id
 * we get all diary entries and filter it with some function
 * @param req
 * @param res
 */
export const getDiaryEntriesByLabel = async (req: Request, res: Response) => {
  const labelId: number = +req.params.labelId;
  try {
    const diaryEntryRepository: Repository<DiaryEntry> = await getRepository(DiaryEntry);
    const diaryEntries = await diaryEntryRepository.find();
    const result = diaryEntries.filter((diaryEntry) =>
      diaryEntry.labels.some((addedLabel: Label) => addedLabel.id === labelId),
    );
    res.send({
      data: result,
    });
  } catch (e) {
    res.status(404).send({ status: 'not_found' });
  }
};

/**
 * delete a given label by id from a diary etry by id
 * return 404 if diary is not found
 * return 400 if label does not belong to this diary entry
 * @param req
 * @param res
 */
// @ts-ignore
export const deleteLabelFromDiaryEntry = async (req: Request, res: Response) => {
  const diaryId: number = +req.params.diaryId;
  const labelId: number = +req.params.labelId;
  const diaryEntryRepository: Repository<DiaryEntry> = await getRepository(DiaryEntry);
  try {
    let diaryEntry: DiaryEntry = await diaryEntryRepository.findOneOrFail(diaryId);
    if (!diaryEntry.labels.some((addedLabel: Label) => addedLabel.id === labelId)) {
      return res.status(400).send({ status: 'bad_request' });
    }
    diaryEntry.labels = diaryEntry.labels.filter((item) => item.id !== labelId);
    diaryEntry = await diaryEntryRepository.save(diaryEntry);
    res.send({
      data: diaryEntry,
    });
  } catch (e) {
    res.status(404).send({ status: 'not_found' });
  }
};

/**
 * add a given label by id to diary entry by id
 * return 404 not found if ids are wrong
 * @param req
 * @param res
 */
export const addLabelToDiaryEntry = async (req: Request, res: Response) => {
  const diaryId: number = +req.params.diaryId;
  const labelId: number = +req.params.labelId;

  const diaryEntryRepository: Repository<DiaryEntry> = await getRepository(DiaryEntry);
  const labelRepository: Repository<Label> = await getRepository(Label);

  try {
    const label: Label = await labelRepository.findOneOrFail(labelId);
    let diaryEntry: DiaryEntry = await diaryEntryRepository.findOneOrFail(diaryId);

    if (!diaryEntry.labels.some((addedLabel: Label) => addedLabel.id === labelId)) {
      diaryEntry.labels.push(label);
      diaryEntry = await diaryEntryRepository.save(diaryEntry);
    }
    res.send({
      data: diaryEntry,
    });
  } catch (e) {
    res.status(404).send({ status: 'not_found' });
  }
};
