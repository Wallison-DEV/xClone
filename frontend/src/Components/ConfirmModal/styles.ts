import styled from "styled-components";

export const ConfirmDiv = styled.div`
    background: ${(props)=> props.theme.corDeFundo};
    padding: 24px;
    gap: 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 1;
    width: 100%;
    max-width: 480px;
`