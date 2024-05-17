import { useParams } from "react-router-dom";

import PostDetails from "../../Components/Postdetails"
import { useGetPostByIdQuery } from "../../Services/api";
import { PostContainer } from "../../Components/PostList/styles";

const Post = () => {
    const { id } = useParams();
    const { data } = useGetPostByIdQuery(Number(id));
    if (!data) {
        return
    }
    return (
        <PostContainer >
            <PostDetails post={data} />
        </PostContainer >
    )
}

export default Post
