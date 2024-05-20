import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Entrada from './Pages/Entrada';
import Home from './Pages/Home';
import { verifyAuthenticated } from './Utils';
import Profile from './Pages/Profile';

import ProfileAside from './Components/ProfilesAside';
import NavAside from './Components/NavAside';
import Search from './Pages/Search';

import { Container } from './styles';
import Post from './Pages/Post';
import { RootReducer } from './Store';
import { falseValidate, trueValidate } from './Store/reducers/entry';

const Rotas = () => {
    const isAuthenticated = useSelector((state: RootReducer) => state.entry.isValidate);
    const dispatch = useDispatch();

    const checkAuthentication = async () => {
        const accessToken = localStorage.getItem('accessToken');
        const accessTokenExp = localStorage.getItem('accessTokenExp');
        try {
            const isSuccess = await verifyAuthenticated(accessToken, accessTokenExp);
            if (isSuccess) {
                console.log('Autenticação bem-sucedida');
                dispatch(trueValidate());
            } else {
                console.log('Falha na autenticação');
                dispatch(falseValidate());
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            dispatch(falseValidate());
        }
    };

    useEffect(() => {
        checkAuthentication();

        const handleStorageChange = () => {
            window.addEventListener('storage', checkAuthentication);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        }
    }, []);

    return (
        <>
            {isAuthenticated && (
                <Container>
                    <NavAside />
                    < >
                        <Routes>
                            <Route path="/home" element={<Home />} />
                            <Route path="/profile/:id" element={<Profile />} />
                            <Route path="/post/:id" element={<Post />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="*" element={<Navigate to="/home" />} />
                        </Routes>
                    </>
                    <ProfileAside />
                </Container>
            )}
            {!isAuthenticated && (
                <Routes>
                    <Route path="/login" element={<Entrada />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            )}
        </>
    );
};

export default Rotas;
