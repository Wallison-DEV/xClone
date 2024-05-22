import styled from "styled-components";
import { Colors, breakpoints } from "../../styles";

export const EntryDiv = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    height: calc(100vh - 40px);
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 24px 0 0 ;
    padding: 0;
    .logoImg {
        height: 270px;
        width: 299px;
    }
    text-align: start;

    .loginDiv {
        display: flex;
        justify-content: flex-end;
        @media (max-width: ${breakpoints.tablet}){
            align-items: center;
            text-align: center;
        }
    }

    @media (max-width: ${breakpoints.desktop}) {
        display: flex;
        justify-content: center;
        .logoImg {
            display: none;
        }
    }
`;

export const ListDiv = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 24px;
    max-width: 90%;
    @media (max-width: ${breakpoints.tablet}) {
        align-items: center;
        .logoImg {
            display: none;
        }
    }
`

export const InputsDiv = styled.div`
    width: 100%;
    max-width: 298px;
    display: flex;
    flex-direction: column;
`

export const Separador = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    margin: 16px 0;
    width: 298px;

    &::before,
    &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid ${Colors.lightgray};
    }

    &::before {
        margin-right: 16px;
    }

    &::after {
        margin-left: 16px;
    }
`;

export const PrivacyPolicy = styled.div`
    font-size: 11px;
    font-weight: 400;
    text-decoration: none;
    max-width: 300px;
    color: ${(props)=> props.theme.corDoTextoSecundario};
    margin: 12px 0 48px;

    span {
        color: ${Colors.blue};
    }
`