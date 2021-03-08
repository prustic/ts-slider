import { ReactNode } from 'react'

export type SliderProps = {
    children: ReactNode[]
    threshHold: number
    transition: number
    scaleOnDrag: boolean
    button?: JSX.Element
    slidesToScroll?: number
    slidesToShow?: number
    start?: number
    infinite?: boolean
}
