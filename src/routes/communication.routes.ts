import express, { Router } from 'express';
import {
  vendorSend,
  deliveryReceipt,
} from '../controllers/communication.controller';

const router = Router();

router.post('/vendor/send', vendorSend);
router.post('/delivery-receipt', deliveryReceipt);

export default router;
