import styled from "styled-components";
import { Colors, breakpoints } from "../../styles";

export const PostContainer = styled.div`
    padding-top: 20px;
    grid-column: 2 / 3; 
    max-width: 900px;
    min-width: 600px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    >div {
        width: 100%;
    }
    @media ( max-width: ${breakpoints.tablet}){
        margin-bottom: 72px;
        min-width: 0;
    }
`
export const StyledHeader = styled.header`
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    position: relative;

    .close-span {
        position: absolute;
        left: -4px;
        top: -10px;
        cursor: pointer;
        font-size: 1.4rem;
        padding: 4px;
        z-index: 1;
    }
    button{
        width: 100%;
        background : transparent;
        border: none;
        display: flex;
        justify-content: center;
        
        &.is-selected{
            p{
                border-bottom: 4px solid ${Colors.blue};
            }
        }

        p{
            font-size: 1rem;
            padding-bottom: 6px;
            font-weight: bold;
        }
    }
`
