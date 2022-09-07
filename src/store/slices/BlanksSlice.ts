import { IBlank, ServerResponse } from "../../models/models"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface BlanksState {
    blanks: IBlank<any>[],
    loading: boolean,
    error: string
}

const initialState: BlanksState = {
    blanks: [],
    loading: false,
    error: ''
}

export const blanksSlice = createSlice({
    name: "blanks",
    initialState,
    reducers: {
        fetching (state) {
            state.loading = true
        },
        gotBlanks (state, action: PayloadAction<IBlank<any>[]>) {
            state.blanks = action.payload;
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

export default blanksSlice.reducer;