import { IBlank, ServerResponse } from "../../models/models"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface BlanksState {
    blanks: IBlank<any>[],
    invitations: any[],
    loading: boolean,
    error: string,
    completed: boolean
}

const initialState: BlanksState = {
    blanks: [],
    invitations: [],
    loading: false,
    error: '',
    completed: false
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
        gotInvitations (state, action: PayloadAction<any[]>) {
            state.invitations = action.payload;
            state.loading = false
        },
        error (state, action: PayloadAction<ServerResponse>) {
            state.loading = false;
            state.error = action.payload.message
        },
        success (state) {
            state.loading = false
            state.completed = true
            setTimeout(() => {
                state.completed = false
            }, 500)
        }
    }
})

export default blanksSlice.reducer;