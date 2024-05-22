import styled from "styled-components";

import { Colors } from "../../styles";
import { ButtonStyle } from "../Button/styles";

export const Profile = styled.div`
    position: relative;
    cursor: pointer;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    border: none;
    background-color: transparent;
    border-bottom: 1px solid ${Colors.lightgray};

    ${ButtonStyle}{
        position: absolute;
        top: 50%;
        right: 12px; 
        transform: translateY(-50%); 
    }

    >div {
        display: flex;
        font-size: 16px;
        width: 100%;
        padding: 20px 12px;

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
    &:first-of-type {
        margin-top: 8px;
    }

`