import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

import * as S from './styles'
import { StyledHeader } from "../PostList/styles"
import { PreviewImage, PostForm } from "../PostForm/styles";
import { PostSource } from "../Tweet/styles";

import { useDoCommentMutation } from "../../Services/api";
import { timePost } from '../../Utils'

import userIcon from '../../assets/img/profile_avatar.png';
import pictureIcon from '../../assets/icons/pictureIcon.png'

import Button from "../Button";
import Retweet from "../Retweet";
import Tweet from "../Tweet";
import { LoginDiv } from "../Login/styles";

interface PostDetailsProps {
    post: (PostProps | RetweetProps);
    onClose?: () => void;
}

const PostDetails: React.FC<PostDetailsProps> = ({ post, onClose }) => {
    const navigate = useNavigate()
    const [doComment, { isError, error, isSuccess }] = useDoCommentMutation();
    const [textCommentValue, setTextCommentValue] = useState('')
    const [sourceCommentValue, setSourceCommentValue] = useState<File | null>(null)

    const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSourceCommentValue(file);
        }
    };

    const handleUserClick = (userId: number) => {
        navigate(`/profile/${userId}`);
    };

    const close = () => {
        if (onClose) {
            onClose();
        }
    }

    const renderMedia = (comment: {
        media?: string | null;
        id: number;
    }) => {
        if (!comment.media) {
            return null;
        }

        const mediaType = comment.media.split('.').pop()?.toLowerCase();

        if (!mediaType) {
            return null;
        }

        const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'tiff', 'ico'];

        if (imageExtensions.includes(mediaType)) {
            return <PostSource key={comment.id}><img src={comment.media} alt="Media" /></PostSource>;
        } else if (mediaType === 'mp4') {
            return <PostSource key={comment.id}><video controls src={comment.media}></video></PostSource>;
        } else {
            return <p key={comment.id}>Formato não suportado</p>;
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const content = String(textCommentValue);
            const content_type = post.hasOwnProperty('tweet_id') ? 7 : 6;
            const object_id = String(post.id);
            const media = sourceCommentValue || null;
            const accessToken = localStorage.getItem("accessToken") || '';
            await doComment({
                content, content_type, object_id, media, accessToken,
            });
            setSourceCommentValue(null);
            setTextCommentValue('');

        } catch (error) {
            console.error('Error making comment:', error);
        }
    };
    useEffect(() => {
        if (isError) {
            console.log("comment error", error);
        }
        if (isSuccess) {
            setSourceCommentValue(null);
            setTextCommentValue("");
        }
    }, [isSuccess, isError, error]);

    return (
        <LoginDiv>
            <S.StyledPostDetails>
                {onClose &&
                    <StyledHeader>
                        <span className='close-span' onClick={() => close()}>x</span>
                    </StyledHeader>
                }
                {('tweet_id' in post) ? (<Retweet props={post} modalDisabled={true} />) : (<Tweet props={post} modalDisabled={true} />)}
                <S.CommentsSection>
                    <PostForm onSubmit={handleSubmit}>
                        <img src={userIcon} alt="" />
                        <div>
                            <textarea placeholder='O que está acontecendo?' value={textCommentValue} onChange={(e) => setTextCommentValue(e.target.value)} />
                            {sourceCommentValue && (
                                sourceCommentValue.type.startsWith("image/") ? (
                                    <PreviewImage src={URL.createObjectURL(sourceCommentValue)} alt="Selected Image" />
                                ) : sourceCommentValue.type.startsWith("video/") ? (
                                    <video controls src={URL.createObjectURL(sourceCommentValue)}></video>
                                ) : (
                                    <p>Formato não suportado</p>
                                )
                            )}
                            <footer>
                                <label htmlFor="postSource" className="imageButton">
                                    <img src={pictureIcon} alt="" />
                                    <input
                                        type="file"
                                        id="postSource"
                                        accept="image/*, video/*"
                                        style={{ display: "none" }}
                                        onChange={handleSourceChange}
                                    />
                                </label>
                                <Button variant="lightblue">Postar</Button>
                            </footer>
                        </div>
                    </PostForm>
                    {post.comments.map(comment => (
                        <div key={comment.id}>
                            <img src={userIcon} alt="Imagem de usuário" />
                            <div>
                                <S.CommentHeader onClick={() => handleUserClick(comment.user.id)}>
                                    {comment.user.username}<span>@{comment.user.username} · {timePost(comment.created_at)}</span>
                                </S.CommentHeader>
                                <S.CommentContent>
                                    {comment.content}
                                    {renderMedia(comment)}
                                </S.CommentContent>
                            </div>
                        </div>
                    ))}
                </S.CommentsSection>
            </S.StyledPostDetails>
        </LoginDiv>
    )
}

export default PostDetails