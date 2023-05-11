import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import aws from 'aws-sdk';
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import pinataSDK from '@pinata/sdk';

import path from 'path';
import fs from 'fs';
import routes from './routes/index';
import connect from './schemas/index';

const app: Express = express();

dotenv.config();

const REGION = 'ap-northeast-2';
const bucketName = 'nfstart-bucket';
const bucketParams = { Bucket: bucketName };

const s3 = new aws.S3({
    region: REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const s3Admin = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
});

// 서버에 이미 있는 파일을 임의의 이름으로 S3에 업로드 (_fileName: S3상의 저장위치, )
const uploadFile = (_fileName: string, _fileDir: string) => {
    const fileContent = fs.readFileSync(_fileDir);
    const params = {
        Bucket: bucketName,
        Key: _fileName,
        Body: fileContent,
    };
    s3.upload(params, function (err: Error, data: aws.S3.ManagedUpload.SendData) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};
// uploadFile('다되는지 확인.gif', './src/미소가.gif'); // 저장 확인 완료

// s3의 이미지 오브젝트 주소 반환
const getObject = (_image: string) => {
    const url = s3.endpoint.protocol + `//${bucketName}.` + s3.endpoint.host + '/' + _image;
    return url;
};
// console.log(getObject('다되는지 확인.gif')); // Promise 객체 주소 반환 확인

// s3의 이미지 오브젝트 리스트 반환 (모든 객체 리스트를 반환함)
const getObjectList = async () => {
    try {
        const data = await s3Admin.send(new ListObjectsCommand(bucketParams));
        console.log('Success');

        const urlList: Array<string> = [];

        data.Contents?.map((item: any) => {
            if (item.Key) urlList.push(getObject(item.Key));
        });
        console.log(urlList);

        return urlList;
    } catch (err) {
        console.log('Error', err);
    }
};
// getObjectList();

// multer S3에 업로드
const upload = multer({
    storage: multerS3({
        s3: s3Admin,
        bucket: bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req: Request, file: Express.Multer.File, cb: (error: Error | null, key: string) => void) => {
            const newFileName = (file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8'));
            cb(null, `${newFileName}`);
        },
    }),
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

export const uploadNormal = multer({ storage: storage });
// console.log('asdfasdfasdf', uploadNormal);

app.set('port', process.env.PORT || 8080);

app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://13.125.251.97:3000/',
            'http://13.124.93.106:3000',
            'http://www.efforthye.com:3000',
            'http://13.125.251.97:3000',
        ],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'secret'));
app.use('/', express.static(path.join(__dirname, 'build'))); //

app.use((req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV == 'production') {
        morgan('combined')(req, res, next);
    } else {
        morgan('dev')(req, res, next);
    }
});
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
        },
        secret: String(process.env.COOKIE_SECRET),
        name: 'session',
    })
);

app.use('/api', routes);

app.listen(app.get('port'), async () => {
    await connect(process.env.EPSILON_DATABASE_IP || '127.0.0.1');
    console.log(`${app.get('port')} port server open`);
});
