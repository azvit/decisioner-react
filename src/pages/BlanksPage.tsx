import { Add, CheckCircle, Delete, Edit } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "../axios";
import { useAppDispatch, useAppSelector } from "../hook/redux";
import { IBlank } from "../models/models";
import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";
import { acceptInvitation, confirmBlank, declineInvitation, deleteBlank, editBlank, getBlanks, getInvitations, resetBlank, setBlank } from "../store/actions/BlankAction";
import { questionModal } from "../swal";


export function BlanksPage() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { userId } = useAppSelector(state => state.auth);
    const { blanks, invitations, loading, error } = useAppSelector(state => state.blanks);
    const { currentBlank } = useAppSelector(state => state.blank)
    const [blankList, setBlankList] = useState(blanks ?? []);
    const [invitationList, setInvitationList] = useState(invitations ?? []);
    const { completed } = useAppSelector(state => state.blank)
    let invitationC = [];

    const newBlank = () => {
        dispatch(resetBlank());
        navigate('/blank');
    }

    const goToBlank = (index: number) => {
        dispatch(setBlank(blankList[index]));
        navigate('/blank')
    }

    const goToCalculation = (index: number) => {
        dispatch(setBlank(blankList[index]));
        navigate(`/calculation?isEdit=true`);
    }

    const goToResult = (index: number) => {
        dispatch(setBlank(blankList[index]));
        navigate(`/calculation?isEdit=false`);
    }

    const blankDelete = (index: number) => {
        questionModal(t("blank_delete_modal")).then(res => {
            if (res.isConfirmed) {
                dispatch(deleteBlank(blankList[index]._id))
                setTimeout(() => {
                    dispatch(getBlanks(userId))
                }, 500)
            }
        })
    }

    const confBlank = (index: number) => {
        questionModal(t("blank_confirm_modal")).then(res => {
            if (res.isConfirmed) {
                dispatch(confirmBlank(blankList[index]._id));
                setTimeout(() => {
                    dispatch(getBlanks(userId))
                }, 500)
                
            }
        })
    }

    const invitationAccept = (index: number) => {
        questionModal('Прийняти запрошення на цю експертизу?').then(res => {
            if (res.isConfirmed) {
                dispatch(acceptInvitation(invitationList[index]._id, userId));
                dispatch(getBlanks(userId))
                dispatch(getInvitations(userId));
                invitationC = JSON.parse(JSON.stringify(invitationList));
                delete invitationC[index];
                setInvitationList(invitationC);
            }
        })
    }

    const invitationDecline = (index: number) => {
        questionModal('Відмовитись від запрошення на цю експертизу?').then(res => {
            if (res.isConfirmed) {
                dispatch(declineInvitation(invitationList[index]._id));
                dispatch(getInvitations(userId));
            }
        })
    };

    useEffect(() => {
        dispatch(resetBlank());
        dispatch(getBlanks(userId)); 
        dispatch(getInvitations(userId));
    }, []);

    useEffect(() => {
        if (completed) {
            dispatch(resetBlank());
            dispatch(getBlanks(userId));  
        }
    }, [completed])

    useEffect(() => {
        setBlankList(blanks);
        setInvitationList(invitations)
    }, [blanks])

    return(
        <div>
            <h1 className="text-center font-bold text-2xl">{t("blanks_page_header")}</h1>
            <div className="border text-center m-auto">
                <Button onClick={newBlank} variant="contained" className="left-50"><Add/>{t('blanks_page_create_button')}</Button>
            </div>
            <div className="sm:flex">
            <div className="sm:w-[50%] border shadow-md text-center">
                {
                    loading && <CircularProgress/>
                }
                { (!error && blankList) &&
                    blankList.map((blank, index) =>
                        !blank.isClosed &&
                        <div key={blank._id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {blank.name}
                                        </Typography>
                                        <Typography>
                                            {t('blank_item_creation_date')}<Moment format="DD.MM.YYYY">{blank.creationDate}</Moment>
                                        </Typography>
                                    </CardContent>
                                        <CardActions>
                                            <Button onClick={() => {goToBlank(index)}} variant="contained" size="small"><Edit/>{t('blank_item_edit_button')}</Button>
                                            <Button onClick={() => {blankDelete(index)}} variant="contained" size="small"><Delete/>{t('blank_item_delete_button')}</Button>
                                            <Button onClick={() => {confBlank(index)}} variant="contained" size="small">{t('blank_item_confirm_button')}</Button>
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
                {
                    (!error && invitationList) &&
                    invitationList.map((invitation, index) => 
                    <div key={invitation._id}> 
                                <Card variant="outlined" sx={{
                                    backgroundColor: `#d9f99d`
                                }}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            Запрошення на експертизу "{invitation.expertiseName}"
                                        </Typography>
                                        <Typography>
                                            {t('blank_item_creation_date')}<Moment format="DD.MM.YYYY">{invitation.creationDate}</Moment>
                                        </Typography>
                                    </CardContent>
                                        <CardActions> 
        
                                        <Button onClick={() => {invitationAccept(index)}} variant="contained" size="small"><Delete/>Прийняти</Button>
                                            <Button onClick={() => {invitationDecline(index)}} variant="contained" size="small"><Delete/>Відмовитись</Button>
                                        </CardActions>  
                                </Card>
                            
                        </div> )
                }
                { (!error && blankList) &&
                    blankList.map((blank, index) =>
                        blank.isClosed &&
                        <div key={blank._id}> 
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {blank.name}
                                        </Typography>
                                        <Typography>
                                            {t('blank_item_creation_date')}<Moment format="DD.MM.YYYY">{blank.creationDate}</Moment>
                                        </Typography>
                                    </CardContent>
                                        <CardActions> 
        
                                            {!blank.result &&  <Button onClick={() => {goToCalculation(index)}} variant="contained" size="small"><span><Edit/>{t('blank_item_calculate_button')}</span></Button>}
                                            {blank.result &&  <Button onClick={() => {goToResult(index)}} variant="contained" size="small"><span><CheckCircle/>{t('blank_item_result_button')}</span></Button>}
                                            
                                            <Button onClick={() => {blankDelete(index)}} variant="contained" size="small"><Delete/>{t('blank_item_delete_button')}</Button>
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