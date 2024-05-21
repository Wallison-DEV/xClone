import { Dispatch } from 'react';

import { clearFollowed, updateFollowedProfiles } from '../Store/reducers/profile';

export const calculateTimeUntilExpiration = (expirationTimeInSeconds: number) => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return expirationTimeInSeconds - nowInSeconds;
};

// export const scheduleTokenRefresh = async (timeUntilExpiration: number, refreshToken: string, dispatch: Dispatch<any>, attempt: number) => {
//     if (timeUntilExpiration < 3 || attempt >= 3) {
//         console.error('Máximo de tentativas de renovação alcançado.');
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         localStorage.removeItem("accessTokenExp");
//         window.location.reload()
//         dispatch(clearFollowed());
//         return;
//     }
//     setTimeout(async () => {
//         const refresh = refreshToken;
//         if (refresh) {
//             try {
//                 const response = await fetch('http://localhost:8000/api/token/refresh/', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ refresh: refresh }),
//                 });
//                 if (response.ok) {
//                     const data = await response.json();
//                     const newAccessToken = data.access;
//                     const newTokenExp = data.exp;
//                     const updatedRefreshToken = refresh;
//                     localStorage.setItem('accessToken', newAccessToken);
//                     localStorage.setItem('accessTokenExp', newTokenExp);
//                     localStorage.setItem('refreshToken', updatedRefreshToken);
//                     const updatedTimeUntilExpiration = calculateTimeUntilExpiration(newTokenExp);
//                     scheduleTokenRefresh(updatedTimeUntilExpiration, updatedRefreshToken, dispatch, 0);
//                 } else {
//                     console.error('Falha ao renovar token:', response.status);
//                     if (refreshToken) {
//                         scheduleTokenRefresh(timeUntilExpiration, refreshToken, dispatch, attempt + 1);
//                     }
//                     return
//                 }
//             } catch (error: any) {
//                 console.error('Erro ao renovar token:', error.message);
//                 if (refreshToken) {
//                     scheduleTokenRefresh(timeUntilExpiration, refreshToken, dispatch, attempt + 1);
//                 }
//                 return
//             }
//         }
//     }, timeUntilExpiration * 900);
// };

const isTokenExpired = (exp: number) => {
    const tokenExp = exp;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return !tokenExp || nowInSeconds >= tokenExp;
};

const validateToken = async (accessToken: any) => {
    if (!accessToken) {
        console.error('Token not found');
        return false;
    }
    try {
        const response = await fetch('http://localhost:8000/api/token/validate/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            console.log('Token is valid:', response);
            return true;
        } else {
            console.error('Failed to validate token');
            return false;
        }
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
}

export const verifyAuthenticated = async (accessToken: any, accessTokenExp: any) => {
    if (accessTokenExp) {
        if (isTokenExpired(accessTokenExp)) {
            console.log('Token expirado ou inválido.');
            return false;
        }
        return await validateToken(accessToken);
    }
    console.error('Token não encontrado ou inválido.');
    return false;
};

export const followProfile = async (id: number, accessToken: string, dispatch: Dispatch<any>, followUser: Function) => {
    try {
        const response = await followUser({ id, accessToken });
        if (response) {
            dispatch(updateFollowedProfiles({ profileId: id, type: 'add' }));
            console.log('Added to followed profiles');
        } else {
            console.log('Error following user');
        }
    } catch (error) {
        console.error('Error following user:', error);
    }
};

export const unfollowProfile = async (id: number, accessToken: string, dispatch: Dispatch<any>, unfollowUser: Function) => {
    try {
        const response = await unfollowUser({ id, accessToken });
        if (response) {
            dispatch(updateFollowedProfiles({ profileId: id, type: 'remove' }));
            console.log('Removed from followed profiles');
        } else {
            console.log('Error unfollowing user');
        }
    } catch (error) {
        console.error('Error unfollowing user:', error);
    }
};

export const timePost = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - createdDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months >= 1) {
        const formattedDate = createdDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
        return `${formattedDate}`;
    } else if (weeks >= 1) {
        return `${weeks} semana${weeks === 1 ? '' : 's'}`;
    } else if (days >= 1) {
        return `${days} dia${days === 1 ? '' : 's'}`;
    } else if (hours >= 1) {
        return `${hours} hora${hours === 1 ? '' : 's'}`;
    } else {
        return `${minutes} minuto${minutes === 1 ? '' : 's'}`;
    }
};

export const convertUrl = (url: string) => {
    if (url.startsWith('http://localhost')) {
        return url;
    } else {
        return `http://localhost:8000${url}`;
    }
}