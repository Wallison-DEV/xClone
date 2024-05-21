import { useNavigate } from "react-router-dom";

import { PostContent, UserInfo } from "../Tweet/styles"
import { PostDiv } from "../Tweet/styles"

import { convertUrl, timePost } from '../../Utils'

import userIcon from '../../assets/img/profile_avatar.png';

const MinimizedTweet = (props: PostProps) => {
    const navigate = useNavigate()
    const handleUserClick = (userId: number) => {
        navigate(`/profile/${userId}`);
    };

    const limitedContent = props.content && props.content.length > 335
        ? `${props.content.slice(0, 335)}...`
        : props.content;

    return (
        <PostDiv>
            <div onClick={() => handleUserClick(props.user.id)}>
                <UserInfo>
                    <img src={props.user.profile_image ? convertUrl(props.user.profile_image) : userIcon} alt="" />
                    <h2>{props.user.username}</h2>
                    <span>@{props.user.username} · {timePost(props.created_at)}</span>
                </UserInfo>
            </div>
            <PostContent>{limitedContent}</PostContent>
        </PostDiv>
    )
}

export default MinimizedTweet