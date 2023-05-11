import mongoose, { Model, Schema, Types } from 'mongoose';
import { IUser } from '../interfaces';

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        default: '', // 기본 이미지 설정
    },
    account: {
        type: String,
        required: false, // 회원 가입 방식에 따라 달라짐
        trim: true,
        unique: true,
    },
    level: {
        type: Number,
        default: 1,
    },
    score: {
        type: Number,
        default: 0,
    },
    nfts: [
        {
            type: Types.ObjectId,
            ref: 'Nft',
        },
    ],
    likeContents: [
        {
            contentType: {
                type: String,
                enum: ['Board', 'Nft', 'Comment'],
            },
            contentId: {
                type: Types.ObjectId,
                refPath: 'likeContents.contentType',
            },
        },
    ],
    // boards: { type: [Object], default: [] },
    boards: [
        {
            _id: Types.ObjectId,
        },
    ],
    comments: [
        {
            _id: Types.ObjectId,
        },
    ],
    blockList: {
        type: [String],
    },
    searchHistory: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: new Date(Date.now() + 9 * 60 * 60 * 1000),
    },
    updatedAt: {
        type: Date,
        default: new Date(Date.now() + 9 * 60 * 60 * 1000),
    },
    approve: {
        type: Boolean,
        default: false,
    },
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

const addUser = async (name: string, age: number, email: string) => {
    const newUser = new User({ name, age, email });
    const result = await newUser.save();
    console.log('addUser 실행');
    console.log(result);
};

const findAllUsers = async () => {
    const users = await User.find({});
    console.log('findAllUsers 실행');
    console.log(users);
};

const findUserByName = async (name: string) => {
    const user = await User.findOne({ name });
    console.log('findUserByName 실행');
    console.log(user);
};

const updateUser = async (name: string, update: object) => {
    const result = await User.updateOne({ name }, update);
    console.log('updateUser 실행');
    console.log(`Updated ${result.modifiedCount} user`);
};

const deleteUser = async (name: string) => {
    const result = await User.deleteOne({ name });
    console.log('deleteUser 실행');
    console.log(`Deleted ${result.deletedCount} user`);
};

export default User;
