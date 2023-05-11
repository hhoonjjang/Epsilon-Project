import { useEffect, useState, ChangeEvent, DragEventHandler } from 'react';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { SHA256 } from 'crypto-js';

interface imgList {
    Key: string;
    LastModified: string;
    ETag: string;
    Owner: { ID: string };
    Size: Number;
    StorageClass: string;
}

// const UserPage = ({ login, profileImg }: any) => {
const UserPage = () => {
    const [userImg, setUserImg] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const router = useRouter();

    const [curUrl, setCurUrl] = useState('');
    const [curImgFormData, setCurImgFormData] = useState<FormData | undefined>();
    const [selectedUrl, setSelectedUrl] = useState<string | ArrayBuffer | null>();

    useEffect(() => {}, [curImgFormData]);

    // 미리보기기띄우기
    const handleFile = (_file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedUrl(reader.result);
        };
        reader.readAsDataURL(_file);
    };

    // 드래그 앤 드롭
    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        try {
            let formData = new FormData();
            const file = e.dataTransfer.files[0];

            formData.append('image', file);

            setCurImgFormData(formData);
            handleFile(file);
        } catch (err) {}
    };

    // 파일 선택
    const setImageFormData = (e: ChangeEvent<HTMLInputElement>) => {
        let formData = new FormData();
        const file = e.target.files?.[0];
        if (file) {
            formData.append('image', file);

            setCurImgFormData(formData);
            handleFile(file);
        }
    };

    // 프로필 이미지 변경 시 실행
    const requestImage = async () => {
        if (!curImgFormData) return;
        try {
            const { data: url } = await axios.post('http://13.125.251.97:8080/api/user/profileSrc', curImgFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setCurUrl(url);
        } catch (err) {}
    };

    useEffect(() => {
        if (typeof router.query.userId == 'string') {
            setUserId(router.query.userId);
        }
    }, [router]);

    // useEffect(() => {
    //     // console.log(login, profileImg);
    // }, [login, profileImg]);

    return (
        <UserBox>
            <div>userId : {userId}</div>
            <div>UserImage</div>
            <div>
                <img src={userImg} alt="유저 이미지" />
            </div>
            <div id="imageEdit">
                <input
                    type={'file'}
                    id={'image_uploads'}
                    name="image"
                    accept="image/*"
                    onChange={(e) => {
                        setImageFormData(e);
                    }}
                />
                <DropZone
                    onDrop={(e) => {
                        handleDrop(e);
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }}
                >
                    {selectedUrl ? <img src={selectedUrl?.toString()} /> : <></>}
                </DropZone>
                <button
                    className="nftrio-button ac-pink"
                    onClick={() => {
                        // 요청 보내는 부분
                        requestImage();
                    }}
                >
                    파일 보냄
                </button>
                {/* 요청 받아서 여기에 출력 */}
                <img src={curUrl} />
            </div>
        </UserBox>
    );
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async () => {
    // 로그인 쿠키 요청
    const { data: login } = await axios.post('http://13.125.251.97:8080/api/user/login', {
        id: '1',
        pw: '1234',
        pw2: SHA256('12345'),
    });
    // 해당 유저의 이미지 주소 요청
    // const { data: profileImg } = await axios.post('http://13.125.251.97:8080/api/user/profileSrc', {
    //     id: '1',
    // });
    // 폼데이터로 이미지 파일 보내기
    // const ...

    return {
        // props: { login, profileImg },
        props: { login },
    };
};

const UserBox = styled.div`
    width: 100%;
`;

const DropZone = styled.div`
    width: 200px;
    height: 100px;
    background-color: var(--grey);
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        object-fit: contain;
        height: 100%;
        width: 100%;
    }
`;
