import { StyledHeader } from "../PostList/styles";
import { convertUrl } from '../../Utils';
import userIcon from '../../assets/img/profile_avatar.png';
import Button from '../Button';
import { useState } from 'react';
import { PostForm, PreviewImage } from '../PostForm/styles';
import { useGetPostByIdQuery, useUpdateRetweetMutation, useUpdateTweetMutation } from '../../Services/api';
import { Modal } from '../../styles';
import { LoginDiv } from '../Login/styles';
import MinimizedTweet from "../MinimizedTweet";

interface PostEditProps {
    post: PostProps | RetweetProps;
    onClose?: () => void;
}

const PostEditForm: React.FC<PostEditProps> = ({ post, onClose }) => {
    const accessToken = localStorage.getItem("accessToken") || ''
    const [textPostValue, setTextPostValue] = useState(post.content)

    const [EditTweetPurchase] = useUpdateTweetMutation()
    const [EditRetweetPurchase] = useUpdateRetweetMutation()
    let data: any;

    if ('tweet_id' in post) {
        const queryResult = useGetPostByIdQuery(post.tweet_id);
        data = queryResult.data;
    }

    const DoEditTweet = async () => {
        try {
            const formData = new FormData();
            formData.append('content', textPostValue);
            formData.append('tweet_id', String(post.id));
            const response = await EditTweetPurchase({
                body: formData,
                accessToken
            });
            console.log(response)
            if (response) {
                close()
            }
        } catch (error: any) {
            console.error('Error editing tweet:', error);
        }
    }
    const DoEditRetweet = async () => {
        try {
            const formData = new FormData();
            formData.append('content', textPostValue);
            formData.append('retweet_id', String(post.id));
            const response = await EditRetweetPurchase({
                body: formData,
                accessToken
            });
            console.log(response)
            if (response) {
                close()
            }
        } catch (error: any) {
            console.error('Error editing retweet:', error);
        }
    }
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if ('tweet_id' in post) {
            await DoEditRetweet();
        } else {
            await DoEditTweet();
        }
    };

    const close = () => {
        if (onClose) {
            onClose();
        }
    }
    return (
        <Modal>
            <LoginDiv>
                {onClose &&
                    <StyledHeader style={{ marginBottom: '28px' }}>
                        <span className='close-span' onClick={() => close()}>x</span>
                    </StyledHeader>
                }
                <PostForm onSubmit={handleSubmit}>
                    <img src={post.user.profile_image ? convertUrl(post.user.profile_image) : userIcon} alt="" />
                    <div>
                        <textarea placeholder='O que está acontecendo?' value={textPostValue} onChange={(e) => setTextPostValue(e.target.value)} />
                        {
                            post.media && typeof post.media === 'string' && (
                                post.media.startsWith('image/') ? (
                                    <PreviewImage src={convertUrl(post.media)} alt="Selected Image" />
                                ) : post.media.startsWith('video/') ? (
                                    <video controls src={convertUrl(post.media)}></video>
                                ) : (
                                    <p>Formato não suportado</p>
                                )
                            )
                        }
                        {('tweet_id' in post) && (
                            <MinimizedTweet {...data} />
                        )}
                        <footer>
                            <p></p>
                            <Button variant="lightblue" >Editar</Button>
                        </footer>
                    </div>
                </PostForm>
            </LoginDiv>
            <div className="overlay" onClick={() => close()}></div>
        </Modal>
    )
}

export default PostEditForm