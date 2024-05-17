import styled from "styled-components";
import { Colors } from "../../styles";

export const ButtonStyle = styled.button<Omit<ButtonProps, 'children'| 'type' | 'className'>>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: ${(props) => (props.maxwidth ? `${props.maxwidth}` : '100%')};
    padding: 8px;
    height: 38px;
    border-radius: 25px;
    color: ${(props) => {
            switch (props.variant) {
                case 'dark':
                    return `${Colors.white}`;
                case 'lightblue':
                    return `${Colors.white}`;
                default:
                    return `${Colors.black}`;
            }
        }
    };
    background-color: ${(props) => {
            switch (props.variant) {
                case 'dark':
                    return `${Colors.black}`;
                case 'lightblue':
                    return `${Colors.blue}`;
                default:
                    return `${Colors.white}`;
            }
        }
    };
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    border: solid 1px ${(props) => (props.variant === 'light' ? Colors.lightgray : 'none')};

    img{
        height: 18px;
        width: 18px;
        margin-right: 4px;  
    }

    &:hover {
        background-color: ${(props) => {
            switch (props.variant) {
                case 'dark':
                    return '#111';
                case 'lightblue':
                    return `${Colors.lightblue}`;
                default:
                    return '#eee';
            }
        }
    }
`

export const ButtonLink = styled(ButtonStyle).attrs({ as: 'a' })`
    text-decoration: none;
`