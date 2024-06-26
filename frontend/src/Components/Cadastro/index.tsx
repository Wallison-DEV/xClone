import { useDispatch } from "react-redux";
import { useState } from "react";
import Button from "../Button";
import { FormHeader, InputDiv, LoginDiv, StyledForm, PasswordDiv, FinalDiv } from "../Login/styles";
import { Modal, SecondTitle } from "../../styles";
import { closeModal, openLogin } from "../../Store/reducers/entry";

import XLogo from '../../assets/img/twitter-logo.png'
import { ConfirmDiv } from "../ConfirmModal/styles";

const Cadastro = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [arroba, setArroba] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const formData = { username, email, arroba, password };
        try {
            const response = await fetch('https://wallison.pythonanywhere.com/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsModalSuccessOpen(true)
                setEmail('')
                setUsername('')
                setArroba('')
                setPassword('')
            } else {
                const data = await response.json();
                alert(`Erro ao registrar perfil: ${data.error} - ${email} - ${username} - ${arroba} - ${password}`);
            }
        } catch (error) {
            setErrorMessage('Falha ao fazer registro.Por favor, verifique suas credenciais.');
            alert('Ocorreu um erro ao registrar o perfil. Por favor, tente novamente.');
        }
    };

    const close = () => {
        dispatch(closeModal())
    }

    return (
        <Modal>
            <LoginDiv>
                <FormHeader><span onClick={close}>x</span><img src={XLogo} alt="" /></FormHeader>
                <StyledForm onSubmit={handleSubmit}>
                    <PasswordDiv>
                        <SecondTitle>Inscreva-se Hoje</SecondTitle>
                        <InputDiv>
                            <span>Nome de usuário</span>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </InputDiv>
                        <InputDiv>
                            <span>Email:</span>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </InputDiv>
                        <InputDiv>
                            <span>Arroba</span>
                            <input type="text" value={arroba} onChange={(e) => setArroba(e.target.value)} required />
                        </InputDiv>
                        <InputDiv>
                            <span>Senha:</span>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </InputDiv>
                        <FinalDiv>
                            <Button variant='dark' className="margin-24" type="submit">Registrar</Button>
                            <p>Já possui uma conta? <span onClick={() => { close; dispatch(openLogin()) }}>Entrar</span></p>
                        </FinalDiv>
                        {errorMessage && <p>{errorMessage}</p>}
                    </PasswordDiv>
                </StyledForm>
            </LoginDiv>
            {isModalSuccessOpen && (
                <>
                    <Modal>
                        <ConfirmDiv>
                            <p>Peril criado com sucesso!</p>
                            <p>
                                <span onClick={() => { close(); dispatch(openLogin()); setIsModalSuccessOpen(false); }}>Ir para a sessão de entrada</span>
                            </p>
                            <Button variant='light' onClick={() => setIsModalSuccessOpen(false)}>Ok</Button>
                        </ConfirmDiv>
                        <div className='overlay' onClick={() => setIsModalSuccessOpen(false)} />
                    </Modal>
                </>
            )}
            <div className='overlay' onClick={close} />
        </Modal >
    )
}

export default Cadastro