import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RootReducer } from '../../Store';
import { useGetUserByIdQuery, useGetPostUserIdQuery, useFollowMutation, useUnfollowMutation, useGetMyuserQuery } from '../../Services/api';
import * as S from './styles';
import profileImg from '../../assets/img/profile_avatar.png';
import Button from '../../Components/Button';
import { unfollowProfile, followProfile } from '../../Utils';
import FollowList from '../../Components/FollowList';
import { useState } from 'react';
import { openModalFollow } from '../../Store/reducers/profile';
import Retweet from '../../Components/Retweet';
import Tweet from '../../Components/Tweet';

const Profile = () => {
    const { id } = useParams();
    const token = useSelector((state: RootReducer) => state.token);
    const isModalOpen = useSelector((state: RootReducer) => state.profile.modalOpen);
    const followedProfilesIds = useSelector((state: RootReducer) => state.profile.followedProfiles);
    const dispatch = useDispatch();

    const { data: user, isLoading: UserLoading, error: UserError } = useGetUserByIdQuery(Number(id));
    const followersUser = (user && Array.isArray(user.followers))
        ? user.followers.map(u => ({ id: Number(u.id), username: u.username }))
        : [];

    const followingsUser = (user && Array.isArray(user.following))
        ? user.following.map(u => ({ id: Number(u.id), username: u.username }))
        : [];
    const { data: userPosts, isLoading: PostsLoading, error: PostsError } = useGetPostUserIdQuery({ id: Number(id), accessToken: token?.accessToken || '' });
    const { data: myProfile } = useGetMyuserQuery(token?.accessToken || '');
    const [followUser] = useFollowMutation();
    const [unfollowUser] = useUnfollowMutation();

    const [isFollowingList, setIsFollowingList] = useState(false)

    if (UserLoading || PostsLoading) {
        return <S.Profile><h1>Loading</h1></S.Profile>;
    }

    if (UserError || PostsError) {
        return <S.Profile><h1>Ocorreu um erro ao processar perfil, tente novamente</h1></S.Profile>;
    }

    if (!user || !userPosts) {
        return null;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
        return date.toLocaleDateString('pt-BR', options);
    };

    const isProfileFollowed = (id: number) => {
        return followedProfilesIds.includes(id);
    };

    const handleFollowProfile = (profileId: number) => {
        if (isProfileFollowed(profileId)) {
            unfollowProfile(profileId, token?.accessToken || '', dispatch, unfollowUser);
        } else {
            followProfile(profileId, token?.accessToken || '', dispatch, followUser);
        }
    };

    const openFollowing = () => {
        setIsFollowingList(true)
        dispatch(openModalFollow())
    }
    const openFollowers = () => {
        setIsFollowingList(false)
        dispatch(openModalFollow())
    }

    return (
        <S.Profile>
            <div>
                <S.ProfilePicture>
                    <img src={profileImg} alt="" />
                    <S.HeaderButton>
                        {myProfile?.id === Number(id) ? (
                            <button className="configureButton"></button>
                        ) : (
                            <>
                                {isProfileFollowed(user.id) ? (
                                    <Button variant='dark' maxwidth='100px' onClick={() => handleFollowProfile(user.id)}>
                                        Seguindo
                                    </Button>
                                ) : (
                                    <Button variant='lightblue' maxwidth='100px' onClick={() => handleFollowProfile(user.id)}>
                                        Seguir
                                    </Button>
                                )}
                            </>
                        )}
                    </S.HeaderButton>
                </S.ProfilePicture>
                <S.ProfileData>
                    <div>
                        <h3>{user.username}</h3>
                        <h4>@{user.username}</h4>
                    </div>
                    <p>{user.bio}</p>
                    <p>Ingressou em: {formatDate(user.created_at)}</p>
                    <div>
                        <span onClick={openFollowers}><span>{user.followers.length}</span> seguidores</span>
                        <span onClick={openFollowing}><span>{user.following.length}</span> seguindo </span>
                    </div>
                </S.ProfileData>
                <div>
                    {userPosts.length > 0 ? (
                        userPosts.map((post: (PostProps | RetweetProps)) => (
                            ('tweet_id' in post) ? (<Retweet key={post.id} props={post} />) : (<Tweet key={post.id} props={post} />)
                        ))
                    ) : (
                        <div className="container margin-top">O usuário não possui postagens</div>
                    )}
                </div>
            </div>
            {isModalOpen && <FollowList followersUser={followersUser} followingsUser={followingsUser} type={isFollowingList} />}
        </S.Profile >
    );
};

export default Profile;