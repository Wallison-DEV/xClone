import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import * as S from './styles'

import userIcon from "../../assets/img/user.png"
import Button from '../Button'

import { RootReducer } from "../../Store"
import { updateFollowedProfiles } from '../../Store/reducers/profile';
import { followProfile, unfollowProfile } from "../../Utils"
import { useFollowMutation, useGetMyuserQuery, useUnfollowMutation } from "../../Services/api"

interface UsersProfile {
    id: number;
    username: string;
}

interface UsersListProps {
    users?: UsersProfile[];
    followButton: boolean;
}

const UsersList = ({ users, followButton }: UsersListProps) => {
    const token = useSelector((state: RootReducer) => state.token)
    const followedProfilesIds = useSelector((state: RootReducer) => state.profile.followedProfiles)
    const [followUser] = useFollowMutation()
    const [unfollowUser] = useUnfollowMutation()
    const { data: myProfile } = useGetMyuserQuery(token?.accessToken || '')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (myProfile && Array.isArray(myProfile.following)) {
            const followingIds = myProfile.following.map((user) => user.id);
            followingIds.forEach((id) => {
                dispatch(updateFollowedProfiles({ profileId: id, type: 'add' }));
            });
        }
    }, [myProfile]);

    const handleUserClick = (id: number) => {
        navigate(`/profile/${id}`);
    }

    const isProfileFollowed = (id: number) => {
        return followedProfilesIds.includes(id)
    }
    const handleFollowProfile = (profileId: number) => {
        if (isProfileFollowed(profileId)) {
            unfollowProfile(profileId, token?.accessToken || '', dispatch, unfollowUser);
        } else {
            followProfile(profileId, token?.accessToken || '', dispatch, followUser);
        }
    }

    return (
        <>
            {users && users.map((profile: UsersProfile) => (
                <S.Profile onClick={() => handleUserClick(profile.id)} key={profile.id}>
                    <div>
                        <img src={userIcon} alt="" />
                        <div>
                            <p>{profile.username}</p>
                            <span>@{profile.username}</span>
                        </div>
                    </div>
                    {followButton && (
                        <>
                            {isProfileFollowed(profile.id) ? (
                                <Button variant='dark' maxwidth='100px' onClick={() => handleFollowProfile(profile.id)}>
                                    Seguindo
                                </Button>
                            ) : (
                                <Button variant='lightblue' maxwidth='100px' onClick={() => handleFollowProfile(profile.id)}>
                                    Seguir
                                </Button>
                            )}
                        </>
                    )}
                </S.Profile>
            ))}
        </>
    )
}

export default UsersList