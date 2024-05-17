import styled from "styled-components";

import configureIcon from '../../assets/icons/configuration.png'
import { Colors, breakpoints } from "../../styles";

export const Profile = styled.div`
    grid-column: 2 / 3; 
    width: 100%;

    @media ( max-width: ${breakpoints.tablet}){
        margin-bottom: 72px;
    }
`

export const ProfilePicture = styled.div`
    position: relative;
    background-color: gray;
    height: 200px;
    margin-bottom: 48px;
    width: 100%;

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
        background-image : url(${configureIcon});
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
        color: rgb(83, 100, 113);
        font-size: 15px;
        font-weight: 400;
    }
    div{
        > span {
            margin-right: 8px;
            >span {
                color: ${Colors.black};
                font-weight: 700;
            }
            &:hover{
                text-decoration: underline;
                cursor: pointer;=
            }
        }
    }
`