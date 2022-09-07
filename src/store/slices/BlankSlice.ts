import { IBlank, IUser, ServerResponse } from "../../models/models"
import {ROLE_KEY, TOKEN_KEY, USER_ID_KEY} from "../../constants"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface BlankState {
    currentBlank: IBlank<any> | null,
    completed: boolean
}

const initialState: BlankState = {
    currentBlank: null,
    completed: false
}

export const blankSlice = createSlice({
    name: "blank",
    initialState,
    reducers: {
        setBlank(state, action: PayloadAction<IBlank<any> | null>) {
            state.currentBlank = action.payload
        },
        resetBlank(state) {
            state.currentBlank = null;
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

export default blankSlice.reducer;