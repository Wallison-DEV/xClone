import { useTheme } from 'styled-components'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import appleLogo from '../../assets/icons/apple-logo.png'
import { CredentialResponse } from '@react-oauth/google';

import * as S from './styles'
import * as G from '../../styles'
import Button from '../../Components/Button'

import { openLogin, openRegister } from '../../Store/reducers/entry'
import { RootReducer } from '../../Store'
import Login from '../../Components/Login'
import Cadastro from '../../Components/Cadastro'
import ConfirmModal from '../../Components/ConfirmModal';
import { ConfirmDiv } from '../../Components/ConfirmModal/styles';

const Entrada = ({ checkAuthentication }: { checkAuthentication: () => Promise<void> }) => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const { loginOpen, registerOpen } = useSelector((state: RootReducer) => state.entry);
    const [isAppleOpen, setIsAppleOpen] = useState(false)
    const [isGoogleSuccess, setIsGoogleSuccess] = useState(false)
    const [isGoogleDuplicated, setIsGoogleDuplicated] = useState(false)

    const openModalApple = () => {
        setIsAppleOpen(true);
    };
    const openModalGoogleSuccess = () => {
        setIsGoogleSuccess(true);
    };
    const openModalGoogleDuplicated = () => {
        setIsGoogleDuplicated(true);
    };

    const handleGoogleSignup = async (credentialResponse: CredentialResponse) => {
        try {
            const response = await fetch('https://wallison.pythonanywhere.com/accounts/auth/register/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                    clientId: credentialResponse.clientId,
                    select_by: credentialResponse.select_by,
                }),
            });

            if (response.status === 201) {
                openModalGoogleSuccess();
            } else if (response.status === 409) {
                openModalGoogleDuplicated();
            } else {
                console.error('Erro ao registrar-se com Google:', response);
            }
        } catch (error) {
            console.error('Erro ao registrar-se com Google:', error);
        }
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
                                    onSuccess={handleGoogleSignup}
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
            {isGoogleDuplicated && <>
                <ConfirmModal text='Uma conta vinculada a este endereço de e-mail já existe. Por favor, tente fazer login em vez de criar uma nova conta.' onClose={() => setIsGoogleDuplicated(false)} />
            </>}
            {isGoogleSuccess && (
                <>
                    <G.Modal>
                        <ConfirmDiv>
                            <p>Peril criado com sucesso!</p>
                            <p>
                                <span onClick={() => { close(); dispatch(openLogin()); setIsGoogleSuccess(false); }}>Ir para a sessão de entrada</span>
                            </p>
                            <Button variant='light' onClick={() => setIsGoogleSuccess(false)}>Ok</Button>
                        </ConfirmDiv>
                        <div className='overlay' onClick={() => setIsGoogleSuccess(false)} />
                    </G.Modal>
                </>
            )}
        </div >
    );
};

export default Entrada;
