declare type tokenStore = {
    accessToken: string | null
    refreshToken: string | null
    accessTokenExp: number | null
}

declare type ButtonProps = {
    variant: 'light' | 'dark' | 'blue' | 'lightblue'
    children: React.ReactNode | string
    type?: 'button' | 'submit' | 'reset' | 'link'
    className?: string
    onClick?: () => void
    maxwidth?: string
}

declare interface PostProps {
    id: number;
    user: User;
    media: string | null;
    content: string;
    created_at: string;
    likes: {
        count: number;
        liked_by: UserProfile[];
    };
    comments: Comment[];
    retweets?: RetweetProps[]; 
}

declare interface RetweetProps {
    id: number;
    user: User;
    media: string | null;
    content: string;
    created_at: string;
    tweet_id: number;
    likes: {
        count: number;
        liked_by: UserProfile[];
    };
    comments: Comment[];
}

declare interface User {
    id: number;
    username: string;
    profile_image: string | null;
}

declare interface Comment {
    id: number;
    user: User;
    content: string;
    created_at: string;
    media: string | null;
    content_type: number;
    object_id: number;
    content_object: string;
}

declare type UserProfile = {
    id: number;
    username: string;
    arroba: string;
    email: string;
    bio: string;
    followers: { id: string; username: string }[];
    following: { id: string; username: string }[];
    profile_image: string | null;
    background_image: string | null;
    created_at: string;
};