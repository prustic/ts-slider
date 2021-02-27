import { Dispatch, SetStateAction, ReactNode, ComponentElement } from 'react'
import { StyledComponentBase } from 'styled-components'

export type SliderProps = {
    children: ReactNode[]
    onSlideComplete: Dispatch<SetStateAction<number>>
    onSlideStart: (arg: number) => void
    activeIndex: number
    threshHold: number
    transition: number
    scaleOnDrag: boolean
}
