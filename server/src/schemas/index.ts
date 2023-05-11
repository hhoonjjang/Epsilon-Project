import mongoose from 'mongoose';
import Transaction from './transaction';
import Amount from './amount';
import Management from './management';

const connect = async (EPSILON_DATABASE_IP: string) => {
    const dbUrl =
        `mongodb://${EPSILON_DATABASE_IP}:27027/epsilon` ||
        'mongodb://3.34.215.52:27017/epsilon' ||
        'mongodb://127.0.0.1:27017/epsilon'; // admin
    console.log(dbUrl);
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }

    try {
        await mongoose.connect(dbUrl, {
            dbName: 'epsilon',
            autoIndex: true,
        });

        const management = await Management.findOne({});
        if (!management) {
            const createdManagement = await Management.create({});
            console.log(createdManagement);
        }

        // Amount 업데이트
        async function updateAmount() {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000);
            const oneDayTransactions = await Transaction.find({ createdAt: { $gte: oneDayAgo } }); // 생성일이 24시간 이내인 트랜잭션 조회

            const dayAmountNum = oneDayTransactions.reduce((acc, curr) => {
                if (typeof curr.amount !== 'undefined') {
                    acc += curr.amount;
                }
                return acc;
            }, 0);

            // 최근 6시간 이내에 등록된 Amount가 없거나 새로운 amount가 있으면 추가
            const recentAmount = await Amount.findOne({
                createdAt: { $gte: new Date(Date.now() - 6 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000) },
            }).sort({ createdAt: -1 });
            if (!recentAmount || recentAmount.amount !== dayAmountNum) {
                if (isNaN(dayAmountNum)) return;
                const createdAmount = await Amount.create({ amount: dayAmountNum });
                console.log(createdAmount);
            } else {
                console.log('Skip saving: latest amount already exists.');
            }
        }
        updateAmount(); // 서버 시작 시
        setInterval(updateAmount, 3 * 60 * 60 * 2000); // 3시간 마다
    } catch (err) {
        console.log('MongoDB connection failed', err);
    }

    console.log(`${dbUrl} is connected`);
};

export { default as Amount } from './amount';
export { default as Board } from './board';
export { default as Comment } from './comment';
export { default as Nft } from './nft';
export { default as Sale } from './sale';
export { default as Stake } from './stake';
export { default as StakeValue } from './stakeValue';
export { default as Transaction } from './transaction';
export { default as User } from './user';
export { default as Management } from './management';
export default connect;
