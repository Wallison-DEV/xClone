import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { checkingAuthentication, authenticationSuccess, authenticationFailed } from './Store/reducers/entry';
import { verifyAuthenticated } from './Utils';

import ProfileAside from './Components/ProfilesAside';
import NavAside from './Components/NavAside';

import Profile from './Pages/Profile';
import Entrada from './Pages/Entrada';
import Search from './Pages/Search';
import Post from './Pages/Post';
import Home from './Pages/Home';

import { Container } from './styles';

type RotasProps = {
    togleTheme: () => void;
    isDarkTheme: boolean;
}

const Rotas = ({ togleTheme, isDarkTheme }: RotasProps) => {
    const dispatch = useDispatch();
    const { isAuthenticated, checkAuth } = useSelector((state: any) => state.entry);

    const checkAuthentication = async () => {
        dispatch(checkingAuthentication());
        const accessToken = localStorage.getItem('accessToken');
        const accessTokenExp = localStorage.getItem('accessTokenExp');
        try {
            const reponse = await verifyAuthenticated(accessToken, accessTokenExp);
            if (reponse) {
                dispatch(authenticationSuccess());
            } else {
                dispatch(authenticationFailed());
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            dispatch(authenticationFailed());
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, [checkAuth]);
    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <>
            {isAuthenticated && (
                <Container>
                    <NavAside checkAuthentication={checkAuthentication} isDarkTheme={isDarkTheme} togleTheme={togleTheme} />
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/profile/:id" element={<Profile />} />
                        <Route path="/post/:id" element={<Post />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="*" element={<Navigate to="/home" />} />
                    </Routes>
                    <ProfileAside />
                </Container>
            )}
            {!isAuthenticated && (
                <Routes>
                    <Route path="/login" element={<Entrada checkAuthentication={checkAuthentication} />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            )}
        </>
    );
};

export default Rotas;
