import styled from "styled-components";
import { Colors, breakpoints } from "../../styles";
import { PostDiv } from "../PostForm/styles";

export const PostContainer = styled.div`
    height: 100vh;
    overflow: auto;
    padding: 20px 20px 0;
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${PostDiv} {
        flex-grow: 1;
    }
    @media (max-width: ${breakpoints.tablet}) {
        margin-bottom: 72px;
        width: 100%;
        min-width: 100%;
    }
`;

export const PostList = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    > div {
        width: 100%;
    }
    @media (max-width: ${breakpoints.tablet}) {
        margin-bottom: 72px;
        width: 100%;
        min-width: 100%;
    }
`;

export const NoPostsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    font-size: 1.2rem;
    color: ${Colors.gray};
`;

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
    button {
        width: 100%;
        background: transparent;
        border: none;
        display: flex;
        justify-content: center;
        
        &.is-selected {
            p {
                border-bottom: 4px solid ${Colors.blue};
            }
        }

        p {
            font-size: 1rem;
            padding-bottom: 6px;
            font-weight: bold;
        }
    }
`;
