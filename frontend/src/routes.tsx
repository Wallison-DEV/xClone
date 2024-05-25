import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Entrada from './Pages/Entrada';
import Home from './Pages/Home';
import { verifyAuthenticated } from './Utils';
import Profile from './Pages/Profile';

import ProfileAside from './Components/ProfilesAside';
import NavAside from './Components/NavAside';
import Search from './Pages/Search';

import { Container } from './styles';
import Post from './Pages/Post';

type RotasProps = {
    togleTheme: () => void;
    isDarkTheme: boolean;
}

const Rotas = ({ togleTheme, isDarkTheme }: RotasProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthentication = async () => {
        const accessToken = localStorage.getItem('accessToken');
        const accessTokenExp = localStorage.getItem('accessTokenExp');
        console.log('tentou check')
        try {
            const isSuccess = await verifyAuthenticated(accessToken, accessTokenExp);
            if (isSuccess) {
                console.log('Autenticação bem-sucedida');
                setIsAuthenticated(true);
            } else {
                console.log('Falha na autenticação');
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <>
            {isAuthenticated && (
                <Container>
                    <NavAside checkAuthentication={checkAuthentication} isDarkTheme={isDarkTheme} togleTheme={togleTheme} />
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
                    <Route path="/login" element={<Entrada checkAuthentication={checkAuthentication} />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            )}
        </>
    );
};

export default Rotas;
