import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, ServerResponse } from "../../models/models";

interface ExpertsState {
    experts: IUser[],
    count: number
    loading: boolean,
    completed: boolean,
    inviting: boolean
    error: string
}

interface ExpertsResponse {
    experts: IUser[],
    count: number
}

const initialState: ExpertsState = {
    experts: [],
    count: 0,
    loading: false,
    inviting: false,
    completed: false,
    error: ''
}

export const expertsSlice = createSlice({
    name: 'experts',
    initialState,
    reducers: {
        setExperts(state, action: PayloadAction<ExpertsResponse>) {
            state.experts = action.payload.experts;
            state.count = action.payload.count;
            state.loading = false;
        },
        fetching(state) {
            state.loading = true;
        },
        inviting(state) {
            state.inviting = true;
            console.log('inviting =' + state.inviting)
        },
        error(state, action: PayloadAction<ServerResponse>) {
            state.loading = false;
            state.error = action.payload.message
        },
        success(state) {
            state.inviting = false
            setTimeout(() => {
                state.completed = false
            }, 1000)
            state.completed = false
        }
    }
})

export default expertsSlice.reducer;
