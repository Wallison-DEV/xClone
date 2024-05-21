import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootReducer } from '../../Store';
import { convertUrl, timePost } from '../../Utils'

import { useAddLikeRetweetMutation, useGetPostByIdQuery } from '../../Services/api';

import { Modal } from '../../styles';
import * as S from '../Tweet/styles';

import userIcon from '../../assets/img/profile_avatar.png';
import commentIcon from '../../assets/icons/comment.png';
import likeIcon from '../../assets/icons/like.png';
import likedIcon from '../../assets/icons/liked.png';

import LikedByList from '../LikedByList';
import PostDetails from '../Postdetails';
import MinimizedTweet from '../MinimizedTweet';
import { ImageDiv } from '../Tweet/styles';
import Button from '../Button';
import PostEditForm from '../PostEditForm';

type Props = {
    props: RetweetProps;
    modalDisabled?: boolean;
};

const Retweet: React.FC<Props> = ({ props, modalDisabled }) => {
    const navigate = useNavigate();
    const myUserProfile = useSelector((state: RootReducer) => state.profile.myUser);
    const [addLike, { isLoading: isAddingLike, isSuccess }] = useAddLikeRetweetMutation();
    const { data } = useGetPostByIdQuery(props.tweet_id)
    const [liked, setLiked] = useState(
        props.likes.liked_by ? props.likes.liked_by.some((user: any) => user.id === myUserProfile?.id) : false
    );
    const [likeCount, setLikeCount] = useState(props.likes.count)
    const [modalLikeIsOpen, setModalLikeIsOpen] = useState(false);
    const [modalPostIsOpen, setModalPostIsOpen] = useState(false);
    const [modalEditRetweet, setModalEditRetweetIsOpen] = useState(false);
    const [modalMoreInfos, setModalMoreInfosIsOpen] = useState(false);

    const renderMedia = () => {
        if (!props.media) {
            return null;
        }

        const isLocalMedia = props.media.startsWith('/media/post_media');

        if (isLocalMedia) {
            const mediaUrl = props.media.replace('/media', 'http://localhost:8000/media');

            const mediaType = mediaUrl.split('.').pop()?.toLowerCase();

            if (!mediaType) {
                return null;
            }

            const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'tiff', 'ico'];

            if (imageExtensions.includes(mediaType)) {
                return <S.PostSource><img src={mediaUrl} alt="Media" /></S.PostSource>;
            } else if (mediaType === 'mp4') {
                return <S.PostSource><video controls src={mediaUrl}></video></S.PostSource>;
            } else {
                return <p>Formato não suportado</p>;
            }
        } else {
            const mediaType = props.media.split('.').pop()?.toLowerCase();

            if (!mediaType) {
                return null;
            }

            const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'tiff', 'ico'];

            if (imageExtensions.includes(mediaType)) {
                return <S.PostSource><img src={props.media} alt="Media" /></S.PostSource>;
            } else if (mediaType === 'mp4') {
                return <S.PostSource><video controls src={props.media}></video></S.PostSource>;
            } else {
                return <p>Formato não suportado</p>;
            }
        }
    };

    const handleUserClick = (userId: number) => {
        navigate(`/profile/${userId}`);
    };
    const handlePostClick = (postId: number) => {
        navigate(`/post/${postId}`);
    };

    const handleLikeClick = async (postId: number) => {
        const accessToken = localStorage.getItem('accessToken') || ''
        try {
            await addLike({ postId, accessToken });
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };
    const handleOpenLikeModal = () => {
        if (modalDisabled === true) {
            return
        }
        setModalLikeIsOpen(!modalLikeIsOpen);
    };

    const handleOpenPostModal = () => {
        if (modalDisabled === true) {
            return
        }
        setModalPostIsOpen(!modalPostIsOpen);
    };

    const handleOpenMoreInfos = () => {
        setModalMoreInfosIsOpen(!modalMoreInfos);
    }
    const handleOpenRetweetEditModal = () => {
        setModalEditRetweetIsOpen(!modalEditRetweet);
    }

    useEffect(() => {
        if (isSuccess) {
            if (liked === true) {
                setLiked(false)
                setLikeCount(likeCount - 1)
            } else if (liked === false) {
                setLiked(true)
                setLikeCount(likeCount + 1)
            }
        }
    }, [isSuccess])

    return (
        <S.PostDiv key={props.id}>
            <header>
                <div onClick={() => handleUserClick(props.user.id)}>
                    <S.UserInfo>
                        <img src={props.user.profile_image ? convertUrl(props.user.profile_image) : userIcon} alt="" />
                        <h2>{props.user.username}</h2>
                        <span>@{props.user.username} · {timePost(props.created_at)}</span>
                    </S.UserInfo>
                </div>
                {props.user.id === myUserProfile.id && (
                    <div className='retweet-div'>
                        {modalMoreInfos && (
                            <div className='options-div'>
                                <Button onClick={() => handleOpenRetweetEditModal()} variant='light'>Editar</Button>
                                <Button onClick={() => handleOpenRetweetEditModal()} variant='light'>Excluir</Button>
                            </div>
                        )}
                        <button className='more-options-btn'>
                            <span onClick={() => handleOpenMoreInfos()}>...</span>
                        </button>
                    </div>
                )}
            </header>
            <S.PostContent>{props.content}</S.PostContent>
            <ImageDiv>{renderMedia()}</ImageDiv>
            {data && (
                <div onClick={() => handlePostClick(data.id)} style={{ cursor: 'pointer' }}>
                    <MinimizedTweet {...data} />
                </div>
            )
            }
            <S.PostDetails>
                <div>
                    <span>
                        <div onClick={() => handleOpenLikeModal()}>
                            {likeCount}
                        </div>
                        <button onClick={() => handleLikeClick(props.id)} disabled={isAddingLike}>
                            <img src={liked ? likedIcon : likeIcon} className={liked ? 'liked' : 'like-button'} />
                        </button>
                    </span>
                </div >
                <div>
                    {props.comments && (
                        <span onClick={() => handleOpenPostModal()}>
                            {Array.isArray(props.comments) ? props.comments.length : 0}
                            <img src={commentIcon} alt="comment" />
                        </span>
                    )}
                </div >
            </S.PostDetails >
            {modalLikeIsOpen && <LikedByList onClose={handleOpenLikeModal} liked_by={props.likes.liked_by || []} />}
            {
                modalPostIsOpen &&
                <Modal>
                    <PostDetails onClose={handleOpenPostModal} post={props} />
                    <div className='overlay' onClick={() => handleOpenPostModal()} />
                </Modal>
            }
            {modalEditRetweet &&
                <PostEditForm onClose={handleOpenRetweetEditModal} post={props} />
            }
        </S.PostDiv >
    );
};

export default Retweet;
