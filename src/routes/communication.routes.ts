import express, { Router } from 'express';
import {
  vendorSend,
  deliveryReceipt,
  getCustomersFromCampaign,
} from '../controllers/communication.controller';


const router = Router();

router.post('/vendor/send', vendorSend);
router.post('/delivery-receipt', deliveryReceipt);
router.get('/:campaignId/logs',getCustomersFromCampaign)

export default router;
