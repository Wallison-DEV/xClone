import { useDispatch } from 'react-redux';
import { useCallback, useState } from 'react';

import { calculateTimeUntilExpiration, scheduleTokenRefresh } from '../../Utils';
import { useDoLoginMutation } from '../../Services/api';
import { updateTokens } from '../../Store/reducers/token'

import XLogo from '../../assets/img/twitter-logo.png'
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

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isEmail, setIsEmail] = useState(true);
    const [purchase, { isError, error }] = useDoLoginMutation();
    const dispatch = useDispatch();

    const handleLogin = useCallback(async () => {
        try {
            const requestBody: LoginRequestBody = { username_or_email: usernameOrEmail, password: password };
            const response = await purchase(requestBody).unwrap();
            if (isError) {
                console.error('Error logging in:', error);
                setErrorMessage('Falha ao fazer login. Por favor, verifique suas credenciais.');
                return;
            }
            const { access: accessToken, exp: tokenExp, refresh: refreshToken } = response;
            dispatch(updateTokens({ accessToken: accessToken, accessTokenExp: tokenExp, refreshToken: refreshToken }))
            const timeUntilExpiration = calculateTimeUntilExpiration(tokenExp);
            scheduleTokenRefresh(timeUntilExpiration, refreshToken, dispatch);
        } catch (error: any) {
            console.error('Error logging in:', error.message);
            setErrorMessage('Falha ao fazer login. Por favor, verifique suas credenciais.');
        }
    }, [purchase, isError, error, dispatch, usernameOrEmail, password]);

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
                <S.FormHeader><span onClick={close}>x</span><img src={XLogo} alt="" /></S.FormHeader>
                <S.StyledForm onSubmit={handleSubmit}>
                    {isEmail ? (
                        <ListDiv>
                            <SecondTitle>Entrar no X</SecondTitle>
                            <Button variant='light' className="margin-24">
                                <img src={googleLogo} alt="" /> Inscrever-se no Google
                            </Button>
                            <Button variant='light'>
                                <img src={appleLogo} alt="" /> Inscrever-se no Apple
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
                                </S.InputDiv>
                                <S.InputDiv>
                                    <span>Senha</span>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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