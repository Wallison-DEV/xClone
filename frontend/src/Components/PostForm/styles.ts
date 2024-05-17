import styled from "styled-components";
import { ButtonStyle } from "../Button/styles";
import { Colors } from "../../styles";

export const PostForm = styled.form`
    display : grid;
    grid-template-columns: 48px auto;
    width: 100%;
    margin-top: 12px;

    label {
        cursor: pointer;
    }

    > img {
        width: 40px;
        height: 40px;
    }
    video {
        max-width: 100%;
        max-height: 80vh;
    }
    
    textarea {
        width: 100%;
        border: none;
        font-size: 1.2rem;
        padding: 12px;
        outline: none;
        resize: none;
        min-height: 100px;
        height: auto;
    }
    footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid rgb(239, 243, 244);
        padding-top: 12px;

        img {
            width: 16px;
            height: 16px;
        }
        ${ButtonStyle} {
            width: 90px;
        }
    }
`
export const PreviewImage = styled.img`
    max-width: 100%;
    max-height: 80vh;
`

export const PostDiv = styled.div`
    background-color: ${Colors.white};
    max-width: 700px;
    width: 100%;
    height: auto;
    max-height: 90vh;
    border-radius: 12px;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 16px;
    overflow-y: auto;
`