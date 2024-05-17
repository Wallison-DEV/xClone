import { createSlice, PayloadAction} from '@reduxjs/toolkit'

const initialState:tokenStore = {
    accessToken: null,
    refreshToken: null,
    accessTokenExp: null,
}

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        updateTokens: (state, action: PayloadAction<tokenStore>) => {
            const { accessToken, accessTokenExp, refreshToken } = action.payload;
            state.accessToken = accessToken;
            state.accessTokenExp = accessTokenExp;
            state.refreshToken = refreshToken;
        },
        clearTokens: (state) => {
            state.accessToken = null;
            state.accessTokenExp = null;
            state.refreshToken = null;
        },
    }
})
export const { updateTokens, clearTokens } = tokenSlice.actions;

export default tokenSlice.reducer;
