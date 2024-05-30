import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RootReducer } from '../../Store';
import { openModalEditProfile, openModalFollow } from '../../Store/reducers/profile';
import { useGetUserByIdQuery, useGetPostUserIdQuery, useFollowMutation, useUnfollowMutation, useGetMyuserQuery } from '../../Services/api';
import { unfollowProfile, followProfile, convertUrl } from '../../Utils';

import * as S from './styles';

import profileImg from '../../assets/img/profile_avatar.png';
import { FaGear } from "react-icons/fa6";

import { PostContainer } from '../../Components/PostList/styles';
import Button from '../../Components/Button';
import FollowList from '../../Components/FollowList';
import Retweet from '../../Components/Retweet';
import Tweet from '../../Components/Tweet';
import ProfileForm from '../../Components/ProfileEditForm';
import Loader from '../../Components/Loader';
import { Container } from '../../styles';

const Profile = () => {
    const { id } = useParams();
    const accessToken = localStorage.getItem("accessToken") || '';
    const isModalFollowOpen = useSelector((state: RootReducer) => state.profile.modalFollowOpen);
    const isModalEditOpen = useSelector((state: RootReducer) => state.profile.modalEditProfileOpen);
    const followedProfilesIds = useSelector((state: RootReducer) => state.profile.followedProfiles);
    const dispatch = useDispatch();

    const { data: user, isLoading: UserLoading, error: UserError } = useGetUserByIdQuery(Number(id));
    const followersUser = (user && Array.isArray(user.followers))
        ? user.followers.map(u => ({ id: Number(u.id), username: u.username, profile_image: u.profile_image }))
        : [];

    const followingsUser = (user && Array.isArray(user.following))
        ? user.following.map(u => ({ id: Number(u.id), username: u.username, profile_image: u.profile_image }))
        : [];
    const { data: userPosts, isLoading: PostsLoading, error: PostsError } = useGetPostUserIdQuery({ id: Number(id), accessToken });
    const { data: myProfile } = useGetMyuserQuery(accessToken);
    const [followUser] = useFollowMutation();
    const [unfollowUser] = useUnfollowMutation();

    const [isFollowingList, setIsFollowingList] = useState(false)

    if (UserLoading || PostsLoading) {
        return <S.Profile><Loader /></S.Profile>;
    }

    if (UserError || PostsError) {
        return <S.Profile><Container><h1>Ocorreu um erro ao processar perfil, tente novamente</h1></Container></S.Profile>;
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
            unfollowProfile(profileId, accessToken, dispatch, unfollowUser);
        } else {
            followProfile(profileId, accessToken, dispatch, followUser);
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
    const openEdit = () => {
        dispatch(openModalEditProfile())
    }

    console.log('profile', user)

    return (
        <S.Profile>
            <div>
                <S.ProfilePicture style={{
                    backgroundSize: 'cover',
                    backgroundImage: user?.background_image ? `url(${convertUrl(user.background_image)})` : 'none',
                    backgroundColor: user?.background_image ? 'transparent' : 'rgb(207, 217, 222)'
                }}>
                    <img src={user?.profile_image ? convertUrl(user?.profile_image) : profileImg} alt="Foto de perfil" />
                    <S.HeaderButton>
                        {myProfile?.id === Number(id) ? (
                            <button onClick={openEdit} className="configureButton"><FaGear size={24} /></button>
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
                        <h4>{user.arroba}</h4>
                    </div>
                    <p>{user.bio}</p>
                    <p>Ingressou em: {formatDate(user.created_at)}</p>
                    <div>
                        <span onClick={openFollowers}><span>{user.followers.length}</span> seguidores</span>
                        <span onClick={openFollowing}><span>{user.following.length}</span> seguindo </span>
                    </div>
                </S.ProfileData>
                <PostContainer>
                    {userPosts.length > 0 ? (
                        userPosts.map((post: (PostProps | RetweetProps)) => (
                            ('tweet_id' in post) ? (<Retweet key={post.id} props={post} />) : (<Tweet key={post.id} props={post} />)
                        ))
                    ) : (
                        <div className=" container margin-top">O usuário não possui postagens</div>
                    )}
                </PostContainer>
            </div>
            {isModalFollowOpen && <FollowList followersUser={followersUser} followingsUser={followingsUser} type={isFollowingList} />}
            {isModalEditOpen && <ProfileForm profile={myProfile} />}
        </S.Profile >
    );
};

export default Profile;