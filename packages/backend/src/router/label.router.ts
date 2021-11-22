import { Router } from 'express';
import { createLabel, deleteLabel, getLabels, getSingleLabelById, updateLabel } from '../controller/label.controller';
import { diaryEntryLabelRouter } from './diaryEntry-label.router';

export const labelRouter = Router({ mergeParams: true });
labelRouter.use('/:labelId/diary', diaryEntryLabelRouter);

labelRouter.get('/', getLabels);
labelRouter.post('/', createLabel);
labelRouter.delete('/:labelId', deleteLabel);
labelRouter.get('/:labelId', getSingleLabelById);
labelRouter.patch('/:labelId', updateLabel);
