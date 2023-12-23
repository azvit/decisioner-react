import { BlankDescription } from "./BlankDescription";
import { AlternativesDescription} from "./AlternativesDescription";
import styles from './calculation.module.css';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hook/redux";
import { BlankRange, IBlank, matrixRangeRevereMap} from "../../models/models";

import { Button} from "@mui/material";
import ReactEcharts from "echarts-for-react";
import { getOptions, isMax, round } from "../../calculation-service";
import { Save, Edit } from "@mui/icons-material";
import { editBlank } from "../../store/actions/BlankAction";
import { RangeInstructions } from "./instructions/RangeInstructions";
import { rangeRun, rangeRunWithCompares } from "../../methods/range.service";
import { RANGE_METHOD_MODES } from "../../constants";
import { setCommentRange } from "typescript";

export function RangeCalc() {

    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { currentBlank, completed } = useAppSelector(state => state.blank);
    let blankCopy: IBlank<BlankRange> = JSON.parse(JSON.stringify(currentBlank!));
    const [currentBlankRange, setCurrentBlankRange] = useState<IBlank<BlankRange>>(currentBlank!);
    const [isCalc, setIsCalcc] = useState(Boolean(currentBlank!.result));
    const [searchParams, setSearchParams] = useSearchParams();
    const [isEdit, setIsEdit] = useState<Boolean>(JSON.parse(searchParams.get("isEdit")!))
    const [inputMatrix, setInputMatrix] = useState<any[][]>(currentBlankRange.blank.criteriaItemRank);
    const [inputRanks, setInputRanks] = useState<any[]>(currentBlankRange.blank.criteriaRank);
    const [mode, setMode] = useState(currentBlankRange.blank.criteria[0]);
    const [show, setShow] = useState(false);

    const getBlankCopy = () => JSON.parse(JSON.stringify(currentBlankRange));

    const handleDirectSwitch = () => {
        setMode(RANGE_METHOD_MODES.DIRECT);
        blankCopy = getBlankCopy();
        saveRanks(blankCopy.blank.criteriaRank);
    }

    const handleCompareSwitch = () => {
        setMode(RANGE_METHOD_MODES.COMPARE);
        blankCopy = getBlankCopy();
        saveItems(0, 1, blankCopy.blank.criteriaItemRank)
    }

    const inputMatrixChangeHandler = (i: number, j:number, value: any) => {
        let input = JSON.parse(JSON.stringify(inputMatrix));
        input[i][j] = value;
        if (matrixRangeRevereMap.get(value)) {
            input [j][i] = matrixRangeRevereMap.get(value)
        }
        setInputMatrix(input);
        saveItems(i, j, input);
    }

    const inputRanksChangeHandler = (i: number, value: any) => {
        let input = JSON.parse(JSON.stringify(inputRanks));
        input[i] = value;
        setInputRanks(input);
        saveRanks(input);
    }
    

    const sendBlank = () => {
        blankCopy = getBlankCopy();
        blankCopy.blank.criteria = [mode];
        dispatch(editBlank( blankCopy,  blankCopy._id));
    }

    const edit = () => {
        setIsEdit(true)
        window.scrollTo(0, 0)
    }

    useEffect(() => {
        if (completed) {
            navigate('/blanks-list')
        }
    }, [completed])

    const saveItems = (i: number, j: number, input: any) => {
        if (matrixRangeRevereMap.get(input[i][j])) {
            blankCopy = getBlankCopy();
            blankCopy.blank.criteriaItemRank = input;
            calculateWithCompares(blankCopy)
        }
    }

    const saveRanks = (input: any) => {
        blankCopy = getBlankCopy();
        blankCopy.blank.criteriaRank = input;
        calculate(blankCopy);
    }

    const getChartData = (labels: string[], points: number[]) => {
        let data = [];
        for (let i = 0; i < labels.length; i++) {
            data.push({value: points[i], name: labels[i]})
        }
        return getOptions(data);
    }

    const calculate = (blankCopy: any) => {

        rangeRun(blankCopy.blank.criteriaRank).then((result: any) => {
            blankCopy.result = result;
            setCurrentBlankRange(blankCopy);
            setIsCalcc(true);
        })
    }

    const calculateWithCompares = (blankCopy: any) => {
        rangeRunWithCompares(blankCopy.blank.criteriaItemRank).then((result: any) => {
            blankCopy.result = result;
            setCurrentBlankRange(blankCopy);
            setIsCalcc(true)
        });   
    }

    useEffect(() => {
        if (!isCalc) {
            calculateWithCompares(blankCopy);
        }
    }, [])

    useEffect(() => {
      if (!currentBlankRange?.result) {
        let rankedScores = [];
        let copy = JSON.parse(JSON.stringify(currentBlankRange));
        for (let i = 0; i <= currentBlankRange.blank.items.length; i++) {
            rankedScores.push(0)
        }
        copy.result = {
            cArr: rankedScores,
            sumRank: 0,
            aArr: rankedScores,
            rankedScores: rankedScores
        }
        copy.result.rankedScores = rankedScores;
        setCurrentBlankRange(copy)
      }
      setShow(true)  
    })

    return(
        <div id="body" className="m-auto">
            <h2 className={styles.blankName}>{currentBlank!.name}</h2>
            <div className={styles.divContainerFlex}>
                <BlankDescription/>
                <RangeInstructions/>
            </div>
            <div className={styles.divContainerFlex}>
                <AlternativesDescription/>
            </div>
            {
                show ? <div className="w-full text-center">
                <h2 className="text-center m-2">{t('calculation_alternative_comparison_single')}</h2>   
                <div className={styles.divContainer}>
                    
                        <table className={styles.tableMatrix}>
                        <tr>
                            <td rowSpan={2} className='border'>
                                <p>{t('calculation_range_factor')}</p>
                            </td>
                            <td rowSpan={2} className='border'>
                                <p>{t('alternatives')}</p>
                            </td>
                            <td colSpan={currentBlankRange.blank.items.length} rowSpan={1} className='border'>
                                <p>{t('calculation_range_factor')}</p>
                            </td>
                            <td rowSpan={2} className='border'><p>{t('calculation_range_sum')}</p></td>
                            <td rowSpan={2} className='border'><p>{t('calculation_range_rank_a')}</p></td>
                            <td rowSpan={2} className='border'><p>{t('calculation_range_rank_s')}</p></td>
                        </tr>
                        <tr>
                            {
                                currentBlankRange.blank.items.map((item, index) => <td className='border'>
                                    <span title={currentBlankRange.blank.itemsDescription[index]}><p>{index + 1}</p></span>
                                </td>)
                            }
                        </tr>
                        {
                            currentBlankRange.blank.items.map((item, i) => <tr className={(isMax(currentBlankRange.result.rankedScores[i], currentBlankRange.result.rankedScores)) ? 'bg-cyan-300' : ''}>
                                <td className='border'>
                                    <span title={currentBlankRange.blank.itemsDescription[i]}><p>{i + 1}</p></span>
                                </td>
                                <td className='border'>
                                    <span title={currentBlankRange.blank.itemsDescription[i]}><p>{item}</p></span>
                                </td>
                                {
                                    currentBlankRange.blank.items.map((item1, j) => <td className='border bg-white'>
                                        {
                                            (i < j) && (isEdit) && <input className={styles.tableMatrixCellInput} onChange={(e) => {inputMatrixChangeHandler(i, j, e.target.value)}} value={inputMatrix[i][j]}/>
                                        }
                                        {
                                            ((i >= j) || (!isEdit)) &&<p className={styles.tableMatrixCellText}>{inputMatrix[i][j]}</p>
                                        }
                                    </td>)
                                }
                                <td className='border'>
                                    {
                                        isCalc && 
                                        <p>{currentBlankRange.result.cArr[i]}</p>    
                                    }
                                    
                                </td>
                                <td className='border'>
                                    {
                                        isCalc &&
                                        <p>{currentBlankRange.result.aArr[i]}</p>
                                    }
                                </td>
                                <td className='border'>
                                    {
                                        isCalc &&
                                        <p>{round(currentBlankRange.result.rankedScores[i])}</p>
                                    }
                                    
                                </td>
                            </tr>)
                        }
                    </table>
                    
                </div>
                    
                
            </div> : <></>
            }
            
            {
                isCalc && <div className={styles.divContainer}>
                    <ReactEcharts
                        option={getChartData(currentBlankRange.blank.items, currentBlankRange.result.rankedScores)}
                        notMerge={true}
                        lazyUpdate={true}
                    /> 
                </div>
            }
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