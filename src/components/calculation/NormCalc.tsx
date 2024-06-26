import { AhpInstructions } from "./instructions/AhpInstructions";
import { BlankDescription } from "./BlankDescription";
import styles from './calculation.module.css';
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hook/redux";
import { NormInstructions } from "./instructions/NormInstructions";
import { BlankNorm, IBlank, matrixReverseMap } from "../../models/models";
import { ahpCalc } from "../../methods/ahp.service";
import { normCalc } from "../../methods/norm.service";
import { Button, Grid } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import { getOptions, isMax, round } from "../../calculation-service";
import { Save, Edit } from "@mui/icons-material";
import { editBlank } from "../../store/actions/BlankAction";
import { AlternativesDescription } from "./AlternativesDescription";
import { CriteriaDescription } from "./CriteriaDescription";

export function NormCalc() {

    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { currentBlank, completed } = useAppSelector(state => state.blank);
    let blankCopy: IBlank<BlankNorm> = JSON.parse(JSON.stringify(currentBlank!));
    const [currentBlankNorm, setCurrentBlankNorm] = useState<IBlank<BlankNorm>>(currentBlank!);
    const [isCalc, setIsCalcc] = useState(Boolean(currentBlank!.result));
    const [searchParams, setSearchParams] = useSearchParams();
    const [isEdit, setIsEdit] = useState<Boolean>(JSON.parse(searchParams.get("isEdit")!))
    const [inputMatrix, setInputMatrix] = useState<any[]>(currentBlankNorm.blank.criteriaRank);
    const [inputItemMatrix, setInputItemMatrix] = useState<any[][]>(currentBlankNorm.blank.criteriaItemRank);
    
    const inputMatrixChangeHandler = (i: number, value: any) => {
        let input = inputMatrix.slice();
        input[i] = value;
        setInputMatrix(input);
    }

    const inputMatrixItemChangeHandler = (i: number, value: any) => {
        let input = JSON.parse(JSON.stringify(inputItemMatrix));
        input[i][0] = value;
        setInputItemMatrix(input);
    }

    const sendBlank = () => {
        dispatch(editBlank(currentBlankNorm, currentBlankNorm._id));
    }

    const edit = () => {
        setIsEdit(true)
        window.scrollTo(0, 0)
    }

    useEffect(() => {
        saveCriteria();   
    }, [inputMatrix])

    useEffect(() => {
        saveItems();   
    }, [inputItemMatrix])

    useEffect(() => {
        if (completed) {
            navigate('/blanks-list')
        }
    }, [completed])

    const saveCriteria = () => {
        blankCopy = JSON.parse(JSON.stringify(currentBlankNorm));
        blankCopy.blank.criteriaRank = inputMatrix;
        calculate(blankCopy)
    }

    const saveItems = () => {
        blankCopy = JSON.parse(JSON.stringify(currentBlankNorm));
        blankCopy.blank.criteriaItemRank = inputItemMatrix;
        calculate(blankCopy)
    }


    const getChartData = (labels: string[], points: number[]) => {
        let data = [];
        for (let i = 0; i < labels.length; i++) {
            data.push({value: points[i], name: labels[i]})
        }
        return getOptions(data);
    }


    const calculate = (blankCopy: any) => {
        normCalc(blankCopy.blank.criteriaItemRank).then(result => {
            blankCopy.result = result;
            setCurrentBlankNorm(blankCopy);
            setIsCalcc(true)
        });   
    }

    useEffect(() => {
        if (!isCalc) {
            calculate(blankCopy);
        }
    }, [])


    return(
        <div id="body" className="m-auto">
            <h2 className={styles.blankName}>{currentBlank!.name}</h2>
            <div className={styles.divContainerFlex}>
                <BlankDescription/>
                <NormInstructions/>
            </div>
            <div className={styles.divContainerFlex}>
                <AlternativesDescription/>
            </div>
            <div className="w-full">   
            </div>
            <div className={styles.divContainer}>
                <h2 className="text-center m-2">{t('calculation_alternative_comparison')}</h2>
                {
                    isEdit && <div className={styles.divContainer}>
                        <table className={styles.tableMatrix}>
                            <tr>
                                <td className="border">
                                    {t('alternatives')}
                                </td>
                                <td>
                                    {t('weight')}
                                </td>
                            </tr>
                            {
                                currentBlankNorm.blank.items.map((item, i) => <tr>
                                    <td className="border text-left">
                                        <p className={styles.textML}>{item}</p>
                                    </td>
                                    {
                                        <td className="border">
                                            <input className={styles.tableMatrixCellInput} onChange={(e) => {inputMatrixItemChangeHandler(i, e.target.value)}} value={inputItemMatrix[i][0]}/>
                                        </td>
                                    }
                                </tr>)
                            }
                        </table>
                    </div>
                }
                {
                isCalc && <div className={styles.divContainer}>
                    <Grid sx={{flexGrow: 1}} container spacing={0.5} className="w-full mt-2 p-1" justifyContent={'space-around'} alignItems={'center'}>
                    
                    <Grid item xs={3}>
                    <table className={styles.table}>
                        <tr >
                            <th className={styles.blueBorder}>
                               {t('alternatives')}
                            </th>
                            <th className={styles.blueBorder}>
                                {t('weight')}
                            </th>
                        </tr>
                        {
                            currentBlankNorm.result.rankedScores.map((score, index) => <tr className={(isMax(score, currentBlankNorm.result.rankedScores))? 'bg-cyan-300' : ''}>
                                <td className={styles.blueBorder}>
                                <p className={styles.textML}>{currentBlankNorm.blank.items[index]}</p>
                                </td>
                                <td className={styles.blueBorder}>
                                    <p className={styles.textML}>{round(score)}</p>
                                </td>
                            </tr>)
                        }
                    </table>
                    </Grid>
                    <Grid item xs={3} className='border'>
                        <div className={styles.chart}>
                            <ReactEcharts
                                option={getChartData(currentBlankNorm.blank.items, currentBlankNorm.result.rankedScores)}
                                notMerge={true}
                                lazyUpdate={true}
                            />
                        </div> 
                    </Grid>
                </Grid>
                </div>
            }
            </div>
            <div className="m-auto text-center p-1">
                            {
                                isEdit && <Button onClick={sendBlank} className="text-center" variant="contained"><Save/>{t('calculation_button_save')}</Button>
                            }
                            {
                                !isEdit && <Button onClick={edit} className="text-center" variant="contained"><Edit/>{t('calculation_button_edit')}</Button>
                            }
                            
                        </div>
        </div>
    )
}