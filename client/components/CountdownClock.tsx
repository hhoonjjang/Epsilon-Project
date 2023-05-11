import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { makePaddedNumber } from '@/module/tools';
const Clock = dynamic(() => import('react-live-clock'), { ssr: false });
import { getDate } from '@/module/tools';

interface IDate {
    day: number;
    hour: number;
    minute: number;
    second: number;
}
interface IUnit {
    unit: string;
    deadLine: number;
}
/**
 * @param _unit:string
 * day: 일, hour: 시간, minute: 분, second: 초
 * @returns unit에 따른 Component반환
 */
const CountdownClock = ({ unit, deadLine }: IUnit) => {
    const [countDate, setCountDate] = useState<IDate>({
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
    });

    const [dayPaper, setDayPaper] = useState<HTMLElement>();
    const [hourPaper, setHourPaper] = useState<HTMLElement>();
    const [minutePaper, setMinutePaper] = useState<HTMLElement>();
    const [secondPaper, setSecondPaper] = useState<HTMLElement>();
    const [dayTop, setDayTop] = useState(countDate.day);
    const [hourTop, setHourTop] = useState(countDate.hour);
    const [minuteTop, setMinuteTop] = useState(countDate.minute);
    const [secondTop, setSecondTop] = useState(countDate.second);

    const daypage2Elem = useRef<HTMLDivElement>(null);
    const hourpage2Elem = useRef<HTMLDivElement>(null);
    const minutepage2Elem = useRef<HTMLDivElement>(null);
    const secondpage2Elem = useRef<HTMLDivElement>(null);

    const setPaperFunction = () => {
        const daypage2 = daypage2Elem.current;
        const hourpage2 = hourpage2Elem.current;
        const minutepage2 = minutepage2Elem.current;
        const secondpage2 = secondpage2Elem.current;
        if (secondpage2 || minutepage2 || hourpage2 || daypage2) {
            if (daypage2) {
                setDayPaper(daypage2);
            }
            if (hourpage2) {
                setHourPaper(hourpage2);
            }
            if (minutepage2) {
                setMinutePaper(minutepage2);
            }
            if (secondpage2) {
                setSecondPaper(secondpage2);
            }
        }
    };

    useEffect(() => {
        setPaperFunction();
    }, [daypage2Elem, hourpage2Elem, minutepage2Elem, secondpage2Elem]);

    useEffect(() => {
        dayPaper?.classList.add('flip');
        dayPaper?.classList.remove('over');
        setTimeout(() => {
            secondPaper?.classList.add('over');
        }, 400);
        setTimeout(() => {
            dayPaper?.classList.remove('flip');
            dayPaper?.classList.remove('over');
            setDayTop(countDate.day);
        }, 800);
    }, [countDate.day]);
    useEffect(() => {
        hourPaper?.classList.add('flip');
        hourPaper?.classList.remove('over');
        setTimeout(() => {
            secondPaper?.classList.add('over');
        }, 400);
        setTimeout(() => {
            hourPaper?.classList.remove('flip');
            hourPaper?.classList.remove('over');
            setHourTop(countDate.hour);
        }, 800);
    }, [countDate.hour]);
    useEffect(() => {
        minutePaper?.classList.add('flip');
        minutePaper?.classList.remove('over');
        setTimeout(() => {
            secondPaper?.classList.add('over');
        }, 400);
        setTimeout(() => {
            minutePaper?.classList.remove('flip');
            minutePaper?.classList.remove('over');
            setMinuteTop(countDate.minute);
        }, 800);
    }, [countDate.minute]);
    useEffect(() => {
        secondPaper?.classList.add('flip');
        secondPaper?.classList.remove('over');
        setTimeout(() => {
            secondPaper?.classList.add('over');
        }, 400);
        setTimeout(() => {
            secondPaper?.classList.remove('flip');
            secondPaper?.classList.remove('over');
            setSecondTop(countDate.second);
        }, 800);
    }, [countDate.second]);

    const canTick = deadLine > Date.now();

    return (
        <CountClockBox>
            <div className="clockDiv">
                <Clock
                    ticking={canTick ? true : false}
                    onChange={(e: void | string) => {
                        const DIFFTIME = (deadLine || 0) - Date.now();
                        const DEADLINE = getDate(DIFFTIME);
                        if (DIFFTIME > 0) {
                            setCountDate(() => ({
                                day: DEADLINE.day,
                                hour: DEADLINE.hour,
                                minute: DEADLINE.minute,
                                second: DEADLINE.second,
                            }));
                        }
                    }}
                />
            </div>
            {Object.keys(countDate).map((item, index) => {
                if (item != unit) return;
                const curNumber =
                    item == 'day' ? dayTop : item == 'hour' ? hourTop : item == 'minute' ? minuteTop : secondTop;
                const exactNumber =
                    item == 'day'
                        ? countDate.day
                        : item == 'hour'
                        ? countDate.hour
                        : item == 'minute'
                        ? countDate.minute
                        : countDate.second;

                const curRefElem =
                    item == 'day'
                        ? daypage2Elem
                        : item == 'hour'
                        ? hourpage2Elem
                        : item == 'minute'
                        ? minutepage2Elem
                        : secondpage2Elem;
                return (
                    <div className="board" key={`${item}-${index}`}>
                        <div className="page" id={`${item}page1`}>
                            <div>{makePaddedNumber(curNumber) + item.slice(0, 1).toUpperCase()}</div>
                        </div>
                        <div className="backgroundPage">
                            {makePaddedNumber(exactNumber) + item.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="page" id={`${item}page2`} ref={curRefElem}>
                            <div>{makePaddedNumber(exactNumber) + item.slice(0, 1).toUpperCase()}</div>
                        </div>
                    </div>
                );
            })}
        </CountClockBox>
    );
};

export default CountdownClock;

/**
 * use z-index 0~3
 */
const CountClockBox = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    --fontSize: 0.4rem;
    font-size: calc(2 * var(--fontSize));
    width: 100%;
    padding: 10px 0px;
    box-sizing: content-box;
    & .clockDiv {
        display: none;
    }
    & .board {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        & .page {
            width: 90%;
            height: 50%;
            display: flex;
            justify-content: center;
            overflow: hidden;
            position: relative;

            &:first-child {
                width: 100%;
                align-items: end;
                position: absolute;
                top: 0;
                z-index: 2;
                & > div {
                    background-color: var(--bg);
                    position: absolute;
                    bottom: calc(-1 * var(--fontSize));
                }
            }
            &:last-child {
                width: 100%;
                position: absolute;
                text-align: center;
                bottom: 0;
                z-index: 3;
                & > div {
                    background-color: var(--bg);
                    width: 100%;
                    position: absolute;
                    top: calc(-1 * var(--fontSize));
                }
                &.over {
                    & > div {
                        transform: scaleY(-1);
                    }
                }
            }
        }
        & .page.flip:last-child {
            animation: flipAnimation 0.9s linear;
            transform-origin: top center;
        }
    }
    & .board .backgroundPage {
        background-color: var(--bg);
        width: 100%;
        z-index: 0;
        height: 50%;
        font-size: calc(2 * var(--fontSize));
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        transform: translateY(0px);
    }

    @keyframes flipAnimation {
        from {
            transform: rotateX(0deg) rotateY(0deg);
        }
        40% {
            transform: rotateX(-90deg) rotateY(0deg);
        }
        80% {
            transform: rotateX(-180deg) rotateY(0deg);
        }
        to {
            transform: rotateX(-180deg) rotateY(0deg);
        }
    }
`;
