import styled, { css } from 'styled-components'

export const SliderStyles = styled.div`
    all: initial;
    width: 100%;
    height: 100%;
    max-height: 100vh;
    display: inline-flex;
    will-change: transform, scale;
    cursor: grab;

    .slide-outer {
        display: flex;
        align-items: center;
    }
`

export const SliderWrapper = styled.div`
    overflow: hidden;
    width: 100%;
    height: 100%;
    max-height: 100vh;
`

export const Button = styled.button<{ right?: boolean; left?: boolean }>`
    font-size: 2rem;
    z-index: 10;
    position: absolute;
    top: 50%;
    ${(props) =>
        props.right
            ? css`
                  right: 0.5rem;
              `
            : css`
                  left: 0.5rem;
              `}
`
