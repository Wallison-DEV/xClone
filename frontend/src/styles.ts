import styled, { createGlobalStyle } from 'styled-components'

export const Colors = {
    black: '#000',
    lightBlack: 'rgb(15, 20, 25)',
    white: '#fff',
    lightgray: '#dcdcdc',
    gray: 'rgb(83, 100, 113)',
    blue: '#0099FF',
    lightblue: '#33CCFF',
}

export const breakpoints = {
    desktop: '1024px',
    tablet: '767px',
}

export const EstiloGlobal = createGlobalStyle`
    * { 
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Inter', sans-serif;
        list-style: none;
        text-decoration: none;
        color: ${(props)=> props.theme.corDoTexto};
        &::-webkit-scrollbar {
            width: 8px; 
        }
        &::-webkit-scrollbar-track {
            background: ${Colors.lightgray}; 
            border-radius: 10px; 
        }
    
        &::-webkit-scrollbar-thumb {
            background: ${Colors.gray};
            border-radius: 10px; 
        }
    
        &::-webkit-scrollbar-thumb:hover {
            background: ${Colors.gray}; 
        }
    }

    body {
        background: ${(props)=> props.theme.corDeFundo};
        overflow-y: hidden;
    }

    .container { 
        max-width: 1260px;
        width: 100%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;

        @media (max-width: ${breakpoints.desktop}) {
            max-width: 80%;
        }
    }
    .margin-24 {
        margin-bottom: 24px;
    }
    .text-blue {
        color: ${Colors.blue};
    }
    .flex-end {
        display: flex;
        justify-content: flex-end;
    }
    .w-100 {
        width: 100%;
    }
    .margin-top {
        margin-top: 24px;
    }
`

export const Container = styled.div`
    display: flex;
    max-width: 1310px;
    justify-content: center;
    margin: 0 auto;
`;

export const PrimaryTitle = styled.h1`
    font-size: 64px;
    font-weight: 700;
    line-height: 84px;
    @media (max-width: ${breakpoints.tablet}){
        line-height: 40px;
        font-size: 40px;
        }
`

export const SecondTitle = styled.h2`
    font-size: 31px;
    font-weight: 700;
    margin-bottom: 30px;
    width: 100%;
    line-height: 36px;
`
export const TertiaryTitle = styled.h3`
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 20px;
    width: 100%;
`

export const Overlay = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.73);
`

export const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    .overlay {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.73);
    }
`