import { Router } from 'express';
import {
  previewAudience,
  saveSegment,
} from '../controllers/segment.controller';

const router = Router();

router.post('/', saveSegment);
router.post('/previewAudience', previewAudience);

export default router;
