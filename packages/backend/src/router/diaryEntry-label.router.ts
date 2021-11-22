import { Router } from 'express';
import {
  addLabelToDiaryEntry,
  deleteLabelFromDiaryEntry,
  getDiaryEntriesByLabel,
} from '../controller/diaryEntry-label.controller';

export const diaryEntryLabelRouter = Router({ mergeParams: true });

diaryEntryLabelRouter.post('/:diaryId', addLabelToDiaryEntry);
diaryEntryLabelRouter.get('/', getDiaryEntriesByLabel);
diaryEntryLabelRouter.delete('/:diaryId', deleteLabelFromDiaryEntry);
