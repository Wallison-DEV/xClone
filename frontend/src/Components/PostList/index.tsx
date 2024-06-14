import { useEffect, useState } from "react";
import { useListFollowedPostsQuery, useListSuggestedPostsQuery } from '../../Services/api';
import * as S from './styles';
import Retweet from "../Retweet";
import Tweet from "../Tweet";
import PostForm from "../PostForm";
import Loader from "../Loader";

const PostList = () => {
    const accessToken = localStorage.getItem('accessToken') || '';
    const [posts, setPosts] = useState<(PostProps | RetweetProps)[]>([]);
    const [typePostsAll, setTypePostsAll] = useState(false);
    const { data: followedPosts, isLoading: isLoadingFollowedPosts } = useListFollowedPostsQuery(accessToken);
    const { data: suggestedPosts, isLoading: isLoadingSuggestedPosts } = useListSuggestedPostsQuery(accessToken);

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
            <S.PostList>
                {isLoadingFollowedPosts || isLoadingSuggestedPosts ? (
                    <Loader />
                ) : (
                    <>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post.id}>
                                    {('tweet_id' in post) ? (<Retweet props={post} />) : (<Tweet props={post} />)}
                                </div>
                            ))
                        ) : (
                            <S.NoPostsContainer>
                                Não há postagens disponíveis
                            </S.NoPostsContainer>
                        )}
                    </>
                )}
            </S.PostList>
        </S.PostContainer>
    );
};

export default PostList;
