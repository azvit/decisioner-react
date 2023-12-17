import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hook/redux";
import { useLocation, useNavigate } from "react-router-dom";
import { acceptInvitation } from "../store/actions/ExpertsAction";
import { useEffect } from "react";
import { setBlank } from "../store/actions/BlankAction";

export function InvitationAccept () {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(window.location.search);
    const { loading, completed, error } = useAppSelector(state => state.experts)
    const key = queryParams.get("key")
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log(key)
        dispatch(acceptInvitation(key!))
    }, [])

    useEffect(() => {
        if (!loading) {
            navigate('/calculation?isEdit=true')  
        }
    }, [completed])

    return <div>
        {error && 
            <div>
                Даного запрошення не існує! Або ви не тот, кому адресоване це запрошення!            
            </div>
        }
    </div>
}