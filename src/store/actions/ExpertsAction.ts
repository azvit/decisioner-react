import { AppDispatch } from ".."
import axios from "../../axios"
import { InvitationForm } from "../../models/models"
import { errorAlert, successAlert } from "../../swal"
import { expertsSlice } from "../slices/ExpertsSlice"
import { setBlank } from "./BlankAction"

export const getExperts = (limit: number, skip: number, search: string, filter: string) => {
    return (dispatch: AppDispatch) => {
        dispatch(expertsSlice.actions.fetching());
        axios.get('invitations/experts', { params: {
            limit,
            skip,
            search,
            filter
        }}).then(res => {
            dispatch(expertsSlice.actions.setExperts(res.data));
        }).catch(res => {
            errorAlert(res.response.data.message);
            dispatch(expertsSlice.actions.error);
        })
    }
}
export const sendInvitation = (invitation: InvitationForm) => {
    return (dispatch: AppDispatch) => {
        dispatch(expertsSlice.actions.inviting());
        axios.post('invitations/invite', invitation).then(res => {
            dispatch(expertsSlice.actions.success());
            successAlert()
        }).catch(res => {
            dispatch(expertsSlice.actions.error(res.response.data.message));
            errorAlert(res.response.data.message);
        })
    }
}

export const acceptInvitation = (key: string) => {
    return (dispatch: AppDispatch) => {
        dispatch(expertsSlice.actions.fetching());
        axios.get('invitations/accept?key=' + key).then(res => {
            dispatch(setBlank(res.data))
            dispatch(expertsSlice.actions.success());
        }).catch(res => {
            dispatch(expertsSlice.actions.error(res.response.data.message));
            errorAlert(res.response.data.message);
        })
    }
}