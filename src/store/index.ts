import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserReducer from "./slices/UserSlice";
import AuthReducer from "./slices/AurhSlice";
import BlankSlice from "./slices/BlankSlice";
import BlanksSlice from "./slices/BlanksSlice";

const rootReducer = combineReducers({
    auth: AuthReducer,
    user: UserReducer,
    blank: BlankSlice,
    blanks: BlanksSlice
});

export function setupStore() {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];