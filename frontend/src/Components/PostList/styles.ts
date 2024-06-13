import styled from "styled-components";
import { Colors, breakpoints } from "../../styles";

export const PostContainer = styled.div`
    padding: 20px;
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media ( max-width: ${breakpoints.tablet}){
        margin-bottom: 72px;
        width: 100%;
        min-width: 100%;
    }
`

export const PostList= styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    >div {
        width: 100%;
    }
    @media ( max-width: ${breakpoints.tablet}){
        margin-bottom: 72px;
        width: 100%;
        min-width: 100%;
    }
`

export const StyledHeader = styled.header`
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    position: relative;
    margin-bottom: 16px;

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
