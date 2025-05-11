import { Router } from 'express';
import {
  getAllSegments,
  previewAudience,
  saveSegment,
} from '../controllers/segment.controller';

const router = Router();

router.post('/', saveSegment);
router.post('/previewAudience', previewAudience);
router.get('/allSegments', getAllSegments);

export default router;
