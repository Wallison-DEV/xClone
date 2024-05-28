import styled from "styled-components";
import { Colors } from "../../styles";

export const LoginDiv = styled.div`
    z-index: 1;
    background-color: ${(props)=> props.theme.corDeFundo};
    max-width: 600px;
    width: 100%;
    height: auto;
    max-height: 90vh;
    border-radius: 12px;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 16px;
`
export const InputDiv = styled.label`
    position: relative;
    width: 100%;
    margin-bottom: 20px; 
    border: 1px solid ${(props)=> props.theme.corDaBorda};
    border-radius: 5px; 
    height: 58px; 
    padding: 8px;

    span {
        position: absolute;
        top: 16px;
        left: 8px;
        transform: translateY(-50%);
        font-size: 13px;
        font-weight: 400;
        color: ${(props)=> props.theme.corDaBorda};
        cursor: pointer;
    }
    textarea, input {
        outline: none; 
        border: none;
        width: 100%;
        font-size: 17px;
        margin-top: 20px;
        color: ${(props)=> props.theme.corDoTexto};
        background-color: ${(props)=> props.theme.corDeFundo};
    } 
`
export const StyledForm = styled.form`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`

export const FormHeader = styled.header`
    position: relative;
    display: flex;
    align-items: center;
    height: 53px;
    width: 100%;
    justify-content: center;

    span{
        position: absolute;
        top: 8px;
        left: 8px;
        width: 24px;
        heigth: 24px;
        font-size: 20px;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    img {
        width: 26px;
        height: 28px;
    }
`

export const Error = styled.p`
    margin: 0 auto 24px; 
    width: 100%;
    display: flex;
    flex-wrap: wrap;
`

export const PasswordDiv = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 440px;
    width: 100%;
    height: 100%;
    text-align: start;
    justify-content: space-between;
`

export const FinalDiv = styled.div`
    p {
        margin-top: 16px;
    }
    span {
        color: ${Colors.blue};
        cursor: pointer;
    }
`