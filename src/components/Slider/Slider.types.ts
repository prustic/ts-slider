import { ReactNode } from 'react'

export type SliderProps = {
    children: ReactNode[]
    threshHold: number
    transition: number
    scaleOnDrag: boolean
    displayPerSlide: number
}
