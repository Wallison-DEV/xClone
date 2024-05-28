import { useTheme } from 'styled-components'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// import { GoogleLogin } from '@react-oauth/google';

import googleLogo from '../../assets/icons/google.png'
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

    // const handleGoogleSuccess = (credentialResponse: any) => {
    //     fetch('http://localhost:8000/accounts/auth/register/google', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ token: credentialResponse.credential }),
    //     }).then(res => {
    //         if (res.ok) {
    //             dispatch(openLogin());
    //             console.log('Registro com Google realizado com sucesso!');
    //         }
    //     }).catch(error => {
    //         console.error('Erro ao registrar-se com Google:', error);
    //     });
    // };
    // const handleGoogleFailure = () => {
    //     console.error('Google login failed');
    // };

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
                                <Button variant='light' className="margin-24" onClick={openModalGoogle}>
                                    <img src={googleLogo} alt="" /> Registrar-se com Google
                                </Button>
                                {/* <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} text='signup_with' /> */}
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
