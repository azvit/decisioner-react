import { useNavigate } from "react-router-dom";
import { AppDispatch } from "..";
import axios from "../../axios";
import { BlankForm, IBlank} from "../../models/models";
import { errorAlert, successAlert } from "../../swal";
import { blankSlice } from "../slices/BlankSlice";
import { blanksSlice } from "../slices/BlanksSlice";

export const setBlank = (blank: IBlank<any>) => {
    return (dispatch: AppDispatch) => {
        dispatch(blankSlice.actions.setBlank(blank));
    }
}

export const createBlank = (blank: BlankForm, userId: string | undefined) => {
    return (dispatch: AppDispatch) => {
        axios.post(`blanks/${userId}`, blank).then(() => {
            successAlert();
            dispatch(blankSlice.actions.complete());
        }).catch(res => {
            errorAlert(res.response.data.message);
        });
    }
}

export const getBlanks = (userId: string | undefined) => {
    return (dispatch: AppDispatch) => {
        dispatch(blanksSlice.actions.fetching());
        axios.get(`blanks/${userId}`).then(res => {
            dispatch(blanksSlice.actions.gotBlanks(res.data));
        }).catch(res => {
            errorAlert(res.response.data.message);
            console.log(res);
            dispatch(blanksSlice.actions.error(res.data.message))
        })
    }
}

export const getInvitations = (userId: string | undefined) => {
    return (dispatch: AppDispatch) => {
        dispatch(blanksSlice.actions.fetching());
        axios.get(`blanks/invitations/${userId}`).then(res => {
            dispatch(blanksSlice.actions.gotInvitations(res.data));
        }).catch(res => {
            errorAlert(res.response.data.message);
            console.log(res);
            dispatch(blanksSlice.actions.error(res.data.message))
        })
    }
}

export const acceptInvitation = (id: string | undefined, userId: string | undefined) => {
    return (dispatch: AppDispatch) => {
        dispatch(blanksSlice.actions.fetching());
        axios.get(`invitations/accept/${id}`).then(res => {
            dispatch(blanksSlice.actions.success());
            successAlert();
            dispatch(getBlanks(userId));
            dispatch(getInvitations(userId));
        }).catch(res => {
            errorAlert(res.response.data.message);
            console.log(res);
            dispatch(blanksSlice.actions.error(res.data.message))
        })
    }
}

export const declineInvitation = (id: string | undefined) => {
    return (dispatch: AppDispatch) => {
        dispatch(blanksSlice.actions.fetching());
        axios.get(`invitations/decline/${id}`).then(res => {
            successAlert();
        }).catch(res => {
            errorAlert(res.response.data.message);
            console.log(res);
            dispatch(blanksSlice.actions.error(res.data.message))
        })
    }
}

export const deleteBlank = (id: string | undefined) => {
    return (dispatch: AppDispatch) => {
        dispatch(blanksSlice.actions.fetching());
        axios.delete(`blanks/${id}`).then(res => {
            dispatch(blanksSlice.actions.success());
            successAlert();
        }).catch(res => {
            dispatch(blanksSlice.actions.error(res.data.message));
            errorAlert(res.response.data.message);
        })
    }
}

export const editBlank = (changes: any, id: string | undefined) => {
    return (dispatch: AppDispatch) => {
        axios.put(`blanks/${id}`, changes).then((res) => {
            
            successAlert();
            dispatch(blankSlice.actions.complete());
        }).catch(res => {
            errorAlert(res.response.data.message);
        }) 
    }
}

export const confirmBlank = (id: string | undefined) => {
    return (dispatch: AppDispatch) => {
        axios.put(`blanks/confirm/${id}`).then((res) => {
            successAlert();
            dispatch(blankSlice.actions.complete());
        }).catch(res => {
            errorAlert(res.response.data.message);
        }) 
    }
}

export const resetBlank = () => {
    return (dispatch: AppDispatch) => {
        dispatch(blankSlice.actions.resetBlank());
    }
}