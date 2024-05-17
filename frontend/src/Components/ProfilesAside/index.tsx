import { useEffect } from "react"
import { useSelector } from 'react-redux'

import { RootReducer } from '../../Store'

import * as S from './styles'
import { useListUnfollowedUsersQuery } from '../../Services/api'
import UsersList from '../UsersList'
import { useState } from 'react'


const ProfileAside = () => {
    const token = useSelector((state: RootReducer) => state.token)
    const { data: profilesUnfollowed } = useListUnfollowedUsersQuery(token?.accessToken || '')
    const [profiles, setProfiles] = useState<UserProfile[]>([])

    useEffect(() => {
        if (profilesUnfollowed && Array.isArray(profilesUnfollowed)) {
            const profilesToSet: UserProfile[] = profilesUnfollowed.map((user: UserProfile) => user);
            setProfiles(profilesToSet);
        }

    }, [profilesUnfollowed]);

    return (
        <S.RightAside>
            <div>
                <div>
                    <h1>Quem seguir</h1>
                    {profiles ? (
                        <UsersList users={profiles} followButton={true} />
                    ) : (
                        <p>Carregando...</p>
                    )}

                </div>
            </div>
        </S.RightAside>
    )
}

export default ProfileAside
