// /api/admin
import express from 'express';

import { Management, Stake, StakeValue, Transaction } from '../schemas/index';

const router = express.Router();

// 토큰 발행 트랜잭션 목록 조회
router.get('/transactionList', async (req, res) => {
    try {
        const transactions = await Transaction.find({ type: 'Token' });
        res.send(transactions);
    } catch (err) {
        console.log(err);
        res.status(500).send('데이터베이스 오류 발생');
    }
});

// 유저 트랜잭션 목록 조회
router.get('/userTransactionList', async (req, res) => {
    try {
        const transactions = await Transaction.find({ type: { $ne: 'Token' } })
            .sort({ createdAt: -1 })
            .exec();
        res.send(transactions);
    } catch (err) {
        console.log(err);
        res.status(500).send('데이터베이스 오류 발생');
    }
});

// HUT 토큰 발행 및 삭제 트랜잭션 정보를 데이터베이스에 저장
router.post('/tokenSave', async (req, res) => {
    const { amount, saveType } = req.body;

    const createdTransaction = await Transaction.create({
        ...req.body,
        amount: saveType == 'mint' ? amount : amount * -1,
    });
    res.send(createdTransaction);
});

// staking nft 목록
router.get('/stakingList', async (req, res) => {
    try {
        const stakeValues = await StakeValue.find({}).populate('nftId');
        if (!stakeValues.length) return res.send(stakeValues);
        const stake = await Stake.find({ stakeValueId: stakeValues[0]?._id });
        res.send([...stakeValues, stake]);
    } catch (error) {
        console.log(error);
        res.end();
    }
});

// StakeValue 수정
router.post('/updateStakePrice', async (req, res) => {
    try {
        const { id, price } = req.body;
        const result = await StakeValue.updateOne({ _id: id }, { price });
        res.send(result);
    } catch (error) {
        console.log(error);
    }
});

router.get('/duration', async (req, res) => {
    try {
        console.log('요청 들어옴');
        // 여기, Management scheme에서 가져오기
        const management = (await Management.findOne({}))?.durationAndCharge;
        console.log(management, '난 매니지먼트 데이터임');
        res.send(management);
    } catch (error) {
        console.log(error);
        res.end();
    }
});
router.get('/durationOnly', async (req, res) => {
    try {
        let durationOnlyArr: number[] = [];
        console.log('요청 들어옴');
        // 여기, Management scheme에서 가져오기
        const management = (await Management.findOne({}))?.durationAndCharge;
        management?.map((item) => {
            durationOnlyArr.push(item.duration);
        });
        console.log(durationOnlyArr, '나는 정돈된 데이터임');
        res.send(durationOnlyArr);
    } catch (error) {
        console.log(error);
        res.end();
    }
});

router.post('/updateDurationAndCharge', async (req, res) => {
    try {
        const { stakeDurationList } = req.body;

        const updatedManagement = await Management.updateOne({}, { durationAndCharge: stakeDurationList });
        console.log('updatedManagement', updatedManagement);

        res.send(req.body);
    } catch (error) {
        console.log(error);
        res.end();
    }
});

export default router;
