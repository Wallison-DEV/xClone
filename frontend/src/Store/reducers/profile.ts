import { PayloadAction, createSlice} from '@reduxjs/toolkit'

type ProfileProps = {
    modalFollowOpen : boolean
    modalEditProfileOpen : boolean
    followedProfiles: number[]
    myUser: any
}
const initialState:ProfileProps = {
    modalFollowOpen: false,
    modalEditProfileOpen : false,
    followedProfiles: [], 
    myUser: null,
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateMyUser(state, action: PayloadAction<any>) {
            state.myUser = action.payload
        },
        updateFollowedProfiles(state, action) {
            const { profileId, type } = action.payload;
            const index = state.followedProfiles.indexOf(profileId);
            if (type === 'add' && index === -1) {
                state.followedProfiles.push(profileId);
            } else if (type === 'remove' && index !== -1) {
                state.followedProfiles.splice(index, 1);
            }
        },
        clearFollowed(state) {
            state.followedProfiles = [];
        },
        openModalFollow(state){
            state.modalFollowOpen = true;
        },
        closeModalFollow(state) {
            state.modalFollowOpen = false;
        },
        openModalEditProfile(state){
            state.modalEditProfileOpen = true;
        },
        closeModalEditProfile(state) {
            state.modalEditProfileOpen = false;
        },
    }
})
export const { updateFollowedProfiles, clearFollowed, openModalFollow, closeModalFollow, updateMyUser, closeModalEditProfile, openModalEditProfile } = profileSlice.actions;

export default profileSlice.reducer;
