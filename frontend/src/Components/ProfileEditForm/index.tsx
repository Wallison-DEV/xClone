import { useDispatch } from "react-redux"
import { useState } from "react";
import AvatarEditor from 'react-avatar-editor';

import { SecondTitle } from '../../styles'
import { Modal } from "../../styles"
import * as S from "./styles"

import { closeModalEditProfile } from "../../Store/reducers/profile"

import profileImg from '../../assets/img/profile_avatar.png';
import { MdAddAPhoto } from "react-icons/md";
import Button from "../Button";
import { InputDiv } from "../Login/styles";
import { useUpdateProfileMutation } from "../../Services/api";
import { convertUrl } from "../../Utils";

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

    const dataURLtoBlob = (dataURL: string) => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    const handleSave = (typeImageProfile: boolean) => {
        if (editor) {
            const canvas = editor.getImageScaledToCanvas();

            const dataURL = canvas.toDataURL('image/png');

            const blob = dataURLtoBlob(dataURL);

            const file = new File([blob], "profile_image.png", { type: "image/png" });

            if (typeImageProfile) {
                setProfileImage(file);
            } else {
                setBackgroundImage(file);
            }
            setIsEditingImg(false);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        if (profileImage !== (profile?.profile_image || profileImg)) {
            formData.append("profile_image", profileImage);
        }
        if (backgroundImage && backgroundImage !== (profile?.background_image || null)) {
            formData.append("background_image", backgroundImage);
        }
        if (bio !== (profile?.bio || '')) {
            formData.append("bio", bio);
        }
        if (arroba !== (profile?.arroba || '')) {
            formData.append("arroba", arroba);
        }

        try {
            const response = await profilePurchase({
                body: formData,
                accessToken,
            });
            console.log(response)
            // if (response.data && response.data.isSuccess) {
            //     dispatch(closeModalEditProfile());
            // }
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
        }
    };

    const handleNextPage = () => {
        setPageProfileForm(pageProfileForm + 1)
    }
    // const handleBeforePage = () => {
    //     setPageProfileForm(pageProfileForm - 1)
    // }

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
                                                <img src={profileImage !== profileImg ? (typeof profileImage === 'string' ? convertUrl(profileImage) : URL.createObjectURL(profileImage)) : profileImg} alt="Foto de perfil" />
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
                            <S.BackgroundImg background={backgroundImage} >
                                <label htmlFor="fileInput"><MdAddAPhoto size={28} color="#FFFFFF" /></label>
                                <input id="fileInput" type="file" accept="image/*" onChange={handleBackgroundImageChange} />
                            </S.BackgroundImg>
                            <div className="dataProfile">
                                <img src={profileImage !== profileImg ? (typeof profileImage === 'string' ? convertUrl(profileImage) : URL.createObjectURL(profileImage)) : profileImg} alt="Foto de perfil" />
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
                        <S.BackgroundImg background={backgroundImage} >
                            <label htmlFor="fileInput"><MdAddAPhoto size={28} /></label>
                            <input id="fileInput" type="file" accept="image/*" onChange={handleBackgroundImageChange} />
                        </S.BackgroundImg>
                        <div className="dataProfile">
                            <div>
                                <img src={profileImage !== profileImg ? (typeof profileImage === 'string' ? convertUrl(profileImage) : URL.createObjectURL(profileImage)) : profileImg} alt="Foto de perfil" />
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
                            <Button onClick={() => dispatch(closeModalEditProfile())} variant="light">Fechar sem alterar</Button>
                        )}
                    </S.BackgroundSelect>
                )}
            </S.ProfileModal>
            <div className='overlay' onClick={() => dispatch(closeModalEditProfile())} />
        </Modal >
    )
}

export default ProfileForm