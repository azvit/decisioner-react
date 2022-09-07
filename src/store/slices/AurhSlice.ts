import { IUser, ServerResponse } from "../../models/models"
import {ROLE_KEY, TOKEN_KEY, USER_ID_KEY} from "../../constants"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
    isLoggedIn: boolean
    token: string
    role: string
    loading: boolean
    error: string
    userId: string
}

interface AuthPayLoad {
    token: string,
    user: IUser,
    expiresIn: number,
    role: string
}

const initialState: AuthState = {
    isLoggedIn: Boolean(localStorage.getItem(TOKEN_KEY)),
    token: localStorage.getItem(TOKEN_KEY) ?? '',
    loading: false,
    error: '',
    userId: localStorage.getItem(USER_ID_KEY) ?? '',
    role: localStorage.getItem(ROLE_KEY) ?? ''
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        fetching(state) {
            state.loading = true
        },
        loginSuccess(state, action: PayloadAction<AuthPayLoad>) {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.loading = false;
            state.userId = action.payload.user._id;

            localStorage.setItem(USER_ID_KEY, action.payload.user._id);
            localStorage.setItem(TOKEN_KEY, action.payload.token);
            localStorage.setItem(ROLE_KEY, action.payload.role);
        },
        fetchError(state, action: PayloadAction<ServerResponse | Error>) {
            state.loading = false;
            state.error = action.payload.message;
        },
        logout(state) {
            localStorage.clear();
            state.isLoggedIn = false;
            state.token = '';
            state.role = '';
            state.error = '';
            state.userId = '';
        },
        signUpSuccess(state) {
            state.loading = false
        }
    }
})

export default authSlice.reducer;