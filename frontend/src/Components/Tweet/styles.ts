import styled from "styled-components";
import { ButtonStyle } from "../Button/styles";
import { breakpoints } from "../../styles";

export const PostContainer = styled.div`
    width: 100%;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
    font-size: 16px;
`;

export const UserInfo = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 8px;
    cursor: pointer;
    
    h2 {
        font-size: 16px;
        margin-right: 8px;
    }

    span {
        color: rgb(83, 100, 113);
    }

    img {
        width: 24px;
        margin-right: 8px;
    }

    >div{
        display:flex;
    }

    @media (max-width: ${breakpoints.tablet}){
        >div{
            display:block;
        }
    }
`;

export const PostSource = styled.div`
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px auto;

    img, video{
        max-width: 95%;
        border-radius: 16px;
    }
`;

export const PostContent = styled.p`
    margin: 12px;
    hyphens: auto;
    overflow-wrap: break-word;
`;

export const PostDetails = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin : 16px 0 4px ;
    
    span{
        cursor: pointer;
        display: flex;
        align-items: center;
        button {
            background: none;
            border: none;
            cursor: pointer;
            .like-button {
                width: 18px;
                height: 18px;
                transition: transform 0.2s ease-in-out;
                transform: scale(1);
            }
            .liked {
                color: red;
                width: 18px;
                height: 18px;
                transition: transform 0.2s ease-in-out;
                transform: scale(1.2);
            }
        }
    }
    img {
        margin-left: 4px;
        height: 14px;
    }

    .retweet-div {
        position: relative;
        display: flex;
        align-items: center;

        & > button {
            font-size: 16px;
            background: none;
            border: none;
        }

        img {
            height: 15px;
        }

        .options-div{
            position: absolute;
            bottom: 140%;
            right: -60px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 2px 4px 4px 2px rgba(0, 0, 0, 0.2);
        }

        ${ButtonStyle}{
            padding: 12px 0;
            border: none;
            width: 148px;
        }
        ${ButtonStyle}:last-child{
            border-radius: 0 0 12px 12px;
        }
        ${ButtonStyle}:first-child{
            border-radius: 12px 12px 0 0 ;
        }
    }
`

export const PostDiv = styled.div`
    width: 100%;
    border: 1px solid #f0f0f0;
    padding: 8px;
`

export const ImageDiv = styled.div`
    display: flex;
    justify-content: center;
    width: 95%;
    margin: 0;
`