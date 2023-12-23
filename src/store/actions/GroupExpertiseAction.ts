import { useNavigate } from "react-router-dom";
import { AppDispatch } from "..";
import axios from "../../axios";
import { BlankForm, GroupExpertiseForm, IBlank, IGroupExpertise} from "../../models/models";
import { errorAlert, successAlert } from "../../swal";
import { blankSlice } from "../slices/BlankSlice";
import { blanksSlice } from "../slices/BlanksSlice";
import { groupExpertiseSlice } from "../slices/GroupExpertiseSlice";
import { groupExpertisesSlice } from "../slices/GroupExpertisesSlice";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory();

export const setGroupExpertise = (groupExpertise: IGroupExpertise<any>) => {
    return (dispatch: AppDispatch) => {
        dispatch(groupExpertiseSlice.actions.setGroupExpertise(groupExpertise));
    }
}

export const createGroupExpertise = (groupExpertise: GroupExpertiseForm) => {
    return (dispatch: AppDispatch) => {
        axios.post(`group-expertises`, groupExpertise).then(() => {
            successAlert();
            dispatch(groupExpertiseSlice.actions.complete());
        }).catch(res => {
            errorAlert(res.response.data.message);
        });
    }
}

export const getGroupExpertises = (userId: string | undefined) => {
    return (dispatch: AppDispatch) => {
        dispatch(groupExpertisesSlice.actions.fetching());
        axios.get(`group-expertises/${userId}`).then(res => {
            console.log(res.data)
            dispatch(groupExpertisesSlice.actions.gotBlanks(res.data));
        }).catch(res => {
            errorAlert(res.response.data.message);
            console.log(res);
            dispatch(blanksSlice.actions.error(res.data.message))
        })
    }
}

export const deleteGroupExpertise = (id: string | undefined) => {
    return (dispatch: AppDispatch) => {
        dispatch(groupExpertisesSlice.actions.fetching());
        axios.delete(`group-expertises/${id}`).then(res => {
            dispatch(groupExpertisesSlice.actions.success());
            successAlert();
        }).catch(res => {
            dispatch(groupExpertisesSlice.actions.error(res.data.message));
            errorAlert(res.response.data.message);
        })
    }
}

export const editGroupExpertise = (changes: any, id: string | undefined) => {
    return (dispatch: AppDispatch) => {
        axios.put(`group-expertises/${id}`, changes).then((res) => {
            successAlert();
            dispatch(groupExpertiseSlice.actions.complete());
        }).catch(res => {
            errorAlert(res.response.data.message);
        }) 
    }
}

export const confirmGroupExpertise = (id: string | undefined) => {
    return (dispatch: AppDispatch) => {
        axios.put(`group-expertises/confirm/${id}`).then((res) => {
            successAlert();
            dispatch(blankSlice.actions.complete());
        }).catch(res => {
            errorAlert(res.response.data.message);
        }) 
    }
}

export const resetGroupExpertise = () => {
    return (dispatch: AppDispatch) => {
        dispatch(groupExpertiseSlice.actions.resetGroupExpertise());
    }
}

export const calculateGroupExpertise = (id: string, expertsWeight: number[] = []) => {
    return(dispatch: AppDispatch) => {
        dispatch(groupExpertiseSlice.actions.agregating());
        axios.get(`agregation/${id}`, {params: {expertsWeight}}).then((res) => {
            dispatch(groupExpertiseSlice.actions.setGroupExpertise(res.data))
            dispatch(groupExpertiseSlice.actions.complete());
        }).catch(res => {
            errorAlert(res.response.data.message)
        })
    }
}