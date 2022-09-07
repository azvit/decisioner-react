import { IUser } from "../../models/models"
import {TOKEN_KEY, USER_KEY} from "../../constants"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UserState {
    isLoggedIn: boolean
    token: string
    role: string
    loading: boolean
    user: IUser | null
    error: string
}

interface UserPayLoad {
    token: string,
    user: IUser,
    expiresIn: number,
    role: string
}

const initialState: UserState = {
    isLoggedIn: Boolean(localStorage.getItem(TOKEN_KEY)),
    token: localStorage.getItem(TOKEN_KEY) ?? '',
    user: JSON.parse(localStorage.getItem(USER_KEY) ?? '{}') ?? null,
    loading: false,
    error: '',
    role: ''
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state) {
            state.loading = true
        },
        loginSuccess(state, action: PayloadAction<UserPayLoad>) {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.loading = false;

            localStorage.setItem(TOKEN_KEY, action.payload.token);
            localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
        },
        loginError(state, action: PayloadAction<Error>) {
            state.loading = false;
            state.error = action.payload.message;
        }
    }
})

export default userSlice.reducer;