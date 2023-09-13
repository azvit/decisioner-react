import { IBlank, IGroupExpertise, ServerResponse } from "../../models/models"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface GroupExpertisesState {
    groupExpertises: IGroupExpertise<any>[],
    loading: boolean,
    error: string
}

const initialState: GroupExpertisesState = {
    groupExpertises: [],
    loading: false,
    error: ''
}

export const groupExpertisesSlice = createSlice({
    name: "groupExpertises",
    initialState,
    reducers: {
        fetching (state) {
            state.loading = true
        },
        gotBlanks (state, action: PayloadAction<IGroupExpertise<any>[]>) {
            state.groupExpertises = action.payload;
            state.loading = false
        },
        error (state, action: PayloadAction<ServerResponse>) {
            state.loading = false;
            state.error = action.payload.message
        },
        success (state) {
            state.loading = false
        }
    }
})

export default groupExpertisesSlice.reducer;