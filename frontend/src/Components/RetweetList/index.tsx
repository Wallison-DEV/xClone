import { StyledHeader } from "../PostList/styles"
import { LoginDiv } from "../Login/styles"
import Retweet from "../Retweet";

interface RetweetListProps {
    retweets: RetweetProps[];
    onClose?: () => void;
}
const RetweetList: React.FC<RetweetListProps> = ({ retweets, onClose }) => {
    const close = () => {
        if (onClose) {
            onClose();
        }
    }

    return (
        <LoginDiv>
            {onClose &&
                <StyledHeader style={{ marginBottom: '20px' }}>
                    <span className='close-span' onClick={() => close()}>x</span>
                </StyledHeader>
            }
            {retweets && retweets.length > 0 ? (
                retweets.map((retweet) => (
                    <Retweet props={retweet} modalDisabled={true} />
                ))
            ) : (
                <p>Ainda não há retweets</p>
            )}
        </LoginDiv>
    )
}

export default RetweetList