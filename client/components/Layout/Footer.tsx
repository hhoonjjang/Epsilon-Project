import styled from 'styled-components';
import Link from 'next/link';

const Footer = () => {
    return (
        <FooterBox>
            <TitleBox>
                <div className="winStyle-fontGradient fg-gold ac-orange">WIN</div>
                <div>DEX</div>
            </TitleBox>
            <InfoBox>
                <li>Kakaotalk. @윈덱스</li>
                <li>Tel. 02-234-0912</li>
                <li>Customer Center. 10AM~18PM (Lunch Time 12PM~13PM)</li>
                <li>windex@windex.com</li>
            </InfoBox>
            <CopyRightBox>
                <div>© 2018 - 2023 WINDEX, Inc</div>
            </CopyRightBox>
        </FooterBox>
    );
};

export default Footer;

const FooterBox = styled.div`
    width: 100%;
    padding: 50px 10%;
    display: flex;
    flex-direction: column;
    row-gap: 50px;
    justify-content: space-between;
`;

const TitleBox = styled.div`
    font-weight: 1000;
    display: flex;
    font-size: 1.5rem;
    letter-spacing: -1px;
    div {
        color: var(--middlegrey);
    }
`;

const InfoBox = styled.ul`
    list-style: none;
    font-size: 0.6rem;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    li {
        color: var(--middlegrey);
    }
`;

const CopyRightBox = styled.div`
    font-size: 0.6rem;
    & > div {
        color: var(--middlegrey);
    }
`;
