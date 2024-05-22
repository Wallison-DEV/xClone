import styled from "styled-components";
import { ButtonStyle } from "../Button/styles";
import { breakpoints } from "../../styles";

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
        color: ${(props)=> props.theme.corDoTextoSecundario};
    }

    img {
        width: 24px;
        margin-right: 8px;
        border-radius: 50%;
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
        gap: 6px;
        button {
            background: none;
            border: none;
            cursor: pointer;
            .like-button {
                width: 14px;
                height: 14px;
                transition: transform 0.2s ease-in-out;
                transform: scale(1);
            }
            .liked {
                color: red;
                width: 16px;
                height: 16px;
                transition: transform 0.2s ease-in-out;
                transform: scale(1.2);
            }
        }
    }
`

export const PostDiv = styled.div`
    width: 100%;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
    font-size: 16px;

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
            bottom: 24px;
            right: 0;
            background: #fff;
            border-radius: 12px;
            box-shadow: 2px 4px 4px 2px rgba(0, 0, 0, 0.2);
        }

        ${ButtonStyle}{
            padding: 12px 0;
            background: #fff;
            z-index: 1;
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

    header {
        position: relative;
        .retweet-div{
            .options-div {
                bottom: 36px; 
                right: 12px;
            }
        }
        .more-options-btn {
            position: absolute; 
            right: 12px;
            bottom: 16px;
            cursor: pointer;
        }
    }
`

export const ImageDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    img, video {
        width: 516px;
        height: 290px;
    }
`