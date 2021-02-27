import React from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'
import Slider from './components/Slider/Slider'
import images from './helpers/images'

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  } 
  html,body {
    padding: 0;
    margin: 0;
    background: #333;
  }
`

const Button = styled.button<{ right?: boolean; left?: boolean }>`
    font-size: 2rem;
    z-index: 10;
    position: fixed;
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

const AppStyles = styled.main`
    height: 100vh;
    width: 100vw;
`

function App() {
    const [index, setIndex] = React.useState(1)

    const increment = () => {
        if (index < images.length - 1) setIndex(index + 1)
    }

    const decrement = () => {
        if (index > 0) setIndex(index - 1)
    }

    return (
        <>
            <GlobalStyles />
            <AppStyles>
                <Button onClick={decrement} left disabled={index === 0}>
                    〈
                </Button>
                <Button
                    onClick={increment}
                    right
                    disabled={index === images.length - 1}
                >
                    〉
                </Button>
                <Slider
                    onSlideComplete={setIndex}
                    onSlideStart={(i) => {
                        console.log('started dragging on slide', i)
                    }}
                    activeIndex={index}
                    threshHold={100}
                    transition={0.3}
                    scaleOnDrag={true}
                >
                    {images.map((url, index) => (
                        <img src={url} key={index}/>
                    ))}
                </Slider>
            </AppStyles>
        </>
    )
}

export default App
