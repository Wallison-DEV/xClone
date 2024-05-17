import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { clearTokens } from "../../Store/reducers/token";
import { RootReducer } from "../../Store";

import * as S from './styles'
import { Modal } from "../../styles";

import userIcon from "../../assets/img/user.png"
import { IoHomeOutline, IoPersonOutline, IoSearch } from "react-icons/io5";
import { FaPenFancy } from "react-icons/fa6";

import { useGetMyuserQuery } from "../../Services/api";
import { clearFollowed, updateMyUser } from "../../Store/reducers/profile";
import PostForm from "../PostForm";

import Button from '../Button'

const NavAside = () => {
    const token = useSelector((state: RootReducer) => state.token)
    const dispatch = useDispatch()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const { data: myProfile } = useGetMyuserQuery(token.accessToken || '')

    useEffect(() => {
        dispatch(updateMyUser(myProfile))
    }, [myProfile])

    const handleLogout = async () => {
        try {
            const refreshToken = token.refreshToken;
            if (refreshToken) {
                const responseLogout = await fetch('http://wallison.pythonanywhere.com/api/logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        refresh: refreshToken,
                    }),
                });
                console.log(responseLogout);
            }
            dispatch(clearTokens())
            dispatch(clearFollowed())
        } catch (error: any) {
            console.error('Error logging out:', error.message);
        }
    };
    return (
        <div>
            <S.LeftAside>
                <div>
                    <div>
                        <S.ItemAside to='/home' className="nav-link">
                            <div>
                                <IoHomeOutline />
                            </div>
                            <p>
                                Página Inicial
                            </p>
                        </S.ItemAside>
                        <S.ItemAside to={`/profile/${myProfile?.id}`} className="nav-link">
                            <div><IoPersonOutline /></div>
                            <p>
                                Perfil
                            </p>
                        </S.ItemAside>
                        <S.ItemAside to="/search" className="nav-link" >
                            <div >
                                <IoSearch />
                            </div>
                            <p>
                                Explorar
                            </p>
                        </S.ItemAside>
                        <Button variant='lightblue' onClick={() => setIsPostModalOpen(true)}>
                            <div className="post-icon">
                                <FaPenFancy />
                            </div>
                            <p>
                                Postar
                            </p>
                        </Button>
                        <S.ProfileDiv>
                            {isMenuOpen && myProfile !== null && (
                                <S.ExitButton variant="light" onClick={handleLogout}>
                                    Sair de @{myProfile?.username}
                                </S.ExitButton>
                            )}
                            <S.MyProfile onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <div>
                                    <img src={userIcon} alt="" />
                                    <div className="userInfos">
                                        <p>{myProfile?.username || "Nome de Usuário"}</p>
                                        <span>@{myProfile?.username || "Nome de Usuário"}</span>
                                    </div>
                                </div>
                                <span>...</span>
                            </S.MyProfile>
                        </S.ProfileDiv>
                    </div>
                </div>
            </S.LeftAside >
            {
                isPostModalOpen && (
                    <Modal>
                        <PostForm isNotModal={false} />
                        <div className='overlay' onClick={() => setIsPostModalOpen(false)} />
                    </Modal>
                )
            }
        </div>
    )
}

export default NavAside