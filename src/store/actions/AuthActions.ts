import { AppDispatch } from "..";
import axios from "../../axios"
import { AuthData, IUser, ServerResponse } from "../../models/models";
import { authSlice } from "../slices/AurhSlice";

interface AuthResponse {
    token: string,
    user: IUser,
    expiresIn: number,
    role: string,
    message: string
}

interface SignUpData {
    login: string,
    password: string,
    email: string,
    phone: string,
    name: string,
    degree: string,
    academicStatus: string,
    direction: string,
    activitySphere: string
}

export const signIn = (authData: AuthData) => {
    return (dispatch: AppDispatch) => {
        dispatch(authSlice.actions.fetching());
        axios.post<AuthResponse>('api/signin', authData).then(res => {
            dispatch(authSlice.actions.loginSuccess({
                token: res.data.token,
                role: res.data.role,
                expiresIn: res.data.expiresIn,
                user: res.data.user
            }));
        }).catch(err => {
            dispatch(authSlice.actions.fetchError({
                message: err.response.data.message
            }))
        })
    }
}

export const getUser = () => {
    return (dispatch: AppDispatch) => {
        axios.post<AuthResponse>('user/').then(res => {
            dispatch(authSlice.actions.loginSuccess({
                token: res.data.token,
                role: res.data.role,
                expiresIn: res.data.expiresIn,
                user: res.data.user
            }));
        }).catch(err => {
            dispatch(authSlice.actions.fetchError({
                message: err.response.data.message
            }))
        })
    }
}


export const signUp = (signUpData: SignUpData) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(authSlice.actions.fetching());
            const response = await axios.post<ServerResponse>("api/signup/expert", signUpData);
            if (response.status === 200) {
                dispatch(authSlice.actions.signUpSuccess());
            } else {
                dispatch(authSlice.actions.fetchError({
                    message: response.data.message
                }));
            }
        } catch(e) {
            dispatch(authSlice.actions.fetchError(e as Error));
        }
    }
}

export const logout = () => {
    return (dispatch: AppDispatch) => {
        dispatch(authSlice.actions.logout());
    }
}