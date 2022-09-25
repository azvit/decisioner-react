import { Alert, Button, Grid, Step, StepLabel, Stepper } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hook/redux";
import { ahpCalc } from "../../methods/ahp.service";
import { BlankAhp, IBlank, matrixInputMap, matrixOutputMap, matrixReverseMap } from "../../models/models";
import { editBlank, setBlank } from "../../store/actions/BlankAction";
import ReactEcharts from "echarts-for-react";
import { getOptions, isMax, isMaxItem, round } from "../../calculation-service";
import { Edit, Save } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BlankDescription } from "./BlankDescription";
import { AhpInstructions } from "./instructions/AhpInstructions";
import styles from './calculation.module.css';
import { AlternativesDescription} from "./AlternativesDescription";
import { CriteriaDescription } from "./CriteriaDescription";

export function AhpCalc() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { currentBlank, completed } = useAppSelector(state => state.blank);
    let blankCopy: IBlank<BlankAhp> = JSON.parse(JSON.stringify(currentBlank!));
    const [ currentBlankAhp, setCurrentBlankAhp ] = useState<IBlank<BlankAhp>>(currentBlank!);
    const [isCalc, setIsCalcc] = useState(Boolean(currentBlankAhp.result));
    const [searchParams, setSearchParams] = useSearchParams();
    const [isEdit, setIsEdit] = useState<Boolean>(JSON.parse(searchParams.get("isEdit")!))
    

    const [inputMatrix, setInputMatrix] = useState<any[][]>([]);
    const [inputItemMatrix, setInputItemMatrix] = useState<any[][][]>([]);

    const [activeStep, setActiveStep] = useState(0);
    const steps = currentBlankAhp.blank.criteria;
    const navigate = useNavigate();
    let c = 0;

    const sendBlank = () => {
        dispatch(editBlank(currentBlankAhp, currentBlankAhp._id));
    }

    const edit = () => {
        setIsEdit(true)
        window.scrollTo(0, 0)
    }
    
    const getChartData = (labels: string[], points: number[]) => {
        let data = [];
        for (let i = 0; i < labels.length; i++) {
            data.push({value: points[i], name: labels[i]})
        }
        return getOptions(data);
    }

    const getItemChartData = (label: string[], points: [number[]]) => {
        let data = [];
        for (let i = 0; i < label.length; i++) {
            data.push({value: points[i][activeStep], name: label[i]})
        }
        return getOptions(data);
    }

    const handleDirectSwitch = (index: number) => {
        setActiveStep(index)
    }

    useEffect(() => {
        if (completed) {
            navigate('/blanks-list')
        }
    }, [completed])

    const inputMatrixChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        let input = inputMatrix.slice();
        let i = Number(event.target.name.split('/')[0]);
        let j = Number(event.target.name.split('/')[1])
        input[i][j] = event.target.value;

        if (matrixReverseMap.get(event.target.value.toString())) {
            input[j][i] = matrixReverseMap.get(input[i][j]);
        }
        setInputMatrix(input);
        console.log(inputMatrix);
        saveCriteria(i, j);   
    }

    const calculate = (blankCopy: any) => {
        ahpCalc(blankCopy.blank).then(result => {
            blankCopy.result = result;
            setCurrentBlankAhp(blankCopy);
            setIsCalcc(true)
        });   
    }

    const inputItemMatrixChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        let input = inputItemMatrix.slice();
        let i = Number(event.target.name.split('/')[0]);
        let j = Number(event.target.name.split('/')[1]);
        input[activeStep][i][j] = event.target.value;

        if (matrixReverseMap.get(event.target.value.toString())) {
            input[activeStep][j][i] = matrixReverseMap.get(input[activeStep][i][j]);
        }
        setInputItemMatrix(input);
        saveItems(i, j)
    }

    const saveItems = (i: number, j: number) => {
        if (matrixOutputMap.get(inputItemMatrix[activeStep][i][j])) {
            blankCopy = JSON.parse(JSON.stringify(currentBlankAhp));
            blankCopy.blank.criteriaItemRank[activeStep][i + j - 1][2] = matrixOutputMap.get(inputItemMatrix[activeStep][i][j]);
            calculate(blankCopy)
        } 
    }

    const saveCriteria = (i: number, j: number) => {
        if (matrixOutputMap.get(inputMatrix[i][j])) {
            blankCopy = JSON.parse(JSON.stringify(currentBlankAhp));
            blankCopy.blank.criteriaRank[i + j - 1][2] = matrixOutputMap.get(inputMatrix[i][j]);
            calculate(blankCopy)
        }
    }

    useEffect(() => {
        if (!isCalc) {
            calculate(currentBlankAhp);
        }
        
        let matrix: any[][] = [];
        let itemMatrix: any[][][] = [];
        console.log('----')
            for (let i = 0; i < (currentBlankAhp.blank.criteria.length ?? 0); i++) {
                matrix.push([]);
                itemMatrix.push([]);
            }
            c = 0;
            for (let i = 0; i < matrix.length; i++) {
                for (let j = i; j < matrix.length; j++) {
                    if (i != j) {
                        matrix[i].push(matrixInputMap.get(currentBlankAhp.blank.criteriaRank[c][2]));
                        matrix[j].push(matrixReverseMap.get(matrixInputMap.get(currentBlankAhp.blank.criteriaRank[c][2])!.toString()));
                        c++;
                    } else {
                        matrix[i].push('1');
                    }    
                }
            }
            for (let i = 0; i < (currentBlankAhp.blank.items.length ?? 0); i++) {;
                for (let j = 0; j < (currentBlankAhp.blank.items.length ?? 0); j++) {
                    itemMatrix[i].push([])
                }
            }
            for (let i = 0; i < itemMatrix.length; i++) {
                c = 0;
                for (let j = 0; j < itemMatrix[i].length; j++) {
                    for (let q = j; q < itemMatrix[i].length; q++) {
                        if (q != j) {
                            itemMatrix[i][j].push(matrixInputMap.get(currentBlankAhp.blank.criteriaItemRank[i][c][2]));
                            itemMatrix[i][q].push(matrixReverseMap.get(matrixInputMap.get(currentBlankAhp.blank.criteriaItemRank[i][c][2])!.toString()));
                            c++;
                        } else {
                            itemMatrix[i][j].push('1');
                        }
                    }
                }
            }
        setInputItemMatrix(itemMatrix);
        setInputMatrix(matrix);
    }, [])
    
    return (
        <div id="body" className="m-auto">
            <h2 className={styles.blankName}>{currentBlankAhp.name}</h2>
            <div className={styles.divContainerFlex}>
                <BlankDescription/>
                <AhpInstructions/>
            </div>
            <div className={styles.divContainerFlex}>
                <CriteriaDescription/>
                <AlternativesDescription/>
            </div>
            <div className="w-full">
            <h2 className="text-center m-2">{t('calculation_criteria_comparison')}</h2>
                {isEdit && <div className={styles.divContainer}>
                    
                            <table className={styles.tableMatrix}>
                                <tr className="border">
                                    <td className="border">
                                        {t('criterias')}
                                    </td>
                                    {
                                        currentBlankAhp.blank.criteria.map((criteria, index) => 
                                        <td className="border text-center"><p aria-label={currentBlankAhp.blank.criteriaDescription[index]}>
                                            {criteria}
                                        </p></td>)
                                    }
                                </tr>
                                {
                                    inputMatrix.map((row, i) => <tr className="border">
                                        <td className="border text-left">
                                            <p className={styles.textML} aria-label={currentBlankAhp.blank.criteriaDescription[i]}>
                                                {currentBlankAhp.blank.criteria[i]}
                                            </p>
                                        </td>
                                            {
                                                row.map((input, j) => 
                                                        <td className="border">
                                                        {
                                                            (j > i) && <input name={`${i}/${j}`} onChange={inputMatrixChangeHandler} className={styles.tableMatrixCellInput} value={input}/>
                                                        }
                                                        {
                                                            (j <= i) && <p className={styles.tableMatrixCellText}>{input}</p>
                                                        }
                                                    </td>
                                                    )
                                            }
                                        
                                    </tr>)
                                }
                            </table>
                            {
                                (isCalc && currentBlankAhp.result.criteriaRankMetaMap.cr! > 0.1) && <Alert className={styles.alert} severity="error">{t('transitivity_error')}</Alert>
                            }
                            {
                                (isCalc && currentBlankAhp.result.criteriaRankMetaMap.cr! <= 0.1) && <Alert className={styles.alert} severity="success">{t('transitivity_success')}</Alert>
                            }
                            
                </div>}
                {isCalc && 
                    <div className={styles.divContainer}>
                        <Grid sx={{flexGrow: 1}} container spacing={0.5} className={styles.gridContainer} justifyContent={'space-around'} alignItems={'center'}>
                    <Grid item xs={3}>
                        <table className={styles.table}>
                        <tr >
                            <th className={styles.blueBorder}>
                                {t('criterias')}
                            </th>
                            <th className={styles.blueBorder}>
                                {t('weight')}
                            </th>
                        </tr>
                        {
                            currentBlankAhp.result.criteriaRankMetaMap.weightedVector.map((score, index) => <tr className={(isMax(score, currentBlankAhp.result.criteriaRankMetaMap.weightedVector))? 'bg-cyan-300' : ''}>
                                <td className={styles.blueBorder}>
                                <p className={styles.textML}>{currentBlankAhp.blank.criteria[index]}</p>
                                </td>
                                <td className={styles.blueBorder}>
                                    <p className={styles.textML}>{round(score)}</p>
                                </td>
                            </tr>)
                        }
                    </table>
                    </Grid>
                    <Grid item xs={3} className="border">
                        <div className={styles.chart}>
                            <ReactEcharts
                                option={getChartData(currentBlankAhp.blank.criteria, currentBlankAhp.result.criteriaRankMetaMap.weightedVector!)}
                                notMerge={true}
                                lazyUpdate={true}
                            />
                        </div>
                        
                    </Grid>
                    <Grid item xs={3}>
                        <Grid
                            container
                            direction="column"
                            justifyContent="space-around"
                            alignItems="center"
                        >
                            <Grid item className="w-full p-1">
                                    <table className={styles.tableCoef}>
                                        <tr>
                                            <td className={styles.tableCoefHeader}>
                                                {t('ci')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.tableCoefBody}>
                                                {round(currentBlankAhp.result.criteriaRankMetaMap.ci)}
                                            </td>
                                        </tr>
                                    </table>
                            </Grid>
                            <Grid item className="w-full p-1">
                                    <table className={styles.tableCoef}>
                                        <tr>
                                            <td className={styles.tableCoefHeader}>
                                                {t('ri')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.tableCoefBody}>
                                                {currentBlankAhp.result.criteriaRankMetaMap.ri}
                                            </td>
                                        </tr>
                                    </table>
                            </Grid>
                            <Grid item className="w-full p-1">
                                    <table className={styles.tableCoef}>
                                        <tr>
                                            <td className={styles.tableCoefHeader}>
                                                {t('cr')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.tableCoefBody}>
                                                {round(currentBlankAhp.result.criteriaRankMetaMap.cr)}
                                            </td>
                                        </tr>
                                    </table>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Grid>
                    </div>
                }
                <Stepper activeStep={activeStep} className={styles.stepper}>
                    {steps.map((label, index) => {
                    return (
                        <Step completed={false} className="hover: cursor-pointer" onClick={() => {handleDirectSwitch(index)}} key={label}>
                        <StepLabel >{label}</StepLabel>
                        </Step>
                    );
                    })}
                </Stepper>
                <React.Fragment>
                    <div className={styles.divContainer}>
                    <h2 className="text-center m-2">{t('calculation_alternative_comparison_by')} "{currentBlankAhp.blank.criteria[activeStep]}"</h2>
                    {isEdit && <div className={styles.divContainer}>
                            <table className={styles.tableMatrix}>
                                <tr className="border">
                                    <td className="border">
                                        {t('alternatives')}
                                    </td>
                                        {
                                            currentBlankAhp.blank.items.map((item, index) => 
                                            <td className="border"><p aria-label={currentBlankAhp.blank.itemsDescription[index]}>
                                                {item}
                                            </p></td>)
                                        }
                                </tr>
                                {
                                    inputItemMatrix[activeStep].map((row, i) => <tr className="border">
                                        <td className="border text-left">
                                            <p className={styles.textML} aria-label={currentBlankAhp.blank.itemsDescription[i]}>
                                                {currentBlankAhp.blank.items[i]}
                                            </p>
                                        </td>
                                            {
                                                row.map((input, j) =>  
                                                    <td className="border">
                                                        {
                                                            (j > i) && <input name={`${i}/${j}`} onChange={inputItemMatrixChangeHandler} className={styles.tableMatrixCellInput} value={input}/>
                                                        }
                                                        {
                                                            (j <= i) && <p className={styles.tableMatrixCellText}>{input}</p>
                                                        }
                                                    </td>
                                                )
                                            }
                                                
                                    </tr>)
                                }
                            </table>
                            {
                                (isCalc && currentBlankAhp.result.itemRankMetaMap[activeStep].cr! > 0.1) && <Alert className={styles.alert} severity="error">{t('transitivity_error')}</Alert>
                            }
                            {
                                (isCalc && currentBlankAhp.result.itemRankMetaMap[activeStep].cr! <= 0.1) && <Alert className={styles.alert} severity="success">{t('transitivity_success')}</Alert>
                            }
                       </div>}
                       
                    {isCalc && <div className={styles.divContainer}>
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
                            currentBlankAhp.result.rankingMatrix.map((score, index) => <tr className={(isMaxItem(score[activeStep], activeStep, currentBlankAhp.result.rankingMatrix))? 'bg-cyan-300' : ''}>
                                <td className={styles.blueBorder}>
                                <p className={styles.textML}>{currentBlankAhp.blank.items[index]}</p>
                                </td>
                                <td className={styles.blueBorder}>
                                    <p className={styles.textML}>{round(score[activeStep])}</p>
                                </td>
                            </tr>)
                        }
                    </table>
                    </Grid>
                    <Grid item xs={3} className="border">
                        <div className={styles.chart}>
                            <ReactEcharts
                                option={getItemChartData(currentBlankAhp.blank.items, currentBlankAhp.result.rankingMatrix)}
                                notMerge={true}
                                lazyUpdate={true}
                            />
                        </div>
                        
                    </Grid>
                    <Grid item xs={3}>
                        <Grid
                            container
                            direction="column"
                            justifyContent="space-around"
                            alignItems="center"
                        >
                            <Grid item className="w-full p-1">
                                    <table className={styles.tableCoef}>
                                        <tr>
                                            <td className={styles.tableCoefHeader}>
                                                {t('ci')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.tableCoefBody}>
                                                {round(currentBlankAhp.result.itemRankMetaMap[activeStep].ci)}
                                            </td>
                                        </tr>
                                    </table>
                            </Grid>
                            <Grid item className="w-full p-1">
                                    <table className={styles.tableCoef}>
                                        <tr>
                                            <td className={styles.tableCoefHeader}>
                                                {t('ri')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.tableCoefBody}>
                                                {currentBlankAhp.result.itemRankMetaMap[activeStep].ri}
                                            </td>
                                        </tr>
                                    </table>
                            </Grid>
                            <Grid item className="w-full p-1">
                                    <table className={styles.tableCoef}>
                                        <tr>
                                            <td className={styles.tableCoefHeader}>
                                                {t('cr')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.tableCoefBody}>
                                                {round(currentBlankAhp.result.itemRankMetaMap[activeStep].cr)}
                                            </td>
                                        </tr>
                                    </table>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Grid>
                    </div>} 
                    </div>
                </React.Fragment>
                
                {isCalc && 
                    <div className={styles.divContainer}>
                        <h2 className="text-center m-2">{t('result')}</h2>
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
                            currentBlankAhp.result.rankedScores.map((score, index) => <tr className={(isMax(score, currentBlankAhp.result.rankedScores))? 'bg-cyan-300' : ''}>
                                <td className={styles.blueBorder}>
                                <p className={styles.textML}>{currentBlankAhp.blank.items[index]}</p>
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
                                option={getChartData(currentBlankAhp.blank.items!, currentBlankAhp.result.rankedScores!)}
                                notMerge={true}
                                lazyUpdate={true}
                            />
                        </div>
                        
                    </Grid>
                    
                    
                </Grid>
                        <div className="m-auto text-center p-1">
                            {
                                isEdit && <Button onClick={sendBlank} className="text-center" variant="contained"><Save/>{t('calculation_button_save')}</Button>
                            }
                            {
                                !isEdit && <Button onClick={edit} className="text-center" variant="contained"><Edit/>{t('calculation_button_edit')}</Button>
                            }
                            
                        </div>
                    </div>
                
                }
                
            </div>
            
        </div>
    )
}