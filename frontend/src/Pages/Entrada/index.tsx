import { useDispatch, useSelector } from 'react-redux'

import XLogo from '../../assets/img/twitter-logo.png'
import googleLogo from '../../assets/icons/google.png'
import appleLogo from '../../assets/icons/apple-logo.png'

import * as S from './styles'
import * as G from '../../styles'
import Button from '../../Components/Button'

import { openLogin, openRegister } from '../../Store/reducers/entry'
import { RootReducer } from '../../Store'
import Login from '../../Components/Login'
import Cadastro from '../../Components/Cadastro'

const Entrada = () => {
    const dispatch = useDispatch()
    const { loginOpen, registerOpen } = useSelector((state: RootReducer) => state.entry);

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
                    <div className='flex-end'><img className="logoImg" src={XLogo} alt="" /></div>
                    <div className="loginDiv">
                        <S.ListDiv>
                            <G.PrimaryTitle className='margin-24'>Acontecendo agora</G.PrimaryTitle>
                            <G.SecondTitle>Inscreva-se Hoje</G.SecondTitle>
                            <S.InputsDiv>
                                <Button variant='light' className="margin-24">
                                    <img src={googleLogo} alt="" /> Inscrever-se no Google
                                </Button>
                                <Button variant='light'>
                                    <img src={appleLogo} alt="" /> Inscrever-se com Apple
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
            </div>
            {loginOpen && <Login />}
            {registerOpen && <Cadastro />}
        </div>
    );
};

export default Entrada;
