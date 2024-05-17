import { PayloadAction, createSlice} from '@reduxjs/toolkit'

type ModalProps = {
    loginOpen : boolean,
    registerOpen : boolean,
    followedProfiles: number[], 
}
const initialState:ModalProps = {
    loginOpen : false,
    registerOpen : false,
    followedProfiles: [], 
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
        }
    }
})
export const { openLogin, openRegister, closeModal, followedProfilesIds } = entrySlice.actions;

export default entrySlice.reducer;
