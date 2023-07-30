import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { createCheck, updateCheck, deleteCheck, getAllChecks, getSingleCheck, getCheckByTag } from '../controllers/checks.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllChecks);
router.get('/:uuid', getSingleCheck);
router.get('/tags/:tagStr', getCheckByTag);
router.post('/', createCheck);
router.put('/:uuid', updateCheck);
router.delete('/:uuid', deleteCheck);

export default router;