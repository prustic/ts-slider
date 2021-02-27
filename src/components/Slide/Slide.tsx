import React, { RefObject, useRef } from 'react'
import { SlideStyles } from './Slide.style'
import { SlideProps } from './Slide.types'

const Slide = (props: SlideProps) => {
    const { child, sliderWidth, sliderHeight, scaleOnDrag = false } = props;
    const slideRef = useRef<any>('slide')

    const onMouseDown = () => {
        if (scaleOnDrag) slideRef.current.style.transform = 'scale(0.9)'
    }

    const onMouseUp = () => {
        if (scaleOnDrag) slideRef.current.style.transform = 'scale(1)'
    }
    return (
        <SlideStyles
            ref={slideRef}
            sliderWidth={`${sliderWidth}px`}
            sliderHeight={`${sliderHeight}px`}
            className="SlideStyles"
        >
            <div
                unselectable="on"
                className="slide-inner"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onTouchStart={onMouseDown}
                onTouchEnd={onMouseUp}
                onMouseLeave={onMouseUp}
                onDragStart={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    return false
                }}
            >
                {child}
            </div>
        </SlideStyles>
    )
}

export default Slide
