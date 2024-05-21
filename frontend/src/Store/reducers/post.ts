import { createSlice } from '@reduxjs/toolkit';

interface ProfileState {
    likedPostId: number | null;
}

const initialState: ProfileState = {
    likedPostId: null,
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
    }
});

export const { } = postSlice.actions;

export default postSlice.reducer;
