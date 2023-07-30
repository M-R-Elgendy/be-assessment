import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { getReportByCheckId, getReportByTagName, getAllReports } from '../controllers/report.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllReports);
router.get('/:uuid', getReportByCheckId);
router.get('/tag/:tagStr', getReportByTagName);

export default router;