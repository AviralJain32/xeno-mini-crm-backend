import { Router } from 'express';
import { createCustomer, getAllCustomers } from '../controllers/customer.controller';

const router = Router();

router.post('/', createCustomer);
router.get('/allCustomers', getAllCustomers);

export default router;
