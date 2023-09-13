import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, ServerResponse } from "../../models/models";

interface ExpertsState {
    experts: IUser[],
    count: number
    loading: boolean,
    completed: boolean,
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
        error(state, action: PayloadAction<ServerResponse>) {
            state.loading = false;
            state.error = action.payload.message
        },
        success(state) {
            state.completed = true;
            setTimeout(() => {
                state.completed = false
            }, 1000)
        }
    }
})

export default expertsSlice.reducer;
