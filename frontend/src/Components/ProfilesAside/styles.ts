import styled from "styled-components";
import { breakpoints } from "../../styles";

export const RightAside = styled.aside`
    position: sticky;
    top: 0;
    right: 0;
    max-width: 380px;
    width: 100%;
    min-width: 290px;
    border-left: solid 1px #ccc;
    height: 100vh;
    
    > div {
        position: relative;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding-right: 8px;
        
        > div {
            padding: 16px 16px 0;
            overflow-y: auto;
            position: absolute;
            top: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
    }
    
    @media (max-width: ${breakpoints.desktop}) {
        display: none;
    }
`;
