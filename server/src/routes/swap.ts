// /api/swap
import express from 'express';
import retry from 'retry';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import BN from 'bn.js';

import { abi as HutTokenAbi } from '../../build/contracts/HutToken.json';
import { abi as VendorAbi } from '../../build/contracts/Vendor.json';

import { getQuotes, getConversion, calculatePercentageDifference, roundNumber, createTokenConversion } from '../utils';
import { Amount, Transaction } from '../schemas/index';

const web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/9yZ5AeWjx0MEbEKMFb1e7KEP72skHxkT');

const router = express.Router();

interface ConversionQuery {
    from: string;
    to: string;
    amount: number;
}

interface IObject {
    to: string | undefined;
    from: string | undefined;
    data: string | undefined;
    value?: BN | undefined;
}

router.get('/exchange', async (req, res) => {
    const operation = retry.operation({ retries: 3 });

    const query = req.query as Partial<ConversionQuery>;
    const { from, to, amount } = query;
    let fromHUT: string;
    let toHUT: string;
    let fromUSD: number;
    let toUSD: number;
    let conversion: number;
    let percent: number;

    let charge: number;
    process.env.SWAP_CHARGE ? (charge = parseFloat(process.env.SWAP_CHARGE)) : (charge = 1);

    let tokenExchange: Object;

    if (from == 'HUT') fromHUT = 'KLAY';
    if (to == 'HUT') toHUT = 'KLAY';

    if (typeof from !== 'string' || typeof to !== 'string' || typeof amount !== 'string') {
        return res.status(400).send('Invalid query parameters');
    }

    operation.attempt(async () => {
        try {
            fromUSD = fromHUT ? await getQuotes(fromHUT, amount) : await getQuotes(from, amount);

            if (fromHUT) {
                conversion = roundNumber(
                    (await getConversion({ from: fromHUT, to, amount }))[`${to.toUpperCase()}`].price * charge,
                    6
                );
                tokenExchange = await createTokenConversion(fromHUT, to);
            } else if (toHUT) {
                conversion = roundNumber(
                    (await getConversion({ from, to: toHUT, amount }))[`${toHUT}`].price * charge,
                    6
                );
                tokenExchange = await createTokenConversion(from, toHUT);
            } else {
                conversion = roundNumber(
                    (await getConversion({ from, to, amount }))[`${to.toUpperCase()}`].price * charge,
                    6
                );
                tokenExchange = await createTokenConversion(from, to);
            }
            toUSD = toHUT ? await getQuotes(toHUT, conversion) : await getQuotes(to, conversion);
            percent = calculatePercentageDifference(fromUSD, toUSD);

            console.log(`fromUSD : ${fromUSD}, conversion : ${conversion}, toUSD : ${toUSD}, percent : ${percent}`);
            console.log('tokenExchange : ');
            console.log(tokenExchange);
            res.send({ fromUSD, conversion, toUSD, percent, tokenExchange });
        } catch (err) {
            console.log(err);

            if (operation.retry(err as Error)) {
                return;
            }
            res.status(500).send('Error occurred');
        }
    });
});

router.post('/save', async (req, res) => {
    const { transactionHash: hash, from, to, status, amount, type } = req.body;
    const curStatus = status ? 'Success' : 'Failed';
    try {
        const createdTransaction = await Transaction.create({
            hash,
            from,
            to,
            status: curStatus,
            amount,
            type,
        });
        res.send(createdTransaction);
    } catch (error) {
        console.error(error);
    }

    res.end();
});

// Account와 관련된 Swap 트랜잭션 목록 출력
router.get('/transactionList', async (req, res) => {
    const { account } = req.query;
    const transactions = await Transaction.find({
        $or: [{ from: account }, { to: account }],
    });
    res.send(transactions);
});

// 가장 최근의 amount earned
router.get('/amountEarned', async (req, res) => {
    try {
        const amounts = await Amount.find().sort({ createdAt: -1 }).limit(2);
        console.log('amounts', amounts);

        const latestAmount = amounts[0]?.amount || 0;
        const secondLatestAmount = amounts[1]?.amount || 0;

        const difference = roundNumber(
            roundNumber(((latestAmount - secondLatestAmount) / secondLatestAmount) * 100, 2) || 0,
            2
        );
        const amount = roundNumber(latestAmount || secondLatestAmount || 0, 2);
        const usd = await getQuotes('KLAY', amount);

        res.send({
            amount,
            difference,
            usd,
        });
    } catch (error) {
        console.error(error);
        res.end();
    }
});

export default router;
