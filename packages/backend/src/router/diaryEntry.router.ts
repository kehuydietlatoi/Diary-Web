import { Router } from 'express';
import {
  getDiaryEntries,
  createDiaryEntry,
  deleteDiaryEntry,
  getSingleDiaryEntryById,
  getAllLabelsByDiaryId,
  updateDiaryEntry,
  exportDiaryAsCsvData,
} from '../controller/diaryEntry.controller';

export const diaryEntryRouter = Router({ mergeParams: true });

diaryEntryRouter.get('/', getDiaryEntries);
diaryEntryRouter.get('/csv', exportDiaryAsCsvData);
diaryEntryRouter.post('/', createDiaryEntry);
diaryEntryRouter.delete('/:diaryId', deleteDiaryEntry);
diaryEntryRouter.get('/:diaryId', getSingleDiaryEntryById);
diaryEntryRouter.get('/:diaryId/label', getAllLabelsByDiaryId);
diaryEntryRouter.patch('/:diaryId', updateDiaryEntry);
