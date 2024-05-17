import { useState } from "react"
import { useDispatch } from "react-redux"

import { StyledHeader } from "../PostList/styles"
import { Modal } from "../../styles"
import { closeModalFollow } from "../../Store/reducers/profile"
import { LoginDiv } from "../Login/styles"
import UsersList from "../UsersList"

interface Props {
    followersUser: User[];
    followingsUser: User[];
    type: boolean;
}

const FollowList: React.FC<Props> = ({ followersUser, followingsUser, type }) => {
    const [typeFollowing, setTypeFollowing] = useState<boolean>(type)

    const dispatch = useDispatch()

    const close = () => {
        dispatch(closeModalFollow())
    }

    return (
        <Modal>
            <LoginDiv>
                <StyledHeader>
                    <span className='close-span' onClick={close}>x</span>
                    <button onClick={() => setTypeFollowing(false)} className={!typeFollowing ? "is-selected" : ""}>
                        <p>Seguidores</p>
                    </button>
                    <button onClick={() => setTypeFollowing(true)} className={typeFollowing ? "is-selected" : ""}>
                        <p>Seguindo</p>
                    </button>
                </StyledHeader>
                {typeFollowing ? (
                    <>
                        {followingsUser.length > 0 ? (
                            <UsersList users={followingsUser} followButton={true} />

                        ) : (
                            <div className="container margin-top">O usuário não segue ninguém</div>
                        )}
                    </>
                ) : (
                    <>
                        {followersUser.length > 0 ? (
                            <UsersList users={followersUser} followButton={true} />
                        ) : (
                            <div className="container margin-top">O usuário não possui seguidores</div>
                        )}
                    </>

                )
                }
            </LoginDiv>
            <div className='overlay' onClick={close} />
        </Modal >
    )
}

export default FollowList