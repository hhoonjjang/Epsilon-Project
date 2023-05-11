import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Input from '@/components/Input';
import axios from 'axios';
import styled from 'styled-components';
import PictureImg from '@/components/Picture/PicutreImg';

const Login = () => {
    const tempTime = Date.now();

    var timestamp = new Date().getTime();
    console.log(typeof timestamp, timestamp, '나는 변환 당하는 애임');
    let currentDate = new Date(1683704140);
    console.log(tempTime, '나는 현재 시간이야');
    console.log(typeof currentDate, currentDate, '나는함수에 들어가는 타입');

    function dateFormat(date: Date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        month = month >= 10 ? month : 0 + month;
        day = day >= 10 ? day : 0 + day;
        hour = hour >= 10 ? hour : 0 + hour;
        minute = minute >= 10 ? minute : 0 + minute;
        second = second >= 10 ? second : 0 + second;

        return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    }

    var currentFormatDate = dateFormat(currentDate);
    console.log(currentFormatDate.split(' '), '출력 어케되냐?');

    console.log('https://testcolor99b.s3.us-east-1.amazonaws.com/1683526064324_file'.split('_')[1]);

    return (
        <LoginBox backgroundColor="red">
            <div>
                <p className="winStyle-fontGradient fg-gold ac-orange">WIN</p>
                <p>DEX</p>
            </div>
            <div>
                <div>
                    <div>
                        <input placeholder="아이디" />
                    </div>
                </div>
                <div>
                    <div>
                        <input placeholder="비밀번호" type="password" />
                    </div>
                </div>
            </div>
            <div>로그인</div>
        </LoginBox>
    );
};
interface StyledBoxProps {
    backgroundColor: string;
}

const LoginBox = styled.div<StyledBoxProps>`
    width: fit-content;
    margin: auto;
    background-color: ${(props) => props.backgroundColor};
    & > div:first-child {
        display: flex;
        justify-content: center;
        & > p {
            font-size: 2rem;
            font-weight: 700;
        }
        & > p:nth-child(2) {
            color: var(--middlegrey);
        }
    }
    & > div {
        margin: 10px;
    }
    & > div:nth-child(2) {
        border: 1px solid var(--light);
        & > div {
            display: flex;
            align-items: center;
        }
    }
    input {
        font-weight: 700;
    }
    & > div:nth-child(3) {
        display: flex;
        justify-content: center;
        border: 1px solid var(--grey);
        border-radius: 0.6rem;
        padding: 10px;
    }
`;

export default Login;
