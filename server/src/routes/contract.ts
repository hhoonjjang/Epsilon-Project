import express, { Router, Express, Response, Request } from 'express';
import { CopyObjectCommand, UploadPartCopyOutputFilterSensitiveLog } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { AbiItem } from 'web3-utils';
import axios from 'axios';
import cron from 'cron';
import dotenv from 'dotenv';
import Web3 from 'web3';

import { abi as HutTokenAbi } from '../../build/contracts/HutToken.json';
import { abi as VendorAbi } from '../../build/contracts/Vendor.json';
import { abi as StakingNFTAbi } from '../../build/contracts/StakingNFT.json';
import { abi as WinenwinTokenAbi } from '../../build/contracts/WinenwinToken.json';
import { abi as CrowdSaleAbi } from '../../build/contracts/CrowdSale.json';
import BN from 'bn.js';

import { Stake, StakeValue, Transaction } from '../schemas';
import { Amount } from '../schemas';
import { IAmount } from '../interfaces';

console.log(process.cwd());

// const web3 = new Web3('http://ganache.test.errorcode.help:8545');
const web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/9yZ5AeWjx0MEbEKMFb1e7KEP72skHxkT');

const router = Router();
dotenv.config();

interface IObject {
    to: string | undefined;
    from: string | undefined;
    data: string | undefined;
    value?: BN | undefined;
}

router.post('/invest', async (req, res) => {
    const deployedC = new web3.eth.Contract(CrowdSaleAbi as AbiItem[], process.env.CrowdSale_CA);
    console.log(req.body);
    const swapAmount = web3.utils.toWei(req.body.amount.toString());
    const sendMaticObj: IObject = { to: '', from: '', data: '', value: swapAmount };
    sendMaticObj.to = process.env.CrowdSale_CA;
    sendMaticObj.from = req.body.account;
    res.send({ sendMaticObj });
});

router.post('/staking', async (req, res) => {
    const deployedS = new web3.eth.Contract(StakingNFTAbi as AbiItem[], process.env.NFTStaking_CA);
    const deployedN = new web3.eth.Contract(WinenwinTokenAbi as AbiItem[], process.env.WinenwinToken_CA);
    const price = (req.body.price * req.body.duration * req.body.amount).toString(); //req.body.value
    const reward = web3.utils.toWei(price);
    const approve = await deployedN.methods.setApprovalForAll(process.env.NFTStaking_CA, true).encodeABI();
    const approveObj: IObject = { to: '', from: '', data: '' };
    approveObj.to = process.env.WinenwinToken_CA;
    approveObj.from = req.body.account;
    approveObj.data = approve;
    const stake = await deployedS.methods
        .staking(req.body.tokenId, req.body.amount, req.body.duration, reward)
        .encodeABI();
    const stakeObj: IObject = { to: '', from: '', data: '' };
    stakeObj.to = process.env.NFTStaking_CA;
    stakeObj.from = req.body.account;
    stakeObj.data = stake;
    console.log('시험');
    res.send({ approveObj, stakeObj });
});

router.post('/batchStaking', async (req, res) => {
    const deployedS = new web3.eth.Contract(StakingNFTAbi as AbiItem[], process.env.NFTStaking_CA);
    const deployedN = new web3.eth.Contract(WinenwinTokenAbi as AbiItem[], process.env.WinenwinToken_CA);
    const approve = await deployedN.methods.setApprovalForAll(process.env.NFTStaking_CA, true).encodeABI();
    const approveObj: IObject = { to: '', from: '', data: '' };
    approveObj.to = process.env.WinenwinToken_CA;
    approveObj.from = req.body.account;
    approveObj.data = approve;
    let rewards: string[] = [];
    for (let i = 0; i < req.body.price.length; i++) {
        let price: number = req.body.price[i] * req.body.duration[i] * req.body.amount[i];
        let reward = web3.utils.toWei(price.toString());
        rewards.push(reward);
    }
    console.log(rewards);
    //현재는 duration을 sol에서 하나만 받아서 고정으로 넣어뒀고 추후에 배열로 수정해서 deploy할 예정.
    const batchStake = await deployedS.methods
        .stakingBatch2(req.body.tokenId, req.body.amount, req.body.duration, rewards)
        .encodeABI();
    const stakeBatchObj: IObject = { to: '', from: '', data: '' };
    stakeBatchObj.to = process.env.NFTStaking_CA;
    stakeBatchObj.from = req.body.account;
    stakeBatchObj.data = batchStake;
    console.log('시험');
    res.send({ approveObj, stakeBatchObj });
});

//배치클레임
router.post('/batchClaim', async (req, res) => {
    const deployedS = new web3.eth.Contract(StakingNFTAbi as AbiItem[], process.env.NFTStaking_CA);
    const deployedN = new web3.eth.Contract(WinenwinTokenAbi as AbiItem[], process.env.WinenwinToken_CA);
    const approve = await deployedN.methods.setApprovalForAll(process.env.NFTStaking_CA, true).encodeABI();
    const approveObj: IObject = { to: '', from: '', data: '' };
    approveObj.to = process.env.WinenwinToken_CA;
    approveObj.from = req.body.account;
    approveObj.data = approve;
    const batchClaim = await deployedS.methods.batchClaim2(req.body.account).encodeABI();
    const batchClaimObj: IObject = { to: '', from: '', data: '' };
    batchClaimObj.to = process.env.NFTStaking_CA;
    batchClaimObj.from = req.body.account;
    batchClaimObj.data = batchClaim;
    res.send({ approveObj, batchClaimObj });
});

router.post('/claim', async (req, res) => {
    const deployedS = new web3.eth.Contract(StakingNFTAbi as AbiItem[], process.env.NFTStaking_CA);
    const claim = await deployedS.methods.claimReward(req.body.tokenId, req.body.startTime).encodeABI();
    // const claim = await deployedS.methods.claimReward(req.body.tokenId, 1682481111).encodeABI();
    const claimObj: IObject = { to: '', from: '', data: '' };
    claimObj.to = process.env.NFTStaking_CA;
    claimObj.from = req.body.account;
    claimObj.data = claim;
    res.send({ claimObj });
});

router.post('/unStake', async (req, res) => {
    const deployedS = new web3.eth.Contract(StakingNFTAbi as AbiItem[], process.env.NFTStaking_CA);
    const unStake = await deployedS.methods.unStaking(req.body.tokenId, req.body.startTime).encodeABI();
    const unStakeObj: IObject = { to: '', from: '', data: '' };
    unStakeObj.to = process.env.NFTStaking_CA;
    unStakeObj.from = req.body.account;
    unStakeObj.data = unStake;
    res.send({ unStakeObj });
});

// 밴더 HUT 토큰 발행
router.post('/mintVendor', async (req, res) => {
    const deployedH = new web3.eth.Contract(HutTokenAbi as AbiItem[], process.env.HutToken_CA);
    const amount = web3.utils.toWei(req.body.amount.toString());
    const mint = await deployedH.methods.minting(process.env.Vendor_CA, amount).encodeABI();
    const mintObj: IObject = { to: '', from: '', data: '' };
    mintObj.to = process.env.HutToken_CA;
    mintObj.from = req.body.account;
    mintObj.data = mint;
    console.log(mintObj);
    res.send(mintObj);
});
router.post('/mintStaking', async (req, res) => {
    const deployedH = new web3.eth.Contract(HutTokenAbi as AbiItem[], process.env.HutToken_CA);
    const amount = web3.utils.toWei(req.body.amount.toString());
    const mint = await deployedH.methods.minting(process.env.NFTStaking_CA, amount).encodeABI();
    const mintObj: IObject = { to: '', from: '', data: '' };
    mintObj.to = process.env.HutToken_CA;
    mintObj.from = req.body.account;
    mintObj.data = mint;
    console.log(mintObj);
    res.send(mintObj);
});

router.post('/mintICO', async (req, res) => {
    const deployedH = new web3.eth.Contract(HutTokenAbi as AbiItem[], process.env.HutToken_CA);
    const amount = web3.utils.toWei(req.body.amount.toString());
    const mint = await deployedH.methods.minting(process.env.CrowdSale_CA, amount).encodeABI();
    const mintObj: IObject = { to: '', from: '', data: '' };
    mintObj.to = process.env.HutToken_CA;
    mintObj.from = req.body.account;
    mintObj.data = mint;
    console.log(mintObj);
    res.send(mintObj);
});

router.post('/burn', async (req, res) => {
    console.log(req.body);
    const deployedH = new web3.eth.Contract(HutTokenAbi as AbiItem[], process.env.HutToken_CA);
    const amount = web3.utils.toWei(req.body.amount.toString());
    const burn = await deployedH.methods.burning(process.env.Vendor_CA, amount).encodeABI();
    const burnObj: IObject = { to: '', from: '', data: '' };
    burnObj.to = process.env.HutToken_CA;
    burnObj.from = req.body.account;
    burnObj.data = burn;
    res.send(burnObj);
});

router.post('/withdrawMatic', async (req, res) => {
    console.log(req.body);
    const deployedV = new web3.eth.Contract(VendorAbi as AbiItem[], process.env.Vendor_CA);
    const amount = web3.utils.toWei(req.body.amount.toString());
    console.log(amount);
    console.log(deployedV.methods);
    const withdraw = await deployedV.methods.withdrawEther(amount).encodeABI();
    console.log('해위');
    const withdrawObj: IObject = { to: '', from: '', data: '' };
    withdrawObj.to = process.env.Vendor_CA;
    withdrawObj.from = req.body.account;
    withdrawObj.data = withdraw;
    res.send(withdrawObj);
});

router.post('/withdrawHutToken', async (req, res) => {
    console.log(req.body);
    const deployedV = new web3.eth.Contract(VendorAbi as AbiItem[], process.env.Vendor_CA);
    const amount = web3.utils.toWei(req.body.amount.toString());
    console.log(amount);
    console.log(deployedV.methods);
    const withdraw = await deployedV.methods.withdrawHutToken(amount).encodeABI();
    console.log('해위');
    const withdrawObj: IObject = { to: '', from: '', data: '' };
    withdrawObj.to = process.env.Vendor_CA;
    withdrawObj.from = req.body.account;
    withdrawObj.data = withdraw;
    res.send(withdrawObj);
});

router.post('/setFeeRate', async (req, res) => {
    console.log(req.body);
    const deployedV = new web3.eth.Contract(VendorAbi as AbiItem[], process.env.Vendor_CA);
    console.log(deployedV);
    //rate는 1~100 트랜잭션을 위해 account당연히 받아야하고.
    const feeRate = await deployedV.methods.setFeeRate(req.body.rate).encodeABI();
    const feeRateObj: IObject = { to: '', from: '', data: '' };
    feeRateObj.to = process.env.Vendor_CA;
    feeRateObj.from = req.body.account;
    feeRateObj.data = feeRate;
    res.send(feeRateObj);
});

router.post('/swap', async (req, res) => {
    const deployedV = new web3.eth.Contract(VendorAbi as AbiItem[], process.env.Vendor_CA);
    const swapAmount = web3.utils.toWei(req.body.amount.toString());
    if (req.body.from == 'matic') {
        console.log(req.body.rate);
        const buy = await deployedV.methods.buyTokens(req.body.rate).encodeABI();
        const buyObj: IObject = {
            to: '',
            from: '',
            data: '',
            value: swapAmount,
        };
        buyObj.to = process.env.Vendor_CA;
        buyObj.from = req.body.account;
        buyObj.data = buy;
        res.send({ buyObj });
    } else if (req.body.from == 'HUT') {
        console.log(req.body.rate);
        const deployedH = new web3.eth.Contract(HutTokenAbi as AbiItem[], process.env.HutToken_CA);
        const approve = await deployedH.methods.approve(process.env.Vendor_CA, swapAmount).encodeABI();
        const approveObj: IObject = {
            to: '',
            from: '',
            data: '',
        };
        approveObj.to = process.env.HutToken_CA;
        approveObj.from = req.body.account;
        approveObj.data = approve;
        const sell = deployedV.methods.sellTokens(swapAmount, req.body.rate).encodeABI();
        const sellObj: IObject = {
            to: '',
            from: '',
            data: '',
        };
        sellObj.to = process.env.Vendor_CA;
        sellObj.from = req.body.account;
        sellObj.data = sell;
        res.send({ approveObj, sellObj });
    }
});

router.post('/getBalance', async (req, res) => {
    const account = req.body.account;
    const deployedH = new web3.eth.Contract(HutTokenAbi as AbiItem[], process.env.HutToken_CA);
    const maticWei = await web3.eth.getBalance(account);
    const hutWei = await deployedH.methods.balanceOf(account).call();
    const matic = web3.utils.fromWei(maticWei);
    const hut = web3.utils.fromWei(hutWei);

    res.send({ MATIC: matic, HUT: hut });
});

router.post('/IcoUserDisplay', async (req, res) => {
    const deployedC = new web3.eth.Contract(CrowdSaleAbi as AbiItem[], process.env.CrowdSale_CA);
    const targetAmountToWei = await deployedC.methods.getFundingGoal().call();
    const targetAmount = web3.utils.fromWei(targetAmountToWei);
    const nowAmountToWei = await deployedC.methods.getNowAmountRasied().call();
    const nowAmount = web3.utils.fromWei(nowAmountToWei);
    //getNowAmountRaised 오타 나중에 수정할것.
    const deadLine = await deployedC.methods.getDeadLine().call();
    res.send({ targetAmount, nowAmount, deadLine });
});

router.post('/IcoAdminDisplay', async (req, res) => {
    const deployedC = new web3.eth.Contract(CrowdSaleAbi as AbiItem[], process.env.CrowdSale_CA);
    const targetAmountToWei = await deployedC.methods.getFundingGoal().call();
    const targetAmount = web3.utils.fromWei(targetAmountToWei);
    const nowAmountToWei = await deployedC.methods.getNowAmountRasied().call();
    const nowAmount = web3.utils.fromWei(nowAmountToWei);
    const hutAmountToWei = await deployedC.methods.getHutToken().call();
    const hutAmount = web3.utils.fromWei(hutAmountToWei);
    const investors = await deployedC.methods.getFundersCount().call();
    res.send({ targetAmount, nowAmount, hutAmount, investors });
});

router.post('/reachedGoal', async (req, res) => {
    const deployedC = new web3.eth.Contract(CrowdSaleAbi as AbiItem[], process.env.CrowdSale_CA);
    const goal = await deployedC.methods.checkGoalReached().encodeABI();
    const goalObj: IObject = { to: '', from: '', data: '' };
    goalObj.to = process.env.CrowdSale_CA;
    goalObj.from = req.body.account;
    goalObj.data = goal;
    res.send(goalObj);
});

router.post('/adminSwapDisplay', async (req, res) => {
    const deployedH = new web3.eth.Contract(HutTokenAbi as AbiItem[], process.env.HutToken_CA);
    const deployedV = new web3.eth.Contract(VendorAbi as AbiItem[], process.env.Vendor_CA);
    const totalSupplyHutToWei = await deployedH.methods.checkSupply().call();
    const totalSupplyHut = web3.utils.fromWei(totalSupplyHutToWei);
    const vendorHutAmountWei = await deployedV.methods.getHutToken().call();
    const vendorHutAmount = web3.utils.fromWei(vendorHutAmountWei);
    const vendorMaticAmountWei = await deployedV.methods.getBalance().call();
    const vendorMaticAmount = web3.utils.fromWei(vendorMaticAmountWei);
    res.send({ totalSupplyHut, vendorHutAmount, vendorMaticAmount });
});

router.post('/adminSteakDisplay', async (req, res) => {
    const deployedS = new web3.eth.Contract(StakingNFTAbi as AbiItem[], process.env.NFTStaking_CA);
    const totalSteak = await deployedS.methods.getTokenListLength().call();
    const totalRewardsWei = await deployedS.methods.getTotalRewards().call();
    const totalRewards = web3.utils.fromWei(totalRewardsWei);
    const VendorHutWei = await deployedS.methods.getHutToken().call();
    const VendorHut = web3.utils.fromWei(VendorHutWei);
    res.send({ totalSteak, totalRewards, VendorHut });
});

router.post('/userSteakDisplay', async (req, res) => {
    console.log('계정1');
    console.log(req.body.account);
    console.log('계정2');
    const deployedS = new web3.eth.Contract(StakingNFTAbi as AbiItem[], process.env.NFTStaking_CA);
    const earnedRewardWei = await deployedS.methods.getBatchReward(req.body.account).call();
    console.log('해위1');
    console.log(earnedRewardWei);
    console.log('해위3');
    const earnedReward = web3.utils.fromWei(earnedRewardWei);
    const claimsAmount = await deployedS.methods.getBatchRewardLength(req.body.account).call();
    console.log('하3');
    console.log(claimsAmount);
    console.log('하3');
    const claimAble = await deployedS.methods.getBatchClaimList(req.body.account).call();
    console.log(claimAble);
    const tokenId: string[] = [];
    const startAt: string[] = [];
    for (let i = 0; i < claimAble.length / 2; i++) {
        tokenId.push(claimAble[2 * i]);
        startAt.push(claimAble[2 * i + 1]);
    }

    let claimAbleData: Array<Object> = [];

    for (let i = 0; i < tokenId.length; i++) {
        const stakeNFT = await Stake.findOne({ tokenId: tokenId[i], blockTime: startAt[i] });
        const reward = stakeNFT?.reward;
        const amount = stakeNFT?.amount;
        claimAbleData.push({ reward, amount, tokenId: tokenId[i], startTime: startAt[i] });
    }

    res.send({ earnedReward, claimsAmount, claimAble, claimAbleData });
});

export default router;
