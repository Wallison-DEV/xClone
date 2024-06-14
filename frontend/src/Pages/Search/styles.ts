import styled from "styled-components";
import { breakpoints } from "../../styles";

export const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 600px;
    padding: 12px;
    overflow-y: auto;

    @media ( max-width: ${breakpoints.tablet}){
        margin-bottom: 72px;
        width: 100%;
    }
    
    input {
        border-radius: 24px;
        padding: 12px 20px;
        background-color: rgb(239, 243, 244);
        border: none;
        outline: none;
        font-size: 16px;
        margin-bottom: 12px;
    }
`
export const ResultsContainer = styled.div`
    overflow-y: auto;
    max-height: calc(100vh - 120px); 
    margin-right: 8px;
    
    @media (max-width: ${breakpoints.tablet}){
        max-height: calc(100vh - 180px); 
    }
`;