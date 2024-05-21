import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootReducer } from '../../Store';
import { convertUrl, timePost } from '../../Utils'

import { useAddLikeTweetMutation } from '../../Services/api';

import * as S from './styles';
import { Modal } from '../../styles';

import userIcon from '../../assets/img/profile_avatar.png';
import commentIcon from '../../assets/icons/comment.png';
import retweetIcon from '../../assets/icons/repost.png';
import likeIcon from '../../assets/icons/like.png';
import likedIcon from '../../assets/icons/liked.png';

import LikedByList from '../LikedByList';
import PostDetails from '../Postdetails';
import PostRetweet from '../PostRetweet';
import RetweetList from '../RetweetList';
import Button from '../Button';
import PostEditForm from '../PostEditForm';

type Props = {
    props: PostProps;
    modalDisabled?: boolean
}

const Tweet: React.FC<Props> = ({ props, modalDisabled }) => {
    const accessToken = localStorage.getItem('accessToken') || ''
    const navigate = useNavigate();
    const myUserProfile = useSelector((state: RootReducer) => state.profile.myUser);
    const [addLike, { isLoading: isAddingLike }] = useAddLikeTweetMutation();
    const [liked, setLiked] = useState(
        props.likes.liked_by ? props.likes.liked_by.some((user: any) => user.id === myUserProfile?.id) : false
    );
    const [likeCount, setLikeCount] = useState(props.likes.count)
    const [retweets, setRetweets] = useState<RetweetProps[]>(props.retweets || [])
    const [modalLikeIsOpen, setModalLikeIsOpen] = useState(false);
    const [modalPostIsOpen, setModalPostIsOpen] = useState(false);
    const [modalRetweetList, setModalRetweetListIsOpen] = useState(false);
    const [moreOptionsRetweet, setMoreOptionsRetweet] = useState(false);
    const [modalPostRetweet, setModalPostRetweetIsOpen] = useState(false);
    const [modalEditTweet, setModalEditTweetIsOpen] = useState(false);
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

    const handleLikeClick = async (postId: number) => {
        try {
            await addLike({ postId, accessToken });
            if (liked === true) {
                setLiked(false)
                setLikeCount(likeCount - 1)
            }
            if (liked === false) {
                setLiked(true)
                setLikeCount(likeCount + 1)
            }
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

    const handleOpenDetailsModal = () => {
        if (modalDisabled === true) {
            return
        }
        setModalPostIsOpen(!modalPostIsOpen);
    };

    const handleOpenPostRetweetModal = () => {
        setModalPostRetweetIsOpen(!modalPostRetweet);
    }

    const handleOpenRetweetListModal = () => {
        setModalRetweetListIsOpen(!modalRetweetList);
    }

    const handleOpenTweetEditModal = () => {
        setModalEditTweetIsOpen(!modalEditTweet);
    }

    const handleOpenMoreInfos = () => {
        setModalMoreInfosIsOpen(!modalMoreInfos);
    }

    return (
        <S.PostDiv key={props.id}>
            <header>
                <div onClick={() => handleUserClick(props.user.id)}>
                    <S.UserInfo>
                        <img src={props.user.profile_image ? convertUrl(props.user.profile_image) : userIcon} alt="" />
                        <div>
                            <h2>{props.user.username}</h2>
                            <span>@{props.user.username} · {timePost(props.created_at)}</span>
                        </div>
                    </S.UserInfo>
                </div>
                {props.user.id === myUserProfile.id && (
                    <div className='retweet-div'>
                        {modalMoreInfos && (
                            <div className='options-div'>
                                <Button onClick={() => handleOpenTweetEditModal()} variant='light'>Editar</Button>
                                <Button onClick={() => handleOpenRetweetListModal()} variant='light'>Excluir</Button>
                            </div>
                        )}
                        <button className='more-options-btn'>
                            <span onClick={() => handleOpenMoreInfos()}>...</span>
                        </button>
                    </div>
                )}
            </header>
            <S.PostContent>{props.content}</S.PostContent>
            <S.ImageDiv>
                {renderMedia()}
            </S.ImageDiv>
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
                        <span onClick={() => handleOpenDetailsModal()}>
                            {Array.isArray(props.comments) ? props.comments.length : 0}
                            <img src={commentIcon} alt="comment" />
                        </span>
                    )}
                </div >
                <div className='retweet-div'>
                    {moreOptionsRetweet && (
                        <div className='options-div'>
                            <Button onClick={() => handleOpenPostRetweetModal()} variant='light'>Repostar</Button>
                            <Button onClick={() => handleOpenRetweetListModal()} variant='light'>Ver reposts</Button>
                        </div>
                    )}
                    <button onClick={() => setMoreOptionsRetweet(!moreOptionsRetweet)}>
                        <span >
                            <p>{Array.isArray(props.retweets) ? props.retweets.length : 0}</p>
                            <img src={retweetIcon} />
                        </span>
                    </button>
                </div>
            </S.PostDetails>
            {modalLikeIsOpen && <LikedByList onClose={handleOpenLikeModal} liked_by={props.likes.liked_by || []} />}
            {modalPostIsOpen &&
                <Modal>
                    <PostDetails onClose={handleOpenDetailsModal} post={props} />
                    <div className='overlay' onClick={() => handleOpenDetailsModal()} />
                </Modal>
            }
            {modalRetweetList &&
                <Modal>
                    <RetweetList onClose={handleOpenRetweetListModal} retweets={retweets} />
                    <div className='overlay' onClick={() => handleOpenRetweetListModal()} />
                </Modal>
            }
            {modalPostRetweet &&
                <Modal>
                    <PostRetweet onClose={handleOpenPostRetweetModal} post={props} />
                    <div className='overlay' onClick={() => handleOpenPostRetweetModal()} />
                </Modal>
            }
            {modalEditTweet &&
                <PostEditForm onClose={handleOpenTweetEditModal} post={props} />
            }
        </S.PostDiv>
    );
};

export default Tweet;
