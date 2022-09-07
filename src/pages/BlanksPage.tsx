import { Add, CheckCircle, Delete, Edit } from "@mui/icons-material";
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


export function BlanksPage() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { userId } = useAppSelector(state => state.auth);
    const { blanks, loading, error } = useAppSelector(state => state.blanks);
    const [blankList, setBlankList] = useState(blanks ?? [])
    const { completed } = useAppSelector(state => state.blank)

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

    const confirmBlank = (index: number) => {
        questionModal(t("blank_confirm_modal")).then(res => {
            if (res.isConfirmed) {
                dispatch(editBlank({isClosed: true}, blankList[index]._id));
                setTimeout(() => {
                    dispatch(getBlanks(userId))
                }, 500)
                
            }
        })
    }

    useEffect(() => {
        dispatch(resetBlank());
        dispatch(getBlanks(userId));  
    }, []);

    useEffect(() => {
        if (completed) {
            dispatch(resetBlank());
            dispatch(getBlanks(userId));  
        }
    }, [completed])

    useEffect(() => {
        setBlankList(blanks);
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
                                            <Button onClick={() => {confirmBlank(index)}} variant="contained" size="small">{t('blank_item_confirm_button')}</Button>
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