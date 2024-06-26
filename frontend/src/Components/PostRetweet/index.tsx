import { useState } from "react";

import * as S from '../Postdetails/styles'
import { StyledHeader } from "../PostList/styles"
import { PostForm, PreviewImage } from '../PostForm/styles'
import { LoginDiv } from "../Login/styles"

import { useDoRepostMutation, useGetMyuserQuery } from "../../Services/api";

import userIcon from '../../assets/img/profile_avatar.png';
import pictureIcon from '../../assets/icons/pictureIcon.png'

import Button from "../Button";
import MinimizedTweet from "../MinimizedTweet";
import { convertUrl } from "../../Utils";
import ConfirmModal from "../ConfirmModal";

interface PostRetweetProps {
    post: PostProps;
    onClose?: () => void;
}

const PostRetweet: React.FC<PostRetweetProps> = ({ post, onClose }) => {
    const accessToken = localStorage.getItem('accessToken') || ''
    const { data: myProfile } = useGetMyuserQuery(accessToken)
    const [doRepost] = useDoRepostMutation();
    const [textRepostValue, setTextRepostValue] = useState('')
    const [sourceRepostValue, setSourceRepostValue] = useState<File | null>(null)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

    const handleSourceRepostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSourceRepostValue(file);
        }
    };

    const close = () => {
        if (onClose) {
            onClose();
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const content = String(textRepostValue);
            const media = sourceRepostValue || null;
            const tweet = post.id;
            const accessToken = localStorage.getItem("accessToken") || '';

            const response = await doRepost({
                content, tweet, media, accessToken,
            });
            if ('data' in response && response.data === 201) {
                setSourceRepostValue(null);
                setTextRepostValue('');
                setIsSuccessModalOpen(true);
            }
        } catch (error) {
            console.error('Error making repost:', error);
        }
    };
    return (
        <LoginDiv>
            <S.StyledPostDetails>
                {onClose &&
                    <StyledHeader style={{ marginBottom: '28px' }}>
                        <span className='close-span' onClick={() => close()}>x</span>
                    </StyledHeader>
                }
                <PostForm onSubmit={handleSubmit}>
                    <img src={myProfile?.profile_image ? convertUrl(myProfile?.profile_image) : userIcon} alt="" />
                    <div>
                        <textarea placeholder='O que está acontecendo?' value={textRepostValue} onChange={(e) => setTextRepostValue(e.target.value)} />
                        {sourceRepostValue && (
                            sourceRepostValue.type.startsWith("image/") ? (
                                <PreviewImage src={URL.createObjectURL(sourceRepostValue)} alt="Selected Image" />
                            ) : sourceRepostValue.type.startsWith("video/") ? (
                                <video controls src={URL.createObjectURL(sourceRepostValue)}></video>
                            ) : (
                                <p>Formato não suportado</p>
                            )
                        )}
                        <footer>
                            <label htmlFor="postRepostSource" className="imageButton">
                                <img src={pictureIcon} alt="" />
                                <input
                                    type="file"
                                    id="postRepostSource"
                                    accept="image/*, video/*"
                                    style={{ display: "none" }}
                                    onChange={handleSourceRepostChange}
                                />
                            </label>
                            <Button variant="lightblue">Postar</Button>
                        </footer>
                        <MinimizedTweet {...post} />
                    </div>
                </PostForm>
            </S.StyledPostDetails>
            {isSuccessModalOpen && (
                <ConfirmModal
                    text='Retweet criado com sucessso!.'
                    onClose={() => { setIsSuccessModalOpen(false); close(); }}
                />
            )}
        </LoginDiv>
    )
}

export default PostRetweet