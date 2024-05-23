import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type LoginRequestBody = {
    username_or_email: string;
    password: string;
};

type LoginResponse = {
    access: string;
    exp: number;
    refresh: string;
};

type FilterPostRequest = {
    content: string; 
    accessToken: string;
};

type BasicQueryProps = {
    id: number;
    accessToken: string;
}

type AddLikeRequest = {
    postId: number;
    accessToken: string;
}

const api = createApi({
    reducerPath: '',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://wallison.pythonanywhere.com/'
    }),
    endpoints: (builder) => ({
        DoLogin: builder.mutation<LoginResponse, LoginRequestBody>({
            query: (body: any) => ({
                url: 'api/token/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body, 
            })
        }),
        getMyuser: builder.query<UserProfile, string>({
            query: (accessToken) => ({
                url: `my-user/`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            })
        }),
        listUnfollowedUsers: builder.query<UserProfile, string>({
            query: (accessToken)=> ({
                url: 'other-unfollowed-users/',
                headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
            })
        }),
        follow: builder.mutation<UserProfile, BasicQueryProps>({
            query: ({ id, accessToken }) => ({
                url: `users/${id}/follow/`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            })
        }),
        unfollow: builder.mutation<UserProfile, BasicQueryProps>({
            query: ({ id, accessToken }) => ({
                url: `users/${id}/unfollow/`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            })
        }),
        listFollowedPosts: builder.query<(PostProps | RetweetProps)[], string>({
            query: (accessToken)=> ({
                url: 'followed-feed/',
                headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
            })
        }),
        listSuggestedPosts: builder.query<(PostProps | RetweetProps)[], string>({
            query: (accessToken)=> ({
                url: 'suggested-feed/',
                headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
            })
        }),
        filterPost: builder.query<(PostProps | RetweetProps)[], FilterPostRequest>({
            query: ({ content, accessToken }) => ({
                url: `combined/?content=${encodeURIComponent(content)}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            })
        }),
        getPostUserId: builder.query<(PostProps | RetweetProps)[], BasicQueryProps>({
            query: ({ id, accessToken }: BasicQueryProps) => ({
                url: `user-feed/${id}/`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            })
        }),
        doPost: builder.mutation({
            query: ({ body, accessToken }) => ({
                url: `create-post/`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body
            })
        }),
        filterUser: builder.query<UserProfile[], FilterPostRequest>({
            query: ({ content, accessToken }) => ({
                url: `users/?username=${encodeURIComponent(content)}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            })
        }),
        getUserById: builder.query<UserProfile, number>({
            query: (id) => `users/${id}/`, 
        }),
        doComment: builder.mutation<any, any>({
            query: ({ content, content_type, object_id, media, accessToken }) => ({
                url: `comments/`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: {
                    content, content_type, object_id, media
                }
            })
        }),
        doRepost: builder.mutation({
            query: ({ content, tweet, media, accessToken }) => ({
                url: `create-retweet/`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: { content, tweet, media }
            })
        }),
        addLikeTweet: builder.mutation<any, AddLikeRequest>({
            query: ({ postId, accessToken }) => ({
                url: `post/${postId}/add-like/`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: { post_id: postId } 
            }),
        }),
        addLikeRetweet: builder.mutation<any, AddLikeRequest>({
            query: ({ postId, accessToken }) => ({
                url: `retweet/${postId}/add-like/`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: { post_id: postId } 
            }),
        }),
        getPostById: builder.query<(PostProps), number>({
            query: (id) => `posts/${id}/`, 
        }),
        deleteTweetById: builder.mutation({
            query: ({ id, accessToken }) => ({
                url: `posts/${id}/`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }),
        }),
        deleteRetweetById: builder.mutation({
            query: ({ id, accessToken }) => ({
                url: `retweet/${id}/`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }),
        }),
        updateProfile : builder.mutation({
            query: ({ body, accessToken }) => ({
                url: `update-profile/`,
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body
            }),
        }),
        updateTweet : builder.mutation({
            query: ({ body, accessToken }) => ({
                url: `update-tweet/`,
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body
            }),
        }),
        updateRetweet : builder.mutation({
            query: ({ body, accessToken }) => ({
                url: `update-retweet/`,
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body
            }),
        }),
    })
})

export const { 
    useDoLoginMutation, 
    useListUnfollowedUsersQuery, 
    useFollowMutation, 
    useUnfollowMutation,
    useListFollowedPostsQuery,
    useListSuggestedPostsQuery,
    useDoPostMutation,
    useFilterPostQuery,
    useFilterUserQuery,
    useGetUserByIdQuery,
    useGetPostUserIdQuery,
    useGetMyuserQuery,
    useAddLikeTweetMutation,
    useDoCommentMutation,
    useAddLikeRetweetMutation,
    useGetPostByIdQuery,
    useDoRepostMutation,
    useUpdateProfileMutation,
    useUpdateTweetMutation,
    useUpdateRetweetMutation,
    useDeleteTweetByIdMutation,
    useDeleteRetweetByIdMutation,
} = api;

export default api;
