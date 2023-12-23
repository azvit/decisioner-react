import { IUser, ServerResponse } from "../../models/models"
import {EXPIRES_AT_KEY, ROLE_KEY, TOKEN_KEY, USER_ID_KEY} from "../../constants"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import moment from "moment"

interface AuthState {
    isLoggedIn: boolean
    token: string
    role: string
    loading: boolean
    error: string
    userId: string
    user: IUser | null
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
    role: localStorage.getItem(ROLE_KEY) ?? '',
    user: null
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
            state.user = action.payload.user;
            state.role = action.payload.user.role;
            let expiresAt = moment().add(action.payload.expiresIn, 'second');

            localStorage.setItem(USER_ID_KEY, action.payload.user._id);
            localStorage.setItem(TOKEN_KEY, action.payload.token);
            localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString())
            localStorage.setItem(ROLE_KEY, action.payload.role);
        },
        fetchError(state, action: PayloadAction<ServerResponse | Error>) {
            state.loading = false;
            state.error = action.payload.message;
        },
        gotUser(state, action: PayloadAction<IUser>) {
            state.user = action.payload;
            state.userId = action.payload._id
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