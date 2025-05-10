import { Router } from 'express';
import { saveCampaign } from '../controllers/campaign.controller';

const router = Router();

router.post('/', saveCampaign);

export default router;
