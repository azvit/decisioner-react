import {Add, CheckCircle, Delete, Edit, Mail, MailOutline, Send} from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "../axios";
import { useAppDispatch, useAppSelector } from "../hook/redux";
import { IBlank } from "../models/models";
import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";
import { deleteBlank, editBlank, getBlanks, resetBlank, setBlank } from "../store/actions/BlankAction";
import { questionModal } from "../swal";
import { calculateGroupExpertise, confirmGroupExpertise, deleteGroupExpertise, editGroupExpertise, getGroupExpertises, resetGroupExpertise, setGroupExpertise } from "../store/actions/GroupExpertiseAction";


export function GroupExpertisesPage() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { userId } = useAppSelector(state => state.auth);
    const { groupExpertises, loading, error } = useAppSelector(state => state.groupExpertises);
    const [groupExpertiseList, setGroupExpertiseList] = useState(groupExpertises ?? [])
    const { completed } = useAppSelector(state => state.blank)

    const newGroupExpertise = () => {
        dispatch(resetGroupExpertise());
        navigate('/group-expertise');
    }

    const goToGroupExpertise = (index: number) => {
        dispatch(setGroupExpertise(groupExpertiseList[index]));
        navigate('/group-expertise')
    }

    /*const goToCalculation = (index: number) => {
        dispatch(setBlank(groupExpertiseList[index]));
        navigate(`/calculation?isEdit=true`);
    }*/

    const goToInvitation = (index: number) => {
        dispatch(setGroupExpertise(groupExpertiseList[index]))
        navigate('/group-expertise/invitations');
    }

    const goToResult = (index: number) => {
        dispatch(setGroupExpertise(groupExpertiseList[index]))
        navigate(`/group-expertise/result`);
    }

    const groupExpertiseDelete = (index: number) => {
        questionModal(t("blank_delete_modal")).then(res => {
            if (res.isConfirmed) {
                dispatch(deleteGroupExpertise(groupExpertiseList[index]._id))
                setTimeout(() => {
                    dispatch(getGroupExpertises(userId))
                }, 500)
            }
        })
    }

    const confirmGroupExp = (index: number) => {
        questionModal(t("blank_confirm_modal")).then(res => {
            if (res.isConfirmed) {
                dispatch(confirmGroupExpertise(groupExpertiseList[index]._id));
                setTimeout(() => {
                    dispatch(getGroupExpertises(userId))
                }, 500)

            }
        })
    }

    useEffect(() => {
        dispatch(resetGroupExpertise());
        dispatch(getGroupExpertises(userId));
    }, []);

    useEffect(() => {
        if (completed) {
            dispatch(resetGroupExpertise());
            dispatch(getGroupExpertises(userId));
        }
    }, [completed])

    useEffect(() => {
        setGroupExpertiseList(groupExpertises);
    }, [groupExpertises])

    return(
        <div>
            <h1 className="text-center font-bold text-2xl">{t("blanks_page_header")}</h1>
            <div className="border text-center m-auto">
                <Button onClick={newGroupExpertise} variant="contained" className="left-50"><Add/>{t('blanks_page_create_button')}</Button>
            </div>
            <div className="sm:flex">
            <div className="sm:w-[50%] border shadow-md text-center">
                {
                    loading && <CircularProgress/>
                }
                { (!error && groupExpertiseList) &&
                    groupExpertiseList.map((groupExpertise, index) =>
                        !groupExpertise.isClosed &&
                        <div key={groupExpertise._id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {groupExpertise.name}
                                        </Typography>
                                        <Typography>
                                            {t('blank_item_creation_date')}<Moment format="DD.MM.YYYY">{groupExpertise.creationDate}</Moment>
                                        </Typography>
                                    </CardContent>
                                        <CardActions>
                                            <Button onClick={() => {goToGroupExpertise(index)}} variant="contained" size="small"><Edit/>{t('blank_item_edit_button')}</Button>
                                            <Button onClick={() => {groupExpertiseDelete(index)}} variant="contained" size="small"><Delete/>{t('blank_item_delete_button')}</Button>
                                            <Button onClick={() => {confirmGroupExp(index)}} variant="contained" size="small">{t('blank_item_confirm_button')}</Button>
                                        </CardActions>

                                </Card>

                        </div>
                    )
                }
            </div>
            <div className="sm:w-[50%] border shadow-md text-center">
                {
                    loading && <CircularProgress/>
                }
                { (!error && groupExpertiseList) &&
                    groupExpertiseList.map((groupExpertise, index) =>
                        groupExpertise.isClosed &&
                        <div key={groupExpertise._id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {groupExpertise.name}
                                        </Typography>
                                        <Typography>
                                            {t('blank_item_creation_date')}<Moment format="DD.MM.YYYY">{groupExpertise.creationDate}</Moment>
                                        </Typography>
                                    </CardContent>
                                        <CardActions>
                                            <Button></Button>
                                            {(groupExpertise.blanks.length !== 0) &&  <Button onClick={() => {goToResult(index)}} variant="contained" size="small"><span><CheckCircle/>{t('blank_item_result_button')}</span></Button>}
                                            <Button onClick={() => {goToInvitation(index)}} variant="contained" size="small"><Mail/>{t('group_invite_button')}</Button>
                                            <Button onClick={() => {groupExpertiseDelete(index)}} variant="contained" size="small"><Delete/>{t('blank_item_delete_button')}</Button>
                                        </CardActions>
                                </Card>

                        </div>
                    )
                }
            </div>
            </div>
        </div>
    )
}
