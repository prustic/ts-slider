import { RefObject } from 'react'

export function getPositionX(
    event:
        | React.MouseEvent<HTMLDivElement, MouseEvent>
        | React.TouchEvent<HTMLDivElement>
) {
    return event.type.includes('mouse')
        ? (event as React.MouseEvent<HTMLDivElement>).pageX
        : (event as React.TouchEvent<HTMLDivElement>).touches[0].clientX
}

export function getElementDimensions(ref: RefObject<HTMLDivElement>) {
    const width = ref.current ? ref.current.clientWidth : 0
    const height = ref.current ? ref.current.clientHeight : 0
    return { width, height }
}