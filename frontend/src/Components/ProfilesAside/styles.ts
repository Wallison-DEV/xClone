import styled from "styled-components";
import { breakpoints } from "../../styles";

export const RightAside = styled.aside`
    max-width: 350px;
    min-width: 280px;
    position: sticky;
    top: 0;
    right: 0;
    width: 100%;
    padding: 16px 16px 0;
    border-left: solid 1px #ccc;

    >div {
        position: relative;
        >div{
            position: absolute;
            height: 100vh;
            width: 100%;
        }
    }
    
    @media (max-width: ${breakpoints.desktop}){
        display: none;
    }
`