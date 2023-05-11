// /api/staking
import express from 'express';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import { Stake, StakeValue, Transaction } from '../schemas';
import { abi as StakingNFTAbi } from '../../build/contracts/StakingNFT.json';
import mongoose from 'mongoose';
import { roundNumber } from '../utils';
const { ObjectId } = mongoose.Types;

const router = express.Router();
const web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/9yZ5AeWjx0MEbEKMFb1e7KEP72skHxkT');

router.post('/save', async (req, res) => {
    try {
        const { from, to, transactionHash, amount, account, objectId, stakePrice, duration } = req.body;
        const deployedS = new web3.eth.Contract(StakingNFTAbi as AbiItem[], process.env.NFTStaking_CA);
        const blockLength = await deployedS.methods.getTokenListLength().call();
        const createdTransaction = await Transaction.create({
            amount: amount,
            type: 'Stake',
            status: 'Success',
            from,
            to,
            hash: transactionHash,
        });
        const blockTime = await deployedS.methods.getStakeTime(blockLength).call();
        const deadline = await deployedS.methods.getDeadline(blockLength).call();
        const curObjectId = new ObjectId(objectId);
        const { _id: stakeValueId } = (await StakeValue.findOne({ nftId: curObjectId }))?._id;
        const tokenId = (await StakeValue.findOne({ nftId: curObjectId }))?.tokenId;

        // const reward = amount * (stakePrice ? stakePrice : 10 * (duration / 100)); // 리워드 계산 다시
        const reward = ((stakePrice * amount) / 100) * duration;

        const createdStake = await Stake.create({
            expiredAt: deadline,
            stakeValueId, // tokenId & name
            reward: roundNumber(reward, 6), // 계산 하여 집어넣기
            amount,
            blockTime,
            duration,
            account,
            tokenId,
        });

        res.status(200).send({ createdTransaction, createdStake });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/claimSave', async (req, res) => {
    try {
        const { from, to, transactionHash, claimStakeId } = req.body;

        const stake = await Stake.findOne({ _id: claimStakeId });
        const reward = Object(stake)?.reward;

        const createdTransaction = await Transaction.create({
            amount: reward ? reward : 1,
            type: 'Claim',
            status: 'Success',
            from,
            to,
            hash: transactionHash,
        });

        const deletedStake = await Stake.deleteOne({ _id: claimStakeId });

        res.status(200).send({ createdTransaction, deletedStake });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/unStakeSave', async (req, res) => {
    try {
        const { from, to, transactionHash, unStakeStakeId } = req.body;

        const stakeId = (await Stake.findOne({ _id: unStakeStakeId }))?._id;

        const createdTransaction = await Transaction.create({
            amount: 0,
            type: 'Unstake',
            status: 'Success',
            from,
            to,
            hash: transactionHash,
        });

        const deletedStake = await Stake.deleteOne({ _id: stakeId });

        res.status(200).send({ createdTransaction, deletedStake });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// BatchStake
router.post('/batchStakeSave', async (req, res) => {
    try {
        const { transaction, stakeList } = req.body;
        const { from, to, transactionHash: hash } = transaction;
        const { account, tokenId, price, duration, amount } = stakeList;
        const deployedS = new web3.eth.Contract(StakingNFTAbi as AbiItem[], process.env.NFTStaking_CA);

        // transaction 저장
        const createdTx = await Transaction.create({
            amount: 0,
            type: 'StakeBatch',
            status: 'Success',
            from,
            to,
            hash,
        });
        console.log(createdTx);

        // stake 저장 (for)
        let createdStakes = [];
        for (let i = 0; i < tokenId.length; i++) {
            const blockLength = await deployedS.methods.getTokenListLength().call();
            const blockTime = await deployedS.methods.getStakeTime(blockLength).call();
            const deadline = await deployedS.methods.getDeadline(blockLength - tokenId.length + i + 1).call();

            const reward = ((price[i] * amount[i]) / 100) * duration[i];

            const { _id: stakeValueId } = (await StakeValue.findOne({ tokenId: tokenId[i] }))?._id;
            const createdStake = await Stake.create({
                expiredAt: deadline,
                stakeValueId, // tokenId[0]를 통한 stakeValue 계산
                reward: roundNumber(reward, 6),
                amount: amount[i],
                blockTime,
                account,
                tokenId: tokenId[i],
            });
            console.log(i, createdStake);
            createdStakes.push(createdStake);
        }

        console.log({ createdTx, createdStakes });
        res.send({ createdTx, createdStakes });
    } catch (error) {
        console.error(error);
        res.send(error);
    }
});

router.post('/batchClaimSave', async (req, res) => {
    try {
        console.log('요기에요', req.body);
        const { account, transaction, stakeList } = req.body;
        const { from, to, transactionHash: hash } = transaction;

        // allClaim transaction save
        const createdTx = await Transaction.create({
            amount: 0,
            type: 'ClaimBatch',
            status: 'Success',
            from,
            to,
            hash,
        });
        console.log('createdTx', createdTx);

        // stake schema delete
        for (let i = 0; i < stakeList.length; i++) {
            const deletedStake = await Stake.deleteOne({
                account,
                tokenId: stakeList[i].tokenId,
                blockTime: stakeList[i].startTime,
            });
            console.log(`${i + 1}번째 친구가 삭제됨`, deletedStake);
        }

        res.send(req.body);
    } catch (error) {
        console.log(error);
        res.end();
    }
});

export default router;
