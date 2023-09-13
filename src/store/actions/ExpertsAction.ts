import { AppDispatch } from ".."
import axios from "../../axios"
import { InvitationForm } from "../../models/models"
import { errorAlert, successAlert } from "../../swal"
import { expertsSlice } from "../slices/ExpertsSlice"

export const getExperts = (limit: number, skip: number, search: string, filter: string) => {
    return (dispatch: AppDispatch) => {
        dispatch(expertsSlice.actions.fetching);
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
        axios.post('invitations/invite', invitation).then(res => {
            dispatch(expertsSlice.actions.success);
            successAlert()
        }).catch(res => {
            dispatch(expertsSlice.actions.error);
            errorAlert(res.response.data.message);
        })
    }
}
