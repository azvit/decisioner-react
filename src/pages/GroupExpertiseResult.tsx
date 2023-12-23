import { useTranslation } from "react-i18next";
import { AhpCalc } from "../components/calculation/AhpCalc";
import { NormCalc } from "../components/calculation/NormCalc";
import { RangeCalc } from "../components/calculation/RangeCalc";
import { AHP_METHOD, METHODS, NORM_METHOD, RANGE_METHOD } from "../constants";
import { useAppDispatch, useAppSelector } from "../hook/redux";
import { BlankDescription } from "../components/calculation/BlankDescription";
import { GroupExpertiseDescription } from "../components/calculation/GroupExpertiseDescription";
import { AlternativesDescription } from "../components/calculation/AlternativesDescription";
import { CriteriaDescription } from "../components/calculation/CriteriaDescription";
import styles from '../components/calculation/calculation.module.css';
import { AhpInstructions } from "../components/calculation/instructions/AhpInstructions";
import { Hierarchy } from "../components/Hierarchy";
import { Save, Edit, Send } from "@mui/icons-material";
import { Grid, Button } from "@mui/material";
import { getOptions, isMax, round } from "../calculation-service";
import ReactEcharts from "echarts-for-react";
import { ChangeEvent, useEffect, useState } from "react";
import { calculateGroupExpertise } from "../store/actions/GroupExpertiseAction";

export function GroupResultPage () {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { currentGroupExpertise, loading, completed } = useAppSelector(state => state.groupExpertise);
    const [expertsW, setExpertsW] = useState<any[]>(currentGroupExpertise?.expertsWeight??[]);
    const getChartData = (labels: string[], points: number[]) => {
        let data = [];
        for (let i = 0; i < labels.length; i++) {
            data.push({value: points[i], name: labels[i]})
        }
        return getOptions(data);
    }

    const sendExpertsW = function() {
        dispatch(calculateGroupExpertise(currentGroupExpertise!._id, expertsW))
    }

    const handleExpWChange = function (event: ChangeEvent<HTMLInputElement>) {
        let copy = JSON.parse(JSON.stringify(expertsW))
        copy[event.target.name] = event.target.value;
        setExpertsW(copy);
    }
    
    useEffect(() => {
        if (currentGroupExpertise?.template.method !== METHODS[1] || currentGroupExpertise.expertsWeight) {
            dispatch(calculateGroupExpertise(currentGroupExpertise!._id, expertsW))
        } else {
            let expW = []
            for (let i = 0; i < currentGroupExpertise.experts.length; i++) {
                expW.push(1/currentGroupExpertise.experts.length)
            }
            setExpertsW(expW)
        }
    }, [])

    return (
        <>
            {
                currentGroupExpertise?.template.method == METHODS[1] && <div className='w-42'>
                    <h2>Введіть вагу експертів</h2>
                    <table className={styles.tableExpW}>
                            <tr >
                                <th className={styles.blueBorder}>
                                   Експерти
                                </th>
                                <th className={styles.blueBorder}>
                                    {t('weight')}
                                </th>
                            </tr>
                            {
                                currentGroupExpertise?.experts.map((epxert, index) => <tr>
                                    <td className={styles.blueBorder}>
                                    <p className={styles.textML}>{epxert.name}</p>
                                    </td>
                                    <td className={styles.blueBorder}>
                                        <input name={`${index}`} onChange={handleExpWChange} className={styles.tableMatrixCellInput} value={expertsW[index]}/>
                                    </td>
                                </tr>)
                            }
                        </table>
                        <div className="m-auto text-center p-1">
                            <Button onClick={sendExpertsW} className="text-center" variant="contained"><Send/>Відправити</Button>
                        </div>
                        
                </div>
                
            }
            {
                currentGroupExpertise?.result && completed && <div id="body" className="m-auto">
                <h2 className={styles.blankName}>{currentGroupExpertise!.name}</h2>
                <div className={styles.divContainerFlex}>
                    <GroupExpertiseDescription/>
                </div>
                {
                    (currentGroupExpertise?.template.method == METHODS[0]) &&  <div className={styles.divContainer}>
                    <Hierarchy blank={currentGroupExpertise!.template}/>
                </div>
                }
                {
                    currentGroupExpertise?.blanks.map((expertBlank:any, index) => <div>
                        <div className={styles.divContainer}>
                            <h2 className="text-center m-2">{t('result')} {currentGroupExpertise.experts[index].name} {(currentGroupExpertise.template.method == METHODS[1]) && <p>Вага експерта - {currentGroupExpertise.expertsWeight[index]}</p>} {(currentGroupExpertise.template.method == METHODS[2]) && <p>Компетентність - {currentGroupExpertise.result.groupCoefitients.competenceCoef[index].toFixed(3)}</p>}</h2>
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
                                expertBlank.result.rankedScores.map((score: number, index: string | number) => <tr className={(isMax(score, expertBlank.result.rankedScores))? 'bg-cyan-300' : ''}>
                                    <td className={styles.blueBorder}>
                                    <p className={styles.textML}>{expertBlank.blank.items[index]}</p>
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
                                    option={getChartData(expertBlank.blank.items!, expertBlank.result.rankedScores!)}
                                    notMerge={true}
                                    lazyUpdate={true}
                                />
                            </div>
                            
                        </Grid>
                        
                        
                    </Grid>
                        </div>
                        
                    
                    </div>)
                }
                 <div className={styles.divContainer}>
                            <h2 className="text-center m-2">Груповий агрегований результат</h2>
                            <h2 className="text-center m-2">Узгодженість експертів W = {currentGroupExpertise.result.groupCoefitients.concordance.toFixed(3)}</h2>
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
                                currentGroupExpertise!.result.rankedScores.map((score: number, index: number) => <tr className={(isMax(score, currentGroupExpertise!.result.rankedScores))? 'bg-cyan-300' : ''}>
                                    <td className={styles.blueBorder}>
                                    <p className={styles.textML}>{currentGroupExpertise!.template.items[index]}</p>
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
                                    option={getChartData(currentGroupExpertise!.template.items!, currentGroupExpertise!.result.rankedScores!)}
                                    notMerge={true}
                                    lazyUpdate={true}
                                />
                            </div>
                            
                        </Grid>
                        
                        
                    </Grid>
                    </div>
            </div>
            
            }
        </>
        
    )
}