import { PayloadAction, createSlice} from '@reduxjs/toolkit'

type ProfileProps = {
    modalOpen : boolean
    followedProfiles: number[]
    myUser: any
}
const initialState:ProfileProps = {
    modalOpen: false,
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
            state.modalOpen = true;
        },
        closeModalFollow(state) {
            state.modalOpen = false;
        },
    }
})
export const { updateFollowedProfiles, clearFollowed, openModalFollow, closeModalFollow, updateMyUser } = profileSlice.actions;

export default profileSlice.reducer;
