import styled from "styled-components";
import {breakpoints } from "../../styles";
import { ButtonStyle } from "../Button/styles";
import { NavLink } from 'react-router-dom';

export const ThemeToggleButton = styled.button`
    background: none;
    padding: 0 16px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${(props) => props.theme.corDoTextoSecundario};
    transition: color 0.3s;

    &:hover {
        color: ${(props) => props.theme.corPrincipal};
    }
`;

export const TemaIcone = styled.span<{ isDarkTheme: boolean }>`
    display: flex;
    align-items: center;
    font-size: 20px;
    transition: transform 0.3s; 
    transform: rotate(${(props) => (props.isDarkTheme ? '0deg' : '180deg')});
`;

export const ItemAside = styled(NavLink)`
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 50px;
    gap: 8px;
    border-radius: 24px;
    text-align: start;
    font-size: 20px;
    font-weight: bold;

    &:hover {
        background-color: ${(props)=> props.theme.corDoHover};
    }

    &.active {
        background-color: ${(props)=> props.theme.corDoHover};
    }
`

export const LeftAside = styled.aside`
    position: sticky;
    top: 0;
    left: 0;
    width: 220px;
    border-right: solid 1px #ccc;
    height: 100vh;
    padding-top: 16px;
    
    >div{
        position: relative;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding-right: 8px;

        >div{
            position: absolute;
            top: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
    }

    .post-icon{
        display: none;
    }
    ${ButtonStyle}{
        p{
            color: #fff;
        }
    }

    @media( max-width: ${breakpoints.desktop}){
        width: 78px;

        .userInfos, p{
            display: none;
        }
        .post-icon{
            display: flex;
        }
        ${ItemAside}{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 4px;
        }
    }
    @media( max-width: ${breakpoints.tablet}){
        position: fixed;
        display: flex;
        align-items: center;
        padding-top: 8px;
        top: auto;
        bottom: 0;
        left: 0;
        height: 58px;
        width: 100%;
        z-index: 1000;
        box-shadow: ${(props)=> props.theme.boxShadow};
        border: none;

        >div{
            height: auto;
            width: 100%;
            >div{
                width: 100%;
                position: relative;
                height: auto;
                display: flex;
                align-items: center;
                flex-direction: row;
                justify-content: space-around;
                gap-column: 12px;
                margin-bottom: 8px;
            }
        }

        ${ItemAside}, ${ButtonStyle}{
            width: 40px;
        }
    }
`

export const ProfileDiv = styled.div`
    margin-top: auto;
    margin-bottom: 24px;
    position: relative;

    @media(max-width: ${breakpoints.desktop}){
        margin: 0;
        display: flex;
        align-items: center;
        button{
            margin: 0;
        }
    }
`

export const MyProfile = styled.button`
    position: relative;
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20px;
    align-items: center;
    border-radius: 32px;
    padding: 12px;
    border: none;
    background-color: transparent;

    >div{
        display: flex;
        font-size: 16px;

        p {
            font-weight: 700;
        }

        span {
            font-weight: 400;
            color: ${(props)=> props.theme.corDoTextoSecundario};
        }

        img{
            width: 40px;
            height: 40px;
            margin-right: 12px;
            border-radius: 50%;
        }
    }

    > span {
        font-size: 24px;
        font-weight: bold;
    }

    &:hover{
        background-color: ${(props)=> props.theme.corDoHover};
    }

    @media (max-width: ${breakpoints.desktop}){
        padding: 4px;
        >div img {
            width: 40px;
            height: 40px;
            margin: 0;
        }

        & > span:last-child{
            display: none;
        }
    }
`

export const ExitButton = styled(ButtonStyle)<Omit<ButtonProps, 'variant'>>`
    z-index: 1;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
    min-width: 180px;
    margin-bottom: 16px;
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;

    @media(max-width: ${breakpoints.tablet}){
        right: 0; 
        left: auto;
    }
`