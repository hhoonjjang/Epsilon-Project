import { LazyLoadImage } from 'react-lazy-load-image-component';

interface PictureImgProps {
    imgSrc: string;
    size: string;
    width?: number;
    type?: string;
    afterLoad?: Boolean;
    setAfterLoad?: any;
}

const PictureImg = ({ imgSrc, size, width, type, afterLoad, setAfterLoad }: PictureImgProps) => {
    return (
        <picture>
            <source srcSet={`${imgSrc}-${size}.webp`} type="image/webp" />
            <source srcSet={`${imgSrc}-${size}.jpg`} type="image/jpeg" />
            {/* <img src={`${imgSrc}-${size}.jpg`} alt="병 사진" width={`${width}px`} loading="lazy" /> */}
            <LazyLoadImage src={`${imgSrc}-${size}.webp`} loading="lazy" effect="blur" />
        </picture>
    );
};

export default PictureImg;
