import styled from 'styled-components';

export const GenericExampleStyled = styled.div`
    width: 80%;
    margin: auto;
    height: 100vh;
    position: relative;

    img {
        width: 100%;
        height: auto;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`

export const Button = styled.i`
    border: solid white;
    border-width: 0 4px 4px 0;
    display: inline-block;
    padding: 5px;
`