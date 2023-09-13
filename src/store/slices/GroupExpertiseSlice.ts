import { IBlank, IGroupExpertise, IUser, ServerResponse } from "../../models/models"
import {ROLE_KEY, TOKEN_KEY, USER_ID_KEY} from "../../constants"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface GroupExpertiseState {
    currentGroupExpertise: IGroupExpertise<any> | null,
    completed: boolean
}

const initialState: GroupExpertiseState = {
    currentGroupExpertise: null,
    completed: false
}

export const groupExpertiseSlice = createSlice({
    name: "groupExpertise",
    initialState,
    reducers: {
        setGroupExpertise(state, action: PayloadAction<IGroupExpertise<any> | null>) {
            console.log(action.payload)
            state.currentGroupExpertise = action.payload
        },
        resetGroupExpertise(state) {
            state.currentGroupExpertise = null;
            state.completed = false
        },
        complete(state) {
            state.completed = true;
            setTimeout(() => {
                state.completed = false
            }, 1000)
        }
    }
})

export default groupExpertiseSlice.reducer;