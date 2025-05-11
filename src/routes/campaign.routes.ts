import { Router } from 'express';
import {
  getAllCampaigns,
  saveCampaign,
} from '../controllers/campaign.controller';

const router = Router();

router.post('/', saveCampaign);
router.get('/allCampaign', getAllCampaigns);

export default router;
