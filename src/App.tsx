import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Home, GenericExample, FullscreenExample } from './pages'

const GlobalStyles = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    html,
    body {
        padding: 0;
        margin: 0;
        background: #333;
    }
`

const Navigation = styled.nav`
    li,
    a {
        color: white;
    }

    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    padding: 15px;
`

function App() {
    return (
        <>
            <GlobalStyles />
            <Router>
                <Navigation>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/generic-example">Generic</Link>
                        </li>
                        <li>
                            <Link to="/fullscreen-example">Fullscreen</Link>
                        </li>
                    </ul>
                </Navigation>
                <Switch>
                    <Route path="/generic-example">
                        <GenericExample />
                    </Route>
                    <Route path="/fullscreen-example">
                        <FullscreenExample />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </>
    )
}

export default App
