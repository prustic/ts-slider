import React from 'react'
import { GenericExampleStyled, Button } from './Generic.style';
import Slider from '../../../components/Slider/Slider'
import images1920x1080 from '../../../helpers/images';

const GenericExample = () => {
    const sliderSettings = {
        threshHold: 100,
        transition: 0.3,
        scaleOnDrag: true,
        button: <Button />,
        start: 0,
        slidesToScroll: 1,
        slidesToShow: 1.25
    }
    
    return (
        <GenericExampleStyled>
            <Slider {...sliderSettings}>
                {images1920x1080.map((url, index) => (
                    <img src={url} key={index} />
                ))}
            </Slider>
        </GenericExampleStyled>
    )
}

export default GenericExample
