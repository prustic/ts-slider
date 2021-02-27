import React from 'react'
import Slider from '../../../components/Slider/Slider'
import { FullscreenExampleStyled } from './Fullscreen.style'
import images1920x1080 from '../../../helpers/images'

const FullscreenExample = () => {
    const sliderSettings = {
        threshHold: 100,
        transition: 0.3,
        scaleOnDrag: true,
        displayPerSlide: 1
    }

    return (
        <FullscreenExampleStyled>
            <Slider {...sliderSettings}>
                {images1920x1080.map((url, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            width: '100vw',
                            height: '100vh',
                            backgroundImage: `url(${url})`,
                            backgroundSize: 'cover',
                        }}
                    />
                ))}
            </Slider>
        </FullscreenExampleStyled>
    )
}

export default FullscreenExample
