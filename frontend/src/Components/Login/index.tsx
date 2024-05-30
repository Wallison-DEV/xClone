import { useTheme } from 'styled-components';
import { useDispatch } from 'react-redux';
import { useCallback, useState } from 'react';

import { calculateTimeUntilExpiration, scheduleTokenRefresh } from '../../Utils';
import { useDoLoginMutation } from '../../Services/api';

import googleLogo from '../../assets/icons/google.png'
import appleLogo from '../../assets/icons/apple-logo.png'

interface LoginRequestBody {
    username_or_email: string;
    password: string;
}

import * as S from './styles';
import Button from '../Button';

import { Separador, ListDiv, StyledRegButton } from '../../Pages/Entrada/styles';
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
    const [isGoogleOpen, setIsGoogleOpen] = useState(false)

    const openModalApple = () => {
        setIsAppleOpen(true);
    };
    const openModalGoogle = () => {
        setIsGoogleOpen(true);
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

    // const handleGoogleSuccess = useCallback(async (credentialResponse: CredentialResponse) => {
    //     const idToken = credentialResponse.credential;
    //     try {
    //         const response = await fetch('https://wallison.pythonanywhere.com/accounts/auth/login/google', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ token: idToken }),
    //         });
    //         if (!response.ok) {
    //             console.error('Error logging in with Google:', response.statusText);
    //             setErrorMessage('Falha ao fazer login com Google. Tente novamente.');
    //             return;
    //         }
    //         const responseData = await response.json();
    //         const { access: accessToken, exp: tokenExp, refresh: refreshToken } = responseData;
    //         localStorage.setItem('accessToken', accessToken);
    //         localStorage.setItem('accessTokenExp', tokenExp.toString());
    //         localStorage.setItem('refreshToken', refreshToken);
    //         await checkAuthentication();
    //     } catch (error) {
    //         console.error('Error logging in with Google:', error);
    //         setErrorMessage('Falha ao fazer login com Google. Tente novamente.');
    //     }
    // }, [checkAuthentication]);

    // const handleGoogleFailure = () => {
    //     console.error('Google login failed');
    //     setErrorMessage('Falha na autenticação com Google.');
    // };

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
                            <StyledRegButton
                                text="signup_with"
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        const response = await fetch('http://localhost:8000/accounts/auth/google/login', {
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
                                        console.log(response)
                                        if (response.ok) {
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
            {isAppleOpen && (
                <ConfirmModal
                    text='Desculpe, o login com Apple não está disponível no momento. Por favor, escolha outra forma de acesso.'
                    onClose={() => setIsAppleOpen(false)}
                />
            )}
            {isGoogleOpen && (
                <ConfirmModal
                    text='Desculpe, o login com Google não está disponível no momento. Por favor, escolha outra forma de acesso.'
                    onClose={() => setIsGoogleOpen(false)}
                />
            )}
            <div className='overlay' onClick={close} />
        </Modal>
    )
}

export default Login