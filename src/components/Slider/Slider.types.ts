import { ReactNode } from 'react'

export type SliderProps = {
    children: ReactNode[]
    threshHold: number
    transition: number
    scaleOnDrag: boolean
    displayPerSlide: number
    button?: JSX.Element
    slidesToScroll?: number
    start?: number
    infinite?: boolean
}
