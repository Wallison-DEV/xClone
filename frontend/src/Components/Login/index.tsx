import { useTheme } from 'styled-components';
import { useDispatch } from 'react-redux';
import { useCallback, useState } from 'react';

import { calculateTimeUntilExpiration, scheduleTokenRefresh } from '../../Utils';
import { useDoLoginMutation } from '../../Services/api';

import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

import googleLogo from '../../assets/icons/google.png'
import appleLogo from '../../assets/icons/apple-logo.png'

interface LoginRequestBody {
    username_or_email: string;
    password: string;
}

import * as S from './styles';
import Button from '../Button';

import { Separador, ListDiv } from '../../Pages/Entrada/styles';
import { Modal, SecondTitle } from '../../styles';
import { closeModal, openRegister } from '../../Store/reducers/entry';

const Login = ({ checkAuthentication }: { checkAuthentication: () => Promise<void> }) => {
    const theme = useTheme()
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isEmail, setIsEmail] = useState(true);
    const [purchase] = useDoLoginMutation();
    const dispatch = useDispatch();

    const handleLogin = useCallback(async () => {
        try {
            const requestBody: LoginRequestBody = { username_or_email: usernameOrEmail, password: password };
            const response = await purchase(requestBody).unwrap();
            console.log('resposta do login', response)
            if (response.status == 400) {
                console.error('Error logging in:', response.error);
                setErrorMessage('Falha ao fazer login. Por favor, verifique suas credenciais.');
                return;
            }
            const { access: accessToken, exp: tokenExp, refresh: refreshToken } = response;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('accessTokenExp', tokenExp.toString());
            localStorage.setItem('refreshToken', refreshToken);
            const timeUntilExpiration = calculateTimeUntilExpiration(tokenExp);
            scheduleTokenRefresh(timeUntilExpiration, refreshToken, dispatch, 0);
            await checkAuthentication()
        } catch (error: any) {
            console.error('Error logging in:', error);
            setErrorMessage('Falha ao fazer login. Por favor, verifique suas credenciais.');
        }
    }, [purchase, dispatch, usernameOrEmail, password]);

    const handleGoogleSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        const token = response.code;
        if (token) {
            localStorage.setItem('accessToken', token);
            fetch('http://localhost:8000/accounts/auth/google/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            }).then(res => {
                if (res.ok) {
                    console.log('Login com Google realizado com sucesso!');
                    checkAuthentication()
                }
            }).catch(error => console.error('Erro ao logar com Google:', error));
        }
    };

    const handleGoogleFailure = (error: any) => {
        console.error('Google login failed:', error);
    };

    const openModalApple = () => {
        alert('Login com Apple não está disponível no momento, por favor, tente outro método');
    };

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        handleLogin();
    };

    const close = () => {
        dispatch(closeModal())
        setIsEmail(true)
    }

    return (
        <Modal>
            <S.LoginDiv>
                <S.FormHeader><span onClick={close}>x</span><img src={theme.xLogo} alt="" /></S.FormHeader>
                <S.StyledForm onSubmit={handleSubmit}>
                    {isEmail ? (
                        <ListDiv>
                            <SecondTitle>Entrar no X</SecondTitle>
                            <GoogleLogin
                                clientId="297868879617-fjhuhdhkuer3dkohs0cblra0q89emdpe.apps.googleusercontent.com"
                                onSuccess={handleGoogleSuccess}
                                onFailure={handleGoogleFailure}
                                cookiePolicy={'single_host_origin'}
                                render={renderProps => (
                                    <Button variant='light' className="margin-24" onClick={renderProps.onClick}>
                                        <img src={googleLogo} alt="" /> Entrar com Google
                                    </Button>
                                )}
                            />
                            <Button variant='light' onClick={openModalApple}>
                                <img src={appleLogo} alt="" /> Registrar-se com Apple
                            </Button>
                            <Separador>ou</Separador>
                            <S.InputDiv>
                                <span>E-mail ou nome de usuário</span>
                                <input type="text" value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} />
                            </S.InputDiv>
                            <S.FinalDiv>
                                <Button onClick={() => setIsEmail(false)} variant='dark' className="margin-24" type="submit">Avançar</Button>
                                <Button variant='light' >Esqueceu a senha?</Button>
                                <p>Não tem uma conta? <span onClick={() => { close; dispatch(openRegister()) }}>Inscreva-se</span></p>
                            </S.FinalDiv>
                        </ListDiv>
                    ) : (
                        <S.PasswordDiv>
                            <div>
                                <SecondTitle>Digite sua senha</SecondTitle>
                                <S.InputDiv>
                                    <span>E-mail ou nome de usuário</span>
                                    <input type="text" value={usernameOrEmail} disabled />
                                    {usernameOrEmail}
                                </S.InputDiv>
                                <S.InputDiv>
                                    <span>Senha</span>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    {password}
                                </S.InputDiv>
                                {errorMessage && <S.Error>{errorMessage}</S.Error>}
                            </div>
                            <S.FinalDiv>
                                <Button variant='dark' className="margin-24" type="submit">Entrar</Button>
                                <p>Não tem uma conta? <span onClick={() => { close; dispatch(openRegister()) }}>Inscreva-se</span></p>
                            </S.FinalDiv>
                        </S.PasswordDiv>
                    )}
                </S.StyledForm>
            </S.LoginDiv>
            <div className='overlay' onClick={close} />
        </Modal>
    )
}

export default Login