import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserSlice from "./slices/UserSlice";
import AuthSlice from "./slices/AurhSlice";
import BlankSlice from "./slices/BlankSlice";
import BlanksSlice from "./slices/BlanksSlice";
import GroupExpertisesSlice from "./slices/GroupExpertisesSlice";
import GroupExpertiseSlice from "./slices/GroupExpertiseSlice";
import ExpertsSlice from "./slices/ExpertsSlice";

const rootReducer = combineReducers({
    auth: AuthSlice,
    user: UserSlice,
    blank: BlankSlice,
    blanks: BlanksSlice,
    groupExpertises: GroupExpertisesSlice,
    groupExpertise: GroupExpertiseSlice,
    experts: ExpertsSlice
});

export function setupStore() {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];