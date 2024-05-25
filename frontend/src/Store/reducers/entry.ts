import { PayloadAction, createSlice} from '@reduxjs/toolkit'

type EntryProps = {
    loginOpen : boolean,
    registerOpen : boolean,
    followedProfiles: number[], 
    isAuthenticated: boolean,
    isCheckingAuth: boolean,
    checkAuth: boolean,
}
const initialState:EntryProps = {
    loginOpen : false,
    registerOpen : false,
    followedProfiles: [], 
    isAuthenticated: false,
    isCheckingAuth: false,
    checkAuth: false,
}

const entrySlice = createSlice({
    name: 'entry',
    initialState,
    reducers: {
        openLogin(state) {
            state.loginOpen = true;
            state.registerOpen = false; 
        },
        openRegister(state) {
            state.registerOpen = true;
            state.loginOpen = false; 
        },
        closeModal(state) {
            state.loginOpen = false;
            state.registerOpen = false;
        },
        followedProfilesIds(state, action:PayloadAction<number>) {
            state.followedProfiles.push(action.payload); 
        },
        checkingAuthentication(state) {
            state.isCheckingAuth = true;
        },
        authenticationSuccess(state) {
            state.isAuthenticated = true;
            state.isCheckingAuth = false;
        },
        authenticationFailed(state) {
            state.isAuthenticated = false;
            state.isCheckingAuth = false;
        },
        toggleCheckAuth(state) {
            state.checkAuth = !state.checkAuth;
        }
    }
})
export const { openLogin, openRegister, closeModal, followedProfilesIds, checkingAuthentication, authenticationFailed, authenticationSuccess, toggleCheckAuth } = entrySlice.actions;

export default entrySlice.reducer;
