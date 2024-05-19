import { PayloadAction, createSlice} from '@reduxjs/toolkit'

type EntryProps = {
    loginOpen : boolean,
    registerOpen : boolean,
    followedProfiles: number[], 
    isValidate: boolean,
}
const initialState:EntryProps = {
    loginOpen : false,
    registerOpen : false,
    followedProfiles: [], 
    isValidate : false,
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
        trueValidate( state){
            state.isValidate = true;
        },
        falseValidate( state){
            state.isValidate = false;
        },
    }
})
export const { openLogin, openRegister, closeModal, followedProfilesIds, trueValidate, falseValidate } = entrySlice.actions;

export default entrySlice.reducer;
