import React, {
    useState,
    useRef,
    useLayoutEffect,
    useEffect,
    useCallback,
    RefObject,
} from 'react'
import { useInView } from 'react-intersection-observer'
import { getElementDimensions, getPositionX } from '../../helpers/util'
import Slide from '../Slide/Slide'
import { SliderStyles, SliderWrapper } from './Slider.style'
import { SliderProps } from './Slider.types'

const Slider = (props: SliderProps) => {
    const {
        children,
        onSlideComplete,
        onSlideStart,
        activeIndex = 0,
        threshHold = 100,
        transition = 0.3,
        scaleOnDrag = false,
    } = props

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
    });

    const dragging = useRef(false)
    const startPos = useRef(0)
    const currentTranslate = useRef(0)
    const prevTranslate = useRef(0)
    const currentIndex = useRef(activeIndex)
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

    // watch for a change in activeIndex prop
    useEffect(() => {
        if (activeIndex !== currentIndex.current) {
            transitionOn()
            currentIndex.current = activeIndex
            setPositionByIndex()
        }
    }, [activeIndex, setPositionByIndex])

    // set width after first render
    // set position by startIndex
    // no animation on startIndex
    useLayoutEffect(() => {
        setDimensions(getElementDimensions(sliderRef))

        setPositionByIndex(getElementDimensions(sliderRef).width)
    }, [setPositionByIndex])

    // add event listeners
    useEffect(() => {
        // set width if window resizes
        const handleResize = () => {
            transitionOff()
            const { width, height } = getElementDimensions(sliderRef)
            setDimensions({ width, height })
            setPositionByIndex(width)
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            const arrowsPressed = ['ArrowRight', 'ArrowLeft'].includes(e.key)
            if (arrowsPressed) transitionOn()
            if (arrowsPressed && onSlideStart) {
                onSlideStart(currentIndex.current)
            }
            if (
                e.key === 'ArrowRight' &&
                currentIndex.current < children.length - 1
            ) {
                currentIndex.current += 1
            }
            if (e.key === 'ArrowLeft' && currentIndex.current > 0) {
                currentIndex.current -= 1
            }
            if (arrowsPressed && onSlideComplete)
                onSlideComplete(currentIndex.current)
            setPositionByIndex()
        }

        window.addEventListener('resize', handleResize)
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [children.length, setPositionByIndex, onSlideComplete, onSlideStart])

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
            // if onSlideStart prop - call it
            if (onSlideStart) onSlideStart(currentIndex.current)
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

        // if moved enough negative then snap to next slide if there is one
        if (movedBy < -threshHold && currentIndex.current < children.length - 1)
            currentIndex.current += 1

        // if moved enough positive then snap to previous slide if there is one
        if (movedBy > threshHold && currentIndex.current > 0)
            currentIndex.current -= 1

        transitionOn()

        setPositionByIndex()
        sliderRef.current.style.cursor = 'grab'
        // if onSlideComplete prop - call it
        if (onSlideComplete) onSlideComplete(currentIndex.current)
    }

    function animation() {
        setSliderPosition()
        if (dragging.current) requestAnimationFrame(animation)
    }

    function setSliderPosition() {
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}px)`
    }
        
    return (
        <SliderWrapper>
            <SliderStyles ref={sliderRef}>
                {children.map((child, index) => {
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
