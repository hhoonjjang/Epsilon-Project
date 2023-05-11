export default interface IStake {
    expiredAt: Date;
    createdAt: Date;
    nftObjectId: number;
    reward: number;
    amount: number;
}
