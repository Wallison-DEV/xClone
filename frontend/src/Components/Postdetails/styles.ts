import styled from "styled-components";
import { PostContainer } from "../PostList/styles";
import { Colors } from "../../styles";
import { PostForm } from "../PostForm/styles";

export const CommentsSection =styled.div`
    >div {
        display: flex;
        margin: 12px 0;
        padding: 12px;
        border: 1px solid ${Colors.lightgray};
        border-radius: 8px;
        img {
            width: 40px;
            height: 40px;
            margin-right: 12px;
        }
    }
    ${PostForm}{
        border: 1px solid black;
        border-radius: 8px;
        padding: 12px;
    }
`

export const StyledPostDetails = styled.div`
    width: 100%;
    padding: 8px;
    ${PostContainer}{
        margin-top: 32px;
    }
`

export const CommentHeader = styled.header`
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;

    span {
        font-weight: 400;
        color: ${Colors.gray};
        margin-left: 8px;
        gap: 8px;
    }
`

export const CommentContent = styled.div``