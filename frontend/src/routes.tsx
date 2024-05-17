import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Entrada from './Pages/Entrada';
import Home from './Pages/Home';
import { verifyAuthenticated } from './Utils';
import { clearTokens } from './Store/reducers/token';
import { RootReducer } from './Store';
import Profile from './Pages/Profile';

import ProfileAside from './Components/ProfilesAside'
import NavAside from './Components/NavAside'
import Search from './Pages/Search';

import { Container } from './styles';
import Post from './Pages/Post';

const Rotas = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = useSelector((state: RootReducer) => state.token);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                if (token && token.accessTokenExp) {
                    const isAuthenticated = await verifyAuthenticated(token);
                    setIsAuthenticated(!!isAuthenticated);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error verifying authentication:', error);
                setIsAuthenticated(false);
                dispatch(clearTokens());
            }
        };
        checkAuthentication();
    }, [token, dispatch]);

    return (
        <>
            {isAuthenticated && (
                <Container>
                    <NavAside />
                    <div className="min-width">
                        <Routes>
                            <Route path="/home" element={<Home />} />
                            <Route path="/profile/:id" element={<Profile />} />
                            <Route path="/post/:id" element={<Post />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="*" element={<Navigate to="/home" />} />
                        </Routes>
                    </div>
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
