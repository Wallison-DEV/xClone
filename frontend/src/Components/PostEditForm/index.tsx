

import * as S from './styles'
import { StyledHeader } from "../PostList/styles";

interface PostEditProps {
    post: PostProps;
    onClose?: () => void;
}

const PostEditForm: React.FC<PostEditProps> = ({ post, onClose }) => {

    const close = () => {
        if (onClose) {
            onClose();
        }
    }
    return (
        <S.EditPostForm>
            {onClose &&
                <StyledHeader style={{ marginBottom: '28px' }}>
                    <span className='close-span' onClick={() => close()}>x</span>
                </StyledHeader>
            }
        </S.EditPostForm>
    )
}

export default PostEditForm