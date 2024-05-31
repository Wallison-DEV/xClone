import { useTheme } from 'styled-components';
import { useDispatch } from 'react-redux';
import { useCallback, useState } from 'react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

import { calculateTimeUntilExpiration, scheduleTokenRefresh } from '../../Utils';
import { useDoLoginMutation } from '../../Services/api';

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
import ConfirmModal from '../ConfirmModal';

const Login = ({ checkAuthentication }: { checkAuthentication: () => Promise<void> }) => {
    const theme = useTheme()
    const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isEmail, setIsEmail] = useState(true);
    const [purchase] = useDoLoginMutation();
    const dispatch = useDispatch();

    const [isAppleOpen, setIsAppleOpen] = useState(false)

    const openModalApple = () => {
        setIsAppleOpen(true);
    };

    const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
        console.log(credentialResponse)
        try {
            const response = await fetch('https://wallison.pythonanywhere.com/accounts/auth/google/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                    clientId: credentialResponse.clientId,
                    select_by: credentialResponse.select_by,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const { access: accessToken, exp: tokenExp, refresh: refreshToken } = data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('accessTokenExp', tokenExp.toString());
                localStorage.setItem('refreshToken', refreshToken);
                const timeUntilExpiration = calculateTimeUntilExpiration(tokenExp);
                scheduleTokenRefresh(timeUntilExpiration, refreshToken, dispatch, 0);
                await checkAuthentication();
            } else {
                console.error('Erro ao fazer login com o Google:', response);
                setErrorMessage('Falha ao fazer login com o Google. Por favor, tente novamente mais tarde.');
            }
        } catch (error) {
            console.error('Erro ao fazer login com o Google:', error);
            setErrorMessage('Falha ao fazer login com o Google. Por favor, tente novamente mais tarde.');
        }
    };

    const handleLogin = useCallback(async () => {
        try {
            const requestBody: LoginRequestBody = { username_or_email: usernameOrEmail, password: password };
            const response = await purchase(requestBody).unwrap();
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
                            <div className='margin-24' >
                                <GoogleLogin
                                    logo_alignment='center'
                                    text='signin_with'
                                    width='298px'
                                    shape='pill'
                                    onSuccess={handleGoogleLogin}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                />
                            </div>
                            <Button variant='light' onClick={openModalApple}>
                                <img src={appleLogo} alt="" /> Fazer login com Apple
                            </Button>
                            <Separador>ou</Separador>
                            <S.InputDiv>
                                <span>E-mail ou nome de usuário</span>
                                <input id='name' type="text" value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} />
                            </S.InputDiv>
                            <S.FinalDiv>
                                <Button onClick={() => usernameOrEmail && usernameOrEmail != '' && (setIsEmail(false))} variant='dark' className="margin-24" type="submit">Avançar</Button>
                                <Button variant='light' >Esqueceu a senha?</Button>
                                <p>Não tem uma conta? <span onClick={() => { close; dispatch(openRegister()) }}>Inscreva-se</span></p>
                            </S.FinalDiv>
                        </ListDiv>
                    ) : (
                        <S.PasswordDiv>
                            <SecondTitle>Digite sua senha</SecondTitle>
                            <S.InputDiv>
                                <span style={{ cursor: 'auto' }}>E-mail ou nome de usuário</span>
                                <input id='name' type="text" value={usernameOrEmail} disabled />
                            </S.InputDiv>
                            <S.InputDiv>
                                <span >Senha</span>
                                <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </S.InputDiv>
                            {errorMessage && <S.Error>{errorMessage}</S.Error>}
                            <S.FinalDiv>
                                <Button variant='dark' className="margin-24" type="submit">Entrar</Button>
                                <p>Não tem uma conta? <span onClick={() => { close; dispatch(openRegister()) }}>Inscreva-se</span></p>
                            </S.FinalDiv>
                        </S.PasswordDiv>
                    )}
                </S.StyledForm>
            </S.LoginDiv>
            {
                isAppleOpen && (
                    <ConfirmModal
                        text='Desculpe, o login com Apple não está disponível no momento. Por favor, escolha outra forma de acesso.'
                        onClose={() => setIsAppleOpen(false)}
                    />
                )
            }
            <div className='overlay' onClick={close} />
        </Modal >
    )
}

export default Login