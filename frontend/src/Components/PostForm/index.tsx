import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useDoPostMutation } from '../../Services/api'
import { RootReducer } from '../../Store';

import * as S from './styles'

import Button from "../Button";

import userImg from '../../assets/img/user.png'
import pictureIcon from '../../assets/icons/pictureIcon.png'

const PostForm = ({ isNotModal }: { isNotModal?: boolean }) => {
    const token = useSelector((state: RootReducer) => state.token)
    const [textPostValue, setTextPostValue] = useState('')
    const [sourcePostValue, setSourcePostValue] = useState<File | null>(null)
    const [postMedia] = useDoPostMutation()

    const DoPost = async () => {
        try {
            const formData = new FormData();
            formData.append('content', textPostValue);
            if (sourcePostValue) {
                formData.append('media', sourcePostValue);
            }
            await postMedia({
                body: formData,
                accessToken: token?.accessToken || ''
            });
            setSourcePostValue(null);
            setTextPostValue('');
        } catch (error: any) {
            console.error('Error making posts:', error);
        }
    };

    const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSourcePostValue(file);
        }
    };
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        await DoPost();
    };
    return (
        <S.PostDiv style={{ zIndex: !isNotModal ? '100' : '' }}>
            <S.PostForm onSubmit={handleSubmit}>
                <img src={userImg} alt="" />
                <div>
                    <textarea placeholder='O que está acontecendo?' value={textPostValue} onChange={(e) => setTextPostValue(e.target.value)} />
                    {
                        sourcePostValue && (
                            sourcePostValue.type.startsWith('image/') ? (
                                <S.PreviewImage src={URL.createObjectURL(sourcePostValue)} alt="Selected Image" />
                            ) : sourcePostValue.type.startsWith('video/') ? (
                                <video controls src={URL.createObjectURL(sourcePostValue)}></video>
                            ) : (
                                <p>Formato não suportado</p>
                            )
                        )
                    }
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
            </S.PostForm>
        </S.PostDiv>
    )
}

export default PostForm