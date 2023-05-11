// /api
import express from 'express';

import user from './user';
import comment from './comment';
import contract from './contract';
import nft from './nft';
import swap from './swap';
import staking from './staking';
import admin from './admin';

const router = express.Router();

router.use('/user', user);
router.use('/comment', comment);
router.use('/contract', contract);
router.use('/nft', nft);
router.use('/swap', swap);
router.use('/staking', staking);
router.use('/admin', admin);

export default router;
