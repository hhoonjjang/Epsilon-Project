import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { saveTextToClipboard } from './tools';

type HoverEffectProps = {
    innerText: string;
    text: string;
    effect?: string;
    textColor?: string;
    className?: string;
    down?: boolean;
};

type HoverStyledProps = {
    effect?: string;
    textColor?: string;
    down?: boolean;
};

const HoverFunction = ({ text, effect, textColor, innerText, className, down }: HoverEffectProps) => {
    const [hoverText, setHoverText] = useState(text);

    useEffect(() => {
        if (text) setHoverText(text);
    }, [text]);

    return (
        <HoverFunctionBox>
            <HoverEffect
                text={text}
                effect={effect}
                textColor={textColor}
                innerText={innerText}
                className={className}
                onClick={() => {
                    saveTextToClipboard(text);
                    setHoverText('copied!');
                }}
                onMouseLeave={() => {
                    setTimeout(() => {
                        setHoverText(text);
                    }, 500);
                }}
            >
                {innerText}
            </HoverEffect>
            <HoverBox effect={effect} textColor={textColor} down={down}>
                {hoverText}
            </HoverBox>
        </HoverFunctionBox>
    );
};

export default HoverFunction;

const HoverFunctionBox = styled.span`
    position: relative;
`;

const HoverEffect = styled.span<HoverEffectProps>`
    position: relative;
    display: inline-block;
    cursor: url('/img/clip-board.svg') 12 12, pointer;
    &:active {
        cursor: url('/img/clip-board-white.svg') 12 12, pointer;
    }
    font-weight: bold;
    &:hover:active + span {
        animation: none;
    }
    &:hover + span {
        opacity: 1;
    }
`;

const HoverBox = styled.span<HoverStyledProps>`
    position: absolute;
    color: ${({ textColor }) => textColor || 'inherit'};
    top: ${({ down }) => (down ? '200%' : '-200%')};
    left: 50%;
    transform: translate(-50%, 0);
    padding: 10px;
    background-color: ${({ effect }) => effect || 'rgba(100,100,100, 0.2)'};
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none;
    animation: bounce 1s ease-in-out infinite;
`;
