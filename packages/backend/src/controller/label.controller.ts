import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { Label } from '../entity/label';

/**
 * get all labels
 * if error return 404 not found
 * @param _
 * @param res
 */
export const getLabels = async (_: Request, res: Response) => {
  try {
    const labelRepo = await getRepository(Label);
    const labels = await labelRepo.find();
    res.send({
      data: labels,
    });
  } catch (e) {
    res.status(404).send({ status: e });
  }
};

/**
 * get a single label by given id
 * return 404 if label not found
 * @param req
 * @param res
 */
export const getSingleLabelById = async (req: Request, res: Response) => {
  const labelId: number = +req.params.labelId;
  const labelRepository: Repository<Label> = getRepository(Label);
  try {
    const label: Label = await labelRepository.findOneOrFail(labelId);
    res.send({
      data: label,
    });
  } catch (error) {
    res.status(404).send({ status: 'not_found' });
  }
};

/**
 * create a new label with given name
 * if name is Null or already exist, return bad request 400
 * if error return 404
 * @param req
 * @param res
 */
// @ts-ignore
export const createLabel = async (req: Request, res: Response) => {
  const { name } = req.body;
  const label = new Label();
  label.name = name;
  try {
    const labelRepo = await getRepository(Label);
    const existingLabel = await labelRepo.findOne({
      where: { name },
    });
    if (existingLabel || name === '') {
      return res.status(400).send({ status: 'bad_request already exist' });
    }
    const createdLabel = await labelRepo.save(label);
    res.send({
      data: createdLabel,
    });
  } catch (error) {
    res.status(404).send({ status: error });
  }
};
/**
 * delete a label with given id
 * return 404 not found if label is not found
 * @param req
 * @param res
 */
export const deleteLabel = async (req: Request, res: Response) => {
  const labelId: number = +req.params.labelId;
  const labelRepository: Repository<Label> = getRepository(Label);
  try {
    const label: Label = await labelRepository.findOneOrFail(labelId);
    await labelRepository.remove(label);
    res.send({ status: 'oke' });
  } catch (error) {
    res.status(404).send({ status: 'not_found' });
  }
};
/**
 * update a label with given id
 * return 400 if new name already exist or is null
 * return 404 if given id is not found
 * @param req
 * @param res
 */
// @ts-ignore
export const updateLabel = async (req: Request, res: Response) => {
  const labelId: number = +req.params.labelId;
  const { name } = req.body;

  const labelRepository: Repository<Label> = getRepository(Label);
  try {
    const labels = await labelRepository.find();
    if (labels.some((addedLabel: Label) => addedLabel.name === name) || name === '') {
      return res.status(400).send({ status: 'bad_request already exist' });
    }
    let label: Label = await labelRepository.findOneOrFail(labelId);
    label.name = name;
    label = await labelRepository.save(label);
    res.send({ status: 'ok', data: label });
  } catch (error) {
    res.status(404).send({ status: 'not_found' });
  }
};
