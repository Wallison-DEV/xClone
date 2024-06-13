import styled from "styled-components";

import { InputDiv, LoginDiv } from "../Login/styles";
import { SecondTitle, breakpoints } from "../../styles";
import { ButtonStyle } from "../Button/styles";
import { convertUrl } from "../../Utils";

interface BackgroundImgProps {
    background?: string | File | null; 
}

export const ProfileModal = styled(LoginDiv)`
    padding: 32px;
    height: 100%;
    overflow-y: scroll;
    position: relative;

    ${SecondTitle}{
        margin-bottom: 8px;
    }

    div{
        display: flex;
        flex-direction: column;
        gap: auto;
        width: 100%;
        align-items: center;
    }

    ${ButtonStyle} {
        position: absolute;
        bottom: 16px;
        width: calc(100% - 64px);
    }

    @media (max-width: ${breakpoints.desktop}){
        margin-bottom: 40px;
    }
`
export const BackgroundImg = styled.div<BackgroundImgProps>`
    position: relative;
    padding: 12px;
    margin-top: 24px;
    ${(props) => props.background &&
        `background: url(${typeof props.background === 'string' ? convertUrl(props.background) : URL.createObjectURL(props.background)});
    `}    
    ${(props) => !props.background &&
        `background-color: rgb(207, 217, 222);`
    }
    background-size: cover;
    
    img{
        height: 200px;
        width: 200px;
    }

    input {
        display: none;
    }

    label {
        z-index: 1;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        background : rgba( 1, 1, 1 , 0.3);
        border-radius: 50%;
        height: 44px;
        width: 44px;
        cursor: pointer;
    }
`
export const AbsoluteImg = styled.div`
    position: relative;
    padding: 12px;
    
    img{
        height: 200px;
        width: 200px;
        border-radius: 50%;
    }

    input {
        display: none;
    }

    label {
        z-index: 1;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        background : rgba( 1, 1, 1 , 0.3);
        border-radius: 50%;
        height: 44px;
        width: 44px;
        cursor: pointer;
    }
`

export const EditingDiv = styled.div`
    padding: 24px 24px 0;
    gap: 8px;
    height: 100%;
`

export const BackgroundSelect = styled.div`
    ${BackgroundImg}{
        height: 168px;
        margin-top: 24px;
    }
    .dataProfile {
        display: flex;
        flex-direction: row;
        padding-top: 16px;
        padding-bottom: 24px;
        div{
            align-items: start;
            padding-left: 12px;
            padding-top: 24px;
        }
        img {
            border-radius: 50%;
        }
        p{
            font-size: 1rem;
            font-weight: bold;
        }
    }
    ${ButtonStyle} {
        margin-top: 12px;
        position: relative;
        bottom: 0;
        width: 100%;
    }
`

export const BioSelect = styled.div`
    ${InputDiv}{
        width: 100%;
        margin-top: 24px;
        height: 100%;
        textarea{
            height: 100px;
            resize: none;
        }
    } 
`