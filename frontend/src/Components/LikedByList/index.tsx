import { StyledHeader } from "../PostList/styles"
import { Modal } from "../../styles"
import { LoginDiv } from "../Login/styles"
import UsersList from "../UsersList"

interface LikedByListProps {
    liked_by: UserProfile[];
    onClose: () => void;
}

const LikedByList: React.FC<LikedByListProps> = ({ liked_by, onClose }) => {

    const close = () => {
        onClose();
    };


    return (
        <Modal>
            <LoginDiv>
                <StyledHeader>
                    <span className='close-span' onClick={() => close()}>x</span>
                </StyledHeader>
                {liked_by.length > 1 ? (
                    <UsersList users={liked_by} followButton={true} />
                ) : (
                    <h3 >Essa publicação ainda não possui curtidas</h3>
                )}
            </LoginDiv>
            <div className='overlay' onClick={() => close()} />
        </Modal>
    )
}

export default LikedByList