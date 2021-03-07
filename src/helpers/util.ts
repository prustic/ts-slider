import { ReactNode, RefObject } from 'react'

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

export const infinitize = (input: ReactNode[]) => {
    if (!Array.isArray(input)) {
        throw new TypeError('Expected an array')
    }

    return new Proxy(input, {
        get(target: ReactNode[], name: PropertyKey, receiver: ReactNode): ReactNode {
            if (typeof name !== 'string') {
                return Reflect.get(target, name, receiver)
            }

            let index = Number(name)

            if (Number.isNaN(index)) {
                return Reflect.get(target, name, receiver)
            }

            if (index % target.length === 0) {
                index = 0
            } else if (index < 0) {
                index = target.length + (index % target.length)
            } else if (index >= target.length) {
                index %= target.length
            }

            return target[index]
        },
        set(
            target: ReactNode[],
            name: PropertyKey,
            value: ReactNode,
            receiver: ReactNode
        ): boolean {
            if (typeof name !== 'string') {
                return Reflect.set(target, name, value, receiver)
            }

            const index = Number(name)

            if (Number.isNaN(index)) {
                return Reflect.set(target, name, value, receiver)
            }

            if (index < 0) {
                if (index % target.length === 0) {
                    target[0] = value
                } else {
                    target[target.length + (index % target.length)] = value
                }
            } else {
                target[index] = value
            }

            return true
        },
    })
}
