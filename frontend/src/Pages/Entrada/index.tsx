import { useTheme } from 'styled-components'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import appleLogo from '../../assets/icons/apple-logo.png'

import * as S from './styles'
import * as G from '../../styles'
import Button from '../../Components/Button'

import { openLogin, openRegister } from '../../Store/reducers/entry'
import { RootReducer } from '../../Store'
import Login from '../../Components/Login'
import Cadastro from '../../Components/Cadastro'
import ConfirmModal from '../../Components/ConfirmModal';

const Entrada = ({ checkAuthentication }: { checkAuthentication: () => Promise<void> }) => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const { loginOpen, registerOpen } = useSelector((state: RootReducer) => state.entry);
    const [isAppleOpen, setIsAppleOpen] = useState(false)
    const [isGoogleOpen, setIsGoogleOpen] = useState(false)

    const openModalApple = () => {
        setIsAppleOpen(true);
    };
    const openModalGoogle = () => {
        setIsGoogleOpen(true);
    };

    const logOpen = () => {
        dispatch(openLogin());
    };

    const regOpen = () => {
        dispatch(openRegister());
    };

    return (
        <div>
            <div className='container'>
                <S.EntryDiv>
                    <div className='flex-end'><img className="logoImg" src={theme.xLogo} alt="" /></div>
                    <div className="loginDiv">
                        <S.ListDiv>
                            <G.PrimaryTitle className='margin-24'>Acontecendo agora</G.PrimaryTitle>
                            <G.SecondTitle>Inscreva-se Hoje</G.SecondTitle>
                            <S.InputsDiv>
                                <S.StyledRegButton
                                    text="signup_with"
                                    onSuccess={async (credentialResponse) => {
                                        try {
                                            const response = await fetch('http://localhost:8000/accounts/auth/register/google', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    token: credentialResponse.credential,
                                                }),
                                            });
                                            console.log(response)
                                            if (response.ok) {
                                                dispatch(openLogin());
                                            } else {
                                                console.error('Erro ao registrar-se com Google:', response);
                                            }
                                        } catch (error) {
                                            console.error('Erro ao registrar-se com Google:', error);
                                        }
                                    }}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                />
                                <Button variant='light' onClick={openModalApple}>
                                    <img src={appleLogo} alt="" /> Registrar-se com Apple
                                </Button>
                                <S.Separador>ou</S.Separador>
                                <div>
                                    <Button variant='lightblue' onClick={regOpen}>Criar Conta</Button>
                                    <S.PrivacyPolicy>
                                        Ao se inscrever, você concorda com os
                                        <a href="https://twitter.com/tos" rel="noopener noreferrer nofollow" target="_blank" role="link">
                                            <span>Termos de Serviço </span>
                                        </a>
                                        e a <a href="https://twitter.com/privacy" rel="noopener noreferrer nofollow" target="_blank" role="link">
                                            <span>Política de Privacidade</span>
                                        </a>
                                        , incluindo o
                                        <a href="https://help.twitter.com/rules-and-policies/twitter-cookies" rel="noopener noreferrer nofollow" target="_blank" role="link">
                                            <span >Uso de Cookies</span>
                                        </a>.
                                    </S.PrivacyPolicy>
                                </div>
                                <div className='w-100'>
                                    <G.TertiaryTitle>Já tem uma conta?</G.TertiaryTitle>
                                    <Button variant='light' className='text-blue' onClick={logOpen}>Entrar</Button>
                                </div>
                            </S.InputsDiv>
                        </S.ListDiv>
                    </div>
                </S.EntryDiv>
            </div >
            {loginOpen && <Login checkAuthentication={checkAuthentication} />}
            {registerOpen && <Cadastro />}
            {isAppleOpen && <>
                <ConfirmModal text='Desculpe, o registro com Apple não está disponível no momento. Por favor, escolha outra forma de cadastro.' onClose={() => setIsAppleOpen(false)} />
            </>}
            {isGoogleOpen && <>
                <ConfirmModal text='Desculpe, o registro com Google não está disponível no momento. Por favor, escolha outra forma de cadastro.' onClose={() => setIsGoogleOpen(false)} />
            </>}
        </div >
    );
};

export default Entrada;
