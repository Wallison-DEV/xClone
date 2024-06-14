import styled from "styled-components";

import {  breakpoints } from "../../styles";

export const Profile = styled.div`
    width: 600px;
    overflow-y: auto;
    max-height: 100vh;
    overflow-x: hidden;

    @media ( max-width: ${breakpoints.tablet}){
        width: 100%;
        margin-bottom: 72px;
    }
`

export const ProfilePicture = styled.div`
    position: relative;
    height: 200px;
    margin-bottom: 48px;
    width: 100%;
    background-size: cover;

    img {
        position: absolute;
        bottom: -30px;
        left: 30px;
        width: 124px;
        height: 124px;
        border: 3px solid #fff;
        border-radius: 50%;
    }
`;

export const HeaderButton = styled.div`
    position: absolute;
    bottom: -48px;
    right: 24px;

    .configureButton{
        background-size: cover;
        background-color: transparent;
        border: none;
        width: 32px;
        height: 32px;
        cursor: pointer;
    }
`

export const ProfileData = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 16px;

    h3{
        font-size: 20px;
        font-weight: 800;
    }
    p, span, h4 {
        color: ${(props)=> props.theme.corDoTextoSecundario};
        font-size: 15px;
        font-weight: 400;
    }
    div{
        > span {
            margin-right: 8px;
            >span {
                color: ${(props)=> props.theme.corDoTexto};
                font-weight: 700;
            }
            &:hover{
                text-decoration: underline;
                cursor: pointer;=
            }
        }
    }
`