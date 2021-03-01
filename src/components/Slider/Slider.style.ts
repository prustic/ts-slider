import styled from 'styled-components'

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