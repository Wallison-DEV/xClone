import { useDispatch, useSelector } from 'react-redux'

import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

import googleLogo from '../../assets/icons/google.png'
import appleLogo from '../../assets/icons/apple-logo.png'

import * as S from './styles'
import * as G from '../../styles'
import Button from '../../Components/Button'

import { openLogin, openRegister } from '../../Store/reducers/entry'
import { RootReducer } from '../../Store'
import Login from '../../Components/Login'
import Cadastro from '../../Components/Cadastro'
import { useTheme } from 'styled-components'

const Entrada = ({ checkAuthentication }: { checkAuthentication: () => Promise<void> }) => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const { loginOpen, registerOpen } = useSelector((state: RootReducer) => state.entry);

    const handleGoogleSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        const token = response.code;
        fetch('http://localhost:8000/accounts/auth/register/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        }).then(res => {
            if (res.ok) {
                dispatch(openLogin());
                console.log('Registro com Google realizado com sucesso!');
            }
        }).catch(error => console.error('Erro ao registrar-se com Google:', error));
    };

    const handleGoogleFailure = (error: any) => {
        console.error('Google register failed:', error);
    };

    const openModalApple = () => {
        alert('Registro com Apple não está disponível no momento, por favor, tente outro método');
    };

    const logOpen = () => {
        console.log('Abrindo modal de login...');
        dispatch(openLogin());
    };

    const regOpen = () => {
        console.log('Abrindo modal de cadastro...');
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
                                <GoogleLogin
                                    clientId="297868879617-fjhuhdhkuer3dkohs0cblra0q89emdpe.apps.googleusercontent.com"
                                    onSuccess={handleGoogleSuccess}
                                    onFailure={handleGoogleFailure}
                                    cookiePolicy={'single_host_origin'}
                                    render={renderProps => (
                                        <Button variant='light' className="margin-24" onClick={renderProps.onClick}>
                                            <img src={googleLogo} alt="" /> Registrar-se com Google
                                        </Button>
                                    )}
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
        </div >
    );
};

export default Entrada;
