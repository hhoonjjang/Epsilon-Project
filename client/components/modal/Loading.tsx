import styled from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Loading = () => {
    return (
        <LoadingBox>
            <LazyLoadImage src="/img/Loading.gif" />
        </LoadingBox>
    );
};

export default Loading;

const LoadingBox = styled.div`
    width: 100%;
    padding: 40px;
    padding-bottom: 70px;
    & > img {
        width: 100%;
        height: 100%;
    }
`;
