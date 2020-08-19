import express from 'express';

const router = express.Router();

router.post('/api/admin/signout', (req, res) => {
  res.send({});
});

export { router as adminSignoutRouter };
