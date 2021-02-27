import styled from 'styled-components'

export const SlideStyles = styled.div<{
    sliderWidth: string
    sliderHeight: string
}>`
    transition: transform 0.2s ease-out;
    div {
        padding: 1rem;
        height: 100%;
        width: ${(props) => props.sliderWidth};
        height: ${(props) => props.sliderHeight};
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
    }
    img {
        max-width: 100%;
        max-height: 100%;
    }
`
