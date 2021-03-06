import React, {
    useState,
    useRef,
    useLayoutEffect,
    useEffect,
    useCallback,
} from 'react'
import styled, { css } from 'styled-components'
import {
    getElementDimensions,
    getPositionX,
} from '../../helpers/util'
import Slide from '../Slide/Slide'
import { SliderStyles, SliderWrapper } from './Slider.style'
import { SliderProps } from './Slider.types'

const Slider = (props: SliderProps) => {
    const {
        children,
        threshHold = 100,
        transition = 0.3,
        scaleOnDrag = false,
        button,
        start = 0,
        slidesToScroll = 1,
        slidesToShow = 1,
    } = props

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [index, setIndex] = React.useState(start)

    const increment = () => {
        if (index < children.length - 1) setIndex(index + 1)
    }

    const decrement = () => {
        if (index > 0) setIndex(index - 1)
    }

    const renderButtons = () => {
        if (button) {
            const Button = styled.i<{
                left?: boolean
                right?: boolean
                onClick: () => void
                disabled: boolean
            }>`
                ${button.type.componentStyle.rules};
                position: absolute;
                top: 50%;
                opacity: ${(props) => (props.disabled ? 0.4 : 1)};
                z-index: 2;
                ${(props) =>
                    props.right
                        ? css`
                              right: 0rem;
                              transform: rotate(-45deg);
                          `
                        : css`
                              left: 0rem;
                              transform: rotate(135deg);
                          `}
            `
            return (
                <>
                    <Button
                        onClick={decrement}
                        left
                        disabled={index === 0}
                    />
                    <Button
                        onClick={increment}
                        right
                        disabled={
                            index ===
                                (children.length - 1) / slidesToScroll
                        }
                    />
                </>
            )
        } else return null
    }

    const dragging = useRef(false)
    const startPos = useRef(0)
    const currentTranslate = useRef(0)
    const prevTranslate = useRef(0)
    const currentIndex = useRef(index)
    const sliderRef = useRef<any>('slider')
    const animationRef = useRef<number | null>(null)

    const setPositionByIndex = useCallback(
        (w = dimensions.width) => {
            console.log('currentIndex.current:', currentIndex.current);
            currentTranslate.current = currentIndex.current * -w
            prevTranslate.current = currentTranslate.current
            console.log('currentTranslate.current', currentTranslate.current);
            console.log('prevTranslate.current', prevTranslate.current);
            setSliderPosition()
        },
        [dimensions.width]
    )

    const transitionOn = () => (sliderRef.current.style.transition = `transform ${transition}s ease-out`)

    const transitionOff = () => (sliderRef.current.style.transition = 'none')

    useEffect(() => {
        if (index !== currentIndex.current) {
            handleIndexChange()
        }
    }, [index, setPositionByIndex])

    useLayoutEffect(() => {
        setDimensions(getElementDimensions(sliderRef))

        setPositionByIndex(getElementDimensions(sliderRef).width)
    }, [setPositionByIndex])

    useEffect(() => {
        const handleResize = () => {
            transitionOff()
            const { width, height } = getElementDimensions(sliderRef)
            setDimensions({ width, height })
            setPositionByIndex(width)
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            const arrowsPressed = ['ArrowRight', 'ArrowLeft'].includes(e.key)
            if (arrowsPressed) transitionOn()
            if (e.key === 'ArrowRight') {
                if (currentIndex.current < children.length / slidesToScroll - 1)
                    currentIndex.current += 1
            }
            if (e.key === 'ArrowLeft') {
                if (currentIndex.current > 0)
                    currentIndex.current -= 1
            }

            if (arrowsPressed && setIndex) setIndex(currentIndex.current)
            setPositionByIndex()
        }

        window.addEventListener('resize', handleResize)
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [children.length, setPositionByIndex, setIndex])

    function handleIndexChange() {
        transitionOn()
        currentIndex.current = index
        setPositionByIndex()
    }

    function touchStart(index: number) {
        return function (
            event:
                | React.MouseEvent<HTMLDivElement>
                | React.TouchEvent<HTMLDivElement>
        ) {
            transitionOn()
            if(!Number.isInteger(slidesToShow)) currentIndex.current = index
            startPos.current = getPositionX(event as React.TouchEvent<HTMLDivElement>)
            dragging.current = true
            animationRef.current = requestAnimationFrame(animation)
            sliderRef.current.style.cursor = 'grabbing'
        }
    }

    function touchMove(
        event:
            | React.MouseEvent<HTMLDivElement>
            | React.TouchEvent<HTMLDivElement>
    ) {
        if (dragging.current) {
            const currentPosition = getPositionX(event)
            currentTranslate.current = prevTranslate.current + currentPosition - startPos.current
        }
    }

    function touchEnd() {
        transitionOn()
        cancelAnimationFrame(animationRef.current as number)
        dragging.current = false
        const movedBy = currentTranslate.current - prevTranslate.current

        if (movedBy < -threshHold && currentIndex.current < (children.length - 1) / slidesToScroll)
            currentIndex.current += 1

        if (movedBy > threshHold && currentIndex.current > 0)
            currentIndex.current -= 1

        transitionOn()
        setPositionByIndex()
        sliderRef.current.style.cursor = 'grab'
        if (setIndex) setIndex(currentIndex.current)
    }

    function animation() {
        setSliderPosition()
        if (dragging.current) requestAnimationFrame(animation)
    }

    function setSliderPosition() {
        sliderRef.current.style.transform = `translateX(${((currentTranslate.current * 1) / slidesToShow) * slidesToScroll}px)`
    }
    
    return (
        <SliderWrapper>
            {renderButtons()}
            <SliderStyles ref={sliderRef}>
                {children.map((child, index) => {
                    return (
                        <div
                            key={index}
                            onTouchStart={touchStart(index)}
                            onMouseDown={touchStart(index)}
                            onTouchMove={touchMove}
                            onMouseMove={touchMove}
                            onTouchEnd={touchEnd}
                            onMouseUp={touchEnd}
                            onMouseLeave={() => {
                                if (dragging.current) touchEnd()
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            className="slide-outer"
                        >
                            <Slide
                                child={child}
                                sliderWidth={
                                    (dimensions.width * 1) / slidesToShow
                                }
                                sliderHeight={dimensions.height}
                                scaleOnDrag={scaleOnDrag}
                            />
                        </div>
                    )
                })}
            </SliderStyles>
        </SliderWrapper>
    )
}

export default Slider
