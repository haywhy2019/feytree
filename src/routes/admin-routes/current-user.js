import express from 'express';
import jwt from 'jsonwebtoken';
import { isAdmin } from '../../middlewares/admin';

const router = express.Router();

router.get('/api/admin/currentuser', isAdmin, (req, res) => {
  res.send({ currentuser: req.currentUser || null });
});

export { router as currentAdminRouter };
