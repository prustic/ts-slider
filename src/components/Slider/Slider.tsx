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
    infinitize,
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
        start = 1,
        slidesToScroll = 1,
        infinite = false,
    } = props
    const infiniteChildren = infinitize(children)
    console.log(infiniteChildren.length)

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [index, setIndex] = React.useState(start)
    const [positiveLengthDifference, setPositiveDifference] = React.useState(0)

    const increment = () => {
        if (index < infiniteChildren.length - 1) setIndex(index + 1)
        else {
            if (infinite) {
                generateNextSlide()
                setIndex(index + 1)
            }
        }
    }

    const decrement = () => {
        if (index > 1) setIndex(index - 1)
        else {
            if (infinite) {
                generatePreviousSlide()
                setIndex(index - 1)
            }
        }
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
                        disabled={!infinite && index === 0}
                    />
                    <Button
                        onClick={increment}
                        right
                        disabled={
                            !infinite && index === infiniteChildren.length - 1
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
            currentTranslate.current = currentIndex.current * -w
            prevTranslate.current = currentTranslate.current
            setSliderPosition()
        },
        [dimensions.width]
    )

    const transitionOn = () =>
        (sliderRef.current.style.transition = `transform ${transition}s ease-out`)

    const transitionOff = () => (sliderRef.current.style.transition = 'none')

    useEffect(() => {
        if (index !== currentIndex.current) {
            console.log(index)
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
                if (currentIndex.current < infiniteChildren.length - 1)
                    currentIndex.current += 1
                else {
                    if (infinite) {
                        generateNextSlide()
                        currentIndex.current += 1
                    }
                }
            }
            if (e.key === 'ArrowLeft') {
                if (currentIndex.current > 0) {
                    currentIndex.current -= 1
                } else {
                    if (infinite) {
                        generatePreviousSlide()
                        currentIndex.current -= 1
                    }
                }
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
    }, [infiniteChildren.length, setPositionByIndex, setIndex])

    function handleIndexChange() {
        transitionOn()
        currentIndex.current = infinite && index < 1 ? 0 : index
        setPositionByIndex()
    }

    function touchStart(index: number) {
        return function (
            event:
                | React.MouseEvent<HTMLDivElement>
                | React.TouchEvent<HTMLDivElement>
        ) {
            transitionOn()
            currentIndex.current = index
            startPos.current = getPositionX(
                event as React.TouchEvent<HTMLDivElement>
            )
            dragging.current = true
            animationRef.current = requestAnimationFrame(animation)
            sliderRef.current.style.cursor = 'grabbing'

            if (
                infinite &&
                currentIndex.current === infiniteChildren.length - 1
            ) {
                generateNextSlide()
            }

            if( 
                infinite &&
                currentIndex.current <= 0
            ) {
                generatePreviousSlide()
            }
        }
    }

    function touchMove(
        event:
            | React.MouseEvent<HTMLDivElement>
            | React.TouchEvent<HTMLDivElement>
    ) {
        if (dragging.current) {
            const currentPosition = getPositionX(event)
            currentTranslate.current =
                prevTranslate.current + currentPosition - startPos.current
        }
    }

    function touchEnd() {
        transitionOn()
        cancelAnimationFrame(animationRef.current as number)
        dragging.current = false
        const movedBy = currentTranslate.current - prevTranslate.current

        if (
            (movedBy < -threshHold &&
                currentIndex.current < infiniteChildren.length - 1) ||
            (movedBy < -threshHold && infinite)
        )
            currentIndex.current += 1

        if (
            (movedBy > threshHold && currentIndex.current > 0) ||
            (movedBy > threshHold && infinite)
        )
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
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}px)`
    }

    function generateNextSlide() {
        infiniteChildren.push(infiniteChildren[positiveLengthDifference])
        setPositiveDifference(positiveLengthDifference + 1)
    }

    function generatePreviousSlide() {
        infiniteChildren.unshift(infiniteChildren[index - 1])
    }

    return (
        <SliderWrapper>
            {renderButtons()}
            <SliderStyles ref={sliderRef}>
                {infiniteChildren.map((child, index) => {
                    return (
                        <div
                            key={index}
                            onTouchStart={
                                touchStart(index) as (
                                    event: React.TouchEvent<HTMLDivElement>
                                ) => void
                            }
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
                                sliderWidth={dimensions.width}
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
