import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ProfileState {
    modalPostOpen: boolean;
    modalLikesOpen: Record<number, boolean>;
    likedPostId: number | null;
}

const initialState: ProfileState = {
    modalPostOpen: false,
    modalLikesOpen: {},
    likedPostId: null,
};

const postSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        openModalLikes(state, action: PayloadAction<number>) {
            const postId = action.payload;
            state.modalLikesOpen[postId] = true;
            state.modalPostOpen= true;
        },
        closeModalLikes(state, action: PayloadAction<number>) { 
            const postId = action.payload;
            state.modalLikesOpen[postId] = false;
            state.modalPostOpen= false;
        },
        openModalPost(state) {
            state.modalPostOpen = true;
        },
        closeModalPost(state) {
            state.modalPostOpen = false;
        },
    }
});

export const { openModalLikes, closeModalLikes, openModalPost, closeModalPost } = postSlice.actions;

export default postSlice.reducer;
