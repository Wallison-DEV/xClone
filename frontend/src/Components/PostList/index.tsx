import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootReducer } from "../../Store";
import { useListFollowedPostsQuery, useListSuggestedPostsQuery } from '../../Services/api'

import * as S from './styles'

import Retweet from "../Retweet";
import Tweet from "../Tweet";
import PostForm from "../PostForm";

const PostList = () => {
    const token = useSelector((state: RootReducer) => state.token)
    const [posts, setPosts] = useState<(PostProps | RetweetProps)[]>([]);
    const [typePostsAll, setTypePostsAll] = useState(false)
    const {
        data: followedPosts,
        isLoading: isLoadingFollowedPosts,
    } = useListFollowedPostsQuery(token?.accessToken || '');

    const {
        data: suggestedPosts,
        isLoading: isLoadingSuggestedPosts,
    } = useListSuggestedPostsQuery(token?.accessToken || '');

    useEffect(() => {
        if (window.location.pathname === "/home") {
            if (typePostsAll && suggestedPosts) {
                setPosts(suggestedPosts);
            } else if (!typePostsAll && followedPosts) {
                setPosts(followedPosts);
            }
        }
    }, [typePostsAll, suggestedPosts, followedPosts]);

    return (
        <S.PostContainer>
            <S.StyledHeader>
                <button onClick={() => setTypePostsAll(false)} className={typePostsAll === false ? 'is-selected' : ''}><p>Seguindo</p></button>
                <button onClick={() => setTypePostsAll(true)} className={typePostsAll === true ? 'is-selected' : ''}><p>Para você</p></button>
            </S.StyledHeader>
            <PostForm isNotModal={true} />
            <div>
                {isLoadingFollowedPosts || isLoadingSuggestedPosts ? (
                    <h1>Carregando</h1>
                ) : (
                    <>
                        {
                            posts ? (
                                posts.map((post) => (
                                    <div key={post.id}>
                                        {('tweet_id' in post) ? (<Retweet props={post} />) : (<Tweet props={post} />)}
                                    </ div>
                                ))
                            ) : (
                                <div className="container margin-top">Não há postagens disponíveis</div>
                            )
                        }
                    </>
                )}
            </div>
        </ S.PostContainer>
    )
}

export default PostList