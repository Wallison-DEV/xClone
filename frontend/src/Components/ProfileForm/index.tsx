import { useDispatch } from "react-redux"
import { useState } from "react";
import AvatarEditor from 'react-avatar-editor';

import { SecondTitle } from '../../styles'
import { Modal } from "../../styles"
import * as S from "./styles"

import { closeModalEdit } from "../../Store/reducers/profile"

import profileImg from '../../assets/img/profile_avatar.png';
import { MdAddAPhoto } from "react-icons/md";
import Button from "../Button";
import { InputDiv } from "../Login/styles";
import { useUpdateProfileMutation } from "../../Services/api";
import { useNavigate } from "react-router-dom";

interface ProfileFormProps {
    profile: UserProfile | undefined;
    onClose?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile }) => {
    const accessToken = localStorage.getItem("accessToken")
    const dispatch = useDispatch()
    const [profileImage, setProfileImage] = useState<File | string>(profile?.profile_image || profileImg);
    const [backgroundImage, setBackgroundImage] = useState<File | string | null>(profile?.background_image || null);
    const [bio, setBio] = useState<string>(profile?.bio || '')
    const [arroba, setArroba] = useState<string>(profile?.arroba || '')
    const [editor, setEditor] = useState<AvatarEditor | null>(null);
    const [scale, setScale] = useState(1);
    const [isEditingImg, setIsEditingImg] = useState(false)
    const [pageProfileForm, setPageProfileForm] = useState<number>(1)
    const [profilePurchase] = useUpdateProfileMutation()

    const handleProfileImageChange = (e: any) => {
        const file = e.target.files[0];
        setProfileImage(file);
        setIsEditingImg(true)
    };
    const handleBackgroundImageChange = (e: any) => {
        const file = e.target.files[0];
        setBackgroundImage(file);
        setIsEditingImg(true)
    };

    const handleSave = (typeImageProfile: boolean) => {
        if (typeImageProfile) {
            if (editor) {
                const canvas = editor.getImageScaledToCanvas();
                setProfileImage(canvas.toDataURL())
                setIsEditingImg(false)
            }
        } else {
            if (editor) {
                const canvas = editor.getImageScaledToCanvas();
                setBackgroundImage(canvas.toDataURL())
                setIsEditingImg(false)
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await profilePurchase({
                body: JSON.stringify({
                    profileImage: profileImage,
                    backgroundImage: backgroundImage,
                    bio: bio,
                    arroba: arroba,
                }),
                accessToken: accessToken,
            });
            if (response) {
                console.log(JSON.stringify(response))
                dispatch(closeModalEdit());
            }
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
        }
    };

    const handleNextPage = () => {
        setPageProfileForm(pageProfileForm + 1)
    }
    const handleBeforePage = () => {
        setPageProfileForm(pageProfileForm - 1)
    }

    const isAltered = () => {
        if (profileImage !== (profile?.profile_image || profileImg)) {
            return true;
        }
        if (backgroundImage !== (profile?.background_image || null)) {
            return true;
        }
        if (bio !== (profile?.bio || '')) {
            return true;
        }
        if (arroba !== (profile?.arroba || '')) {
            return true;
        }
        return false;
    }

    return (
        <Modal>
            <S.ProfileModal>
                {pageProfileForm === 1 && (
                    <>
                        <>
                            <SecondTitle>Escolher uma foto de perfil</SecondTitle>
                            <p style={{ width: '100%' }}>Tem uma selfie favorita? Carregue agora.</p>
                        </>
                        <div>
                            {profileImage && (
                                <>
                                    {isEditingImg ? (
                                        <S.EditingDiv>
                                            <AvatarEditor
                                                ref={(editor: any) => setEditor(editor)}
                                                image={profileImage}
                                                border={50}
                                                color={[255, 255, 255, 0.6]}
                                                scale={scale}
                                            />
                                            <input
                                                type="range"
                                                min="1"
                                                max="2"
                                                step="0.01"
                                                value={scale}
                                                onChange={(e) => setScale(parseFloat(e.target.value))}
                                            />
                                            <Button variant="light" onClick={() => handleSave(true)}>Salvar</Button>
                                        </S.EditingDiv>
                                    ) : (
                                        <>
                                            <S.AbsoluteImg>
                                                <img src={profileImage.toString()} alt="" />
                                                <label htmlFor="fileInput"><MdAddAPhoto size={28} /></label>
                                                <input id="fileInput" type="file" accept="image/*" onChange={handleProfileImageChange} />
                                            </S.AbsoluteImg>
                                            <Button onClick={() => handleNextPage()} variant="light">{(profileImage !== profileImg) ? ('Continuar') : ('Ignorar por enquanto')}</Button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
                {pageProfileForm === 2 && (
                    <S.BackgroundSelect>
                        <>
                            <SecondTitle>Escolha uma capa</SecondTitle>
                            <p style={{ width: '100%' }}> As pessoas que acessarem seu perfil o verão. Mostre seu estilo.</p>
                        </>
                        {isEditingImg ? (
                            <S.EditingDiv>
                                <AvatarEditor
                                    ref={(editor: any) => setEditor(editor)}
                                    image={backgroundImage!!}
                                    width={504}
                                    height={168}
                                    border={50}
                                    color={[255, 255, 255, 0.6]}
                                    scale={scale}
                                />
                                <input
                                    type="range"
                                    min="1"
                                    max="2"
                                    step="0.01"
                                    value={scale}
                                    onChange={(e) => setScale(parseFloat(e.target.value))}
                                />
                                <Button variant="light" onClick={() => handleSave(false)}>Salvar</Button>
                            </S.EditingDiv>
                        ) : (<>
                            <S.AbsoluteImg style={{ background: backgroundImage ? `url(${backgroundImage})` : 'rgb(207, 217, 222)' }}>
                                <label htmlFor="fileInput"><MdAddAPhoto size={28} /></label>
                                <input id="fileInput" type="file" accept="image/*" onChange={handleBackgroundImageChange} />
                            </S.AbsoluteImg>
                            <div className="dataProfile">
                                <img src={profileImage.toString()} alt="Foto de perfil" />
                                <div>
                                    <h3>{profile?.username}</h3>
                                    <h4>{profile?.arroba}</h4>
                                </div>
                            </div>
                            <Button onClick={() => handleNextPage()} variant="light">{(backgroundImage !== null) ? ('Continuar') : ('Ignorar por enquanto')}</Button>
                        </>)}
                    </S.BackgroundSelect>
                )}
                {pageProfileForm === 3 && (
                    <S.BioSelect>
                        <>
                            <SecondTitle>Faça sua descrição</SecondTitle>
                            <p style={{ width: '100%' }}>O que torna você especial? Não é preciso quebrar a cabeça, divirta-se com esse processo.</p>
                        </>
                        <InputDiv>
                            <span>Sua bio</span>
                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                        </InputDiv>
                        <Button onClick={() => handleNextPage()} variant="light">{(bio !== '' && bio !== null) ? ('Continuar') : ('Ignorar por enquanto')}</Button>
                    </S.BioSelect>
                )}
                {pageProfileForm === 4 && (
                    <S.BioSelect>
                        <>
                            <SecondTitle>Escolha seu @</SecondTitle>
                            <p style={{ width: '100%' }}>O que faz você único? Divirta-se com este processo.</p>
                        </>
                        <InputDiv>
                            <span>Seu @</span>
                            <input max={20} value={arroba} onChange={(e) => setArroba(e.target.value)} />
                        </InputDiv>
                        <Button onClick={() => handleNextPage()} variant="light">{(bio !== '' && bio !== null) ? ('Continuar') : ('Ignorar por enquanto')}</Button>
                    </S.BioSelect>
                )}
                {pageProfileForm === 5 && (
                    <S.BackgroundSelect>
                        <S.AbsoluteImg style={{ background: backgroundImage ? `url(${backgroundImage})` : 'rgb(207, 217, 222)' }}>
                        </S.AbsoluteImg>
                        <div className="dataProfile">
                            <div>
                                <img src={profileImage.toString()} alt="Foto de perfil" />
                                <div>
                                    <h3>{profile?.username}</h3>
                                    <h4>{arroba}</h4>
                                </div>
                            </div>
                            <div>
                                <p>Sua bio: {bio}</p>
                            </div>
                        </div>
                        {(isAltered()) ? (
                            <Button onClick={() => handleSubmit()} variant="light">Salvar</Button>
                        ) : (
                            <Button onClick={() => dispatch(closeModalEdit())} variant="light">Fechar sem alterar</Button>
                        )}
                    </S.BackgroundSelect>
                )}
            </S.ProfileModal>
            <div className='overlay' onClick={() => dispatch(closeModalEdit())} />
        </Modal >
    )
}

export default ProfileForm