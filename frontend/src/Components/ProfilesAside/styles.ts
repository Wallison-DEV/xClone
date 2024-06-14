import styled from "styled-components";
import { breakpoints } from "../../styles";

export const RightAside = styled.aside`
    position: sticky;
    top: 0;
    right: 0;
    max-width: 350px;
    width: 100%;
    min-width: 290px;
    padding: 16px;
    border-left: solid 1px #ccc;
    height: 100vh;
    overflow: auto;

    > div {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding-right: 8px;
        
        > div {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
    }

    @media (max-width: ${breakpoints.desktop}) {
        display: none;
    }
`;
