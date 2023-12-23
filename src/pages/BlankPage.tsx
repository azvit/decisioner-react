import { Box, Typography, Step, StepLabel, Stepper, Button, IconButton } from "@mui/material";
import { useFormik } from "formik";
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AHP_METHOD, METHODS, NORM_METHOD, RANGE_METHOD, SINGLE_FACTOR_METHODS } from "../constants";
import { useAppDispatch, useAppSelector } from "../hook/redux";
import { BlankForm, IBlank } from "../models/models";
import * as Yup from 'yup';
import React from "react";
import { Add, ArrowForward, Delete, Edit } from "@mui/icons-material";
import { questionModal } from "../swal/index";
import { createBlank, editBlank } from "../store/actions/BlankAction";
import { useNavigate } from "react-router-dom";
import { Hierarchy } from "../components/Hierarchy";

interface BlankItem {
    name: string,
    description: string,
    index: number
}

export function BlankPage() {
    const { t } = useTranslation();
    const {completed} = useAppSelector(state => state.blank)
    const navigate = useNavigate()

    useEffect(() => {
        if (completed) {
            navigate('/blanks-list')
        }
    }, [completed])

    const emptyBlank: BlankForm = {
        name: '',
        method: AHP_METHOD,
        blank: {
            aim: '',
            items: [],
            itemsDescription: [],
            description: '',
            criteria: [],
            criteriaDescription: []
        }
    }

    const {currentBlank} = useAppSelector(state => state.blank)
    const isNew = !Boolean(currentBlank);
    const [blank, setBlank] = useState<IBlank<any> | BlankForm>(JSON.parse(JSON.stringify(currentBlank)) ?? emptyBlank);
    const [activeStep, setActiveStep] = useState(0);
    const steps = [t('aim'), t('criterias'), t('alternatives')];
    const [item, setItem] = useState<BlankItem>({name: '', description: '', index: 16})
    const [isItemNew, setIsItemNew] = useState(true);
    const dispatch = useAppDispatch();
    const { userId } = useAppSelector(state => state.auth)

    const itemHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setItem(prev => ({...prev, [event.target.name]: event.target.value}))
    }

    const isSingleFactorMethod = () => {
        return SINGLE_FACTOR_METHODS.indexOf(formik.values.method) !== -1
    }

    const handleNext = () => {
        toggleToCreate();
        if (isSingleFactorMethod()) {
            setActiveStep((prevActiveStep) => prevActiveStep + 2)
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }

    };

    const handleBack = () => {
        toggleToCreate();
        if (isSingleFactorMethod()) {
            setActiveStep((prevActiveStep) => prevActiveStep - 2)
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    const formik = useFormik({
        initialValues: {
           name: blank.name,
           aim: blank.blank.aim,
           method: blank.method,
           description: blank.blank.description,
           criteria: blank.blank.criteria,
           items: blank.blank.items,
           itemsDescription: blank.blank.itemsDescription,
           criteriaDescription: blank.blank.criteriaDescription
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required(t('required_field')),
            aim: Yup.string()
                .required(t('required_field')),
            method: Yup.string()
                .required(t('required_field')),
            description: Yup.string()
                .required(t('required_field')),
            criteria: Yup.array().when('method', {
                is: (method: string) => !SINGLE_FACTOR_METHODS.includes(method),
                then: Yup.array().min(2).max(15)
            }),
            items: Yup.array()
                .min(2).max(15)
        }),
        onSubmit: () => {
            if (isNew) {
                sendBlank();
            } else {
                saveBlank();
            }
        }
    });

    const clearItem = () => {
        setItem({name: '', description: '', index: 16})
    }

    const toggleToEditCriteria = (index: number) => {
        setIsItemNew(false);
        setItem({name: formik.values.criteria[index], description: formik.values.criteriaDescription[index], index: index});
    }

    const toggleToEditItem = (index: number) => {
        setIsItemNew(false);
        setItem({name: formik.values.items[index], description: formik.values.itemsDescription[index], index: index});
    }

    const toggleToCreate = () => {
        setIsItemNew(true);
        clearItem();
    }

    useEffect(()=>{
       console.log(formik.isValid);
       console.log(formik.dirty)
    }, [formik])

    const addCriteria = () => {
        if ((item.name && item.description) && (formik.values.criteria.indexOf(item.name) === -1)) {
            let data = formik.values;
            data.criteria.push(item.name);
            data.criteriaDescription.push(item.description);
            formik.setFieldValue('criteria', data.criteria);
            formik.setFieldValue('criteriaDescription', data.criteriaDescription);
            updateCriteriaList();
            clearItem();
        }
    }

    const editCriteria = () => {
        if ((item.name && item.description) && (formik.values.criteria.indexOf(item.name) === -1)) {
            let data = formik.values;
            data.criteria[item.index] = item.name;
            data.criteriaDescription[item.index] = item.description;
            formik.setFieldValue('criteria', data.criteria);
            formik.setFieldValue('criteriaDescription', data.criteriaDescription);
            updateCriteriaList();
            clearItem();
            setIsItemNew(true)
        }
    }

    const deleteCriteria = (index: number) => {
        questionModal(t('delete_this_criteria')).then(result => {
            if (result.isConfirmed) {
                let data = formik.values;
                data.criteria.splice(index, 1);
                data.criteriaDescription.splice(index, 1);
                formik.setFieldValue('criteria', data.criteria);
                formik.setFieldValue('criteriaDescription', data.criteriaDescription);
                updateCriteriaList();
                clearItem();
            }
        })

    }

    const addItem = () => {
        if ((item.name && item.description) && (formik.values.items.indexOf(item.name) === -1)) {
            let data = formik.values;
            data.items.push(item.name);
            data.itemsDescription.push(item.description);
            formik.setFieldValue('items', data.items);
            formik.setFieldValue('itemsDescription', data.itemsDescription);
            updateItemsList();
            clearItem();
        }
    }

    const editItem = () => {
        if ((item.name && item.description) && (formik.values.items.indexOf(item.name) === -1)) {
            let data = formik.values;
            data.items[item.index] = item.name;
            data.itemsDescription[item.index] = item.description;
            formik.setFieldValue('items', data.items);
            formik.setFieldValue('itemsDescription', data.itemsDescription);
            updateItemsList();
            clearItem();
            setIsItemNew(true)
        }
    }

    const deleteItem = (index: number) => {
        questionModal(t('delete_this_alternative')).then(result => {
            if (result.isConfirmed) {
                let data = formik.values;
                data.items.splice(index, 1);
                data.itemsDescription.splice(index, 1);
                formik.setFieldValue('items', data.items);
                formik.setFieldValue('itemsDescription', data.itemsDescription);
                updateItemsList();
                clearItem();
            }
        })

    }

    const sendBlank = () => {
        if (isSingleFactorMethod() || (formik.values.criteria.length >= 2)) {
            const newBlank: BlankForm = {
                name: formik.values.name,
                method: formik.values.method,
                blank: {
                    aim: formik.values.aim,
                    description: formik.values.description,
                    criteria: formik.values.criteria,
                    items: formik.values.items,
                    criteriaDescription: formik.values.criteriaDescription,
                    itemsDescription: formik.values.itemsDescription
                }
            }
            dispatch(createBlank(newBlank, userId));
        }

    }

    const saveBlank = () => {
            const editedBlank: BlankForm = {
                name: formik.values.name,
                method: formik.values.method,
                blank: {
                    aim: formik.values.aim,
                    description: formik.values.description,
                    criteria: formik.values.criteria,
                    items: formik.values.items,
                    criteriaDescription: formik.values.criteriaDescription,
                    itemsDescription: formik.values.itemsDescription
                }
            }
            dispatch(editBlank(editedBlank, currentBlank?._id))
    }

    const [criteriaList, setCriteriaList] = useState(formik.values.criteria);
    const [itemsList, setItemsList] = useState(formik.values.items);

    const updateCriteriaList = () => {
        setCriteriaList(formik.values.criteria);
    }

    const updateItemsList = () => {
        setItemsList(formik.values.items);
    }

    return(
        <div className="text-center m-auto">
            <form onSubmit={formik.handleSubmit}>
                <Stepper activeStep={activeStep}>
                        <Step key={t('aim')}>
                        <StepLabel >{t('aim')}</StepLabel>
                        </Step>
                        {
                            isSingleFactorMethod() &&
                            <Step key={t('criteria')}>
                                <StepLabel ><ArrowForward/></StepLabel>
                            </Step>
                        }
                        {
                            !isSingleFactorMethod() &&
                            <Step key={t('criteria')}>
                                <StepLabel >{t('criteria')}</StepLabel>
                            </Step>
                        }
                        <Step key={t('alternatives')}>
                            <StepLabel >{t('alternatives')}</StepLabel>
                        </Step>
                </Stepper>
                <React.Fragment>
                    {activeStep === 0 &&
                        <div className="flex border shadow-md mt-2">
                        <div className="text-left w-[50%] border shadow-md p-2">
                            <div className="w-full text-lg mb-2">
                                <span> {formik.touched.name && formik.errors.name ? (<p className="text-red-600">{t('name_input')} {formik.errors.name}</p>) : <p>{t('name_input')} </p>}</span>
                                <input type="text"
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className=" w-full border "/>
                            </div>
                            <div className="w-full text-lg mt-2">
                            <span> {formik.touched.aim && formik.errors.aim ? (<p className="text-red-600">{t('aim_input')} {formik.errors.aim}</p>) : <p>{t('aim_input')} </p>}</span>
                                    <textarea id="aim"
                                    name="aim"
                                    value={formik.values.aim}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    maxLength={2000} className=" w-full border "/>
                            </div>
                        </div>
                        <div className="text-left w-[50%] border shadow-md p-2">
                            <div className="w-full text-lg  mb-2">
                            {t('method_input')}
                                <select id="method"
                                    name="method"
                                    value={formik.values.method}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                   className=" w-full border ">
                                    <option value={AHP_METHOD}>{t("ahp")}</option>
                                    <option value={NORM_METHOD}>{t("norm")}</option>
                                    <option value={RANGE_METHOD}>{t("range")}</option>
                                </select>
                            </div>
                            <div className="w-full text-lgmt-2 mb-2">
                            <span> {formik.touched.description && formik.errors.description ? (<p className="text-red-600">{t('description_input')} {formik.errors.description}</p>) : <p>{t('description_input')} </p>}</span>
                                <textarea id="description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    maxLength={2000} className=" w-full border "/>
                            </div>
                        </div>
                    </div>
                    }

                    {activeStep === 1 &&
                        <div className="flex border shadow-md mt-2">
                        <div className="text-left w-[40%] border shadow-md p-2">
                            <div className="w-full p-1 bg-blue-600 text-white"><h2>{t('criterias_list')} {criteriaList.length}</h2></div>
                            <ul>
                               {
                                    criteriaList.map((criteria, index) =>
                                    <li className="w-full">

                                            <table className="w-full">
                                                <tr>
                                                    <th className="w-[50%] sm:w-[70%]">
                                                         <Typography>
                                                            {criteria}
                                                        </Typography>
                                                    </th>
                                                    <th className="text-right">
                                                        <span className="mr-0 text-right w-full ">
                                                            <IconButton onClick={() => {toggleToEditCriteria(index)}} className="hover:cursor-pointer" aria-label="edit"><Edit color="primary"/></IconButton>
                                                            <IconButton onClick={() => {deleteCriteria(index)}} className="hover:cursor-pointer" aria-label="delete"><Delete color="primary"/></IconButton>
                                                        </span>
                                                    </th>
                                                </tr>
                                            </table>

                                    </li>)
                               }
                            </ul>
                            <div className="text-center p-2"><Button variant="contained" onClick={toggleToCreate}><Add/>{t('add_new_criteria_button')}</Button></div>
                        </div>
                        <div className="text-left w-[60%] border shadow-md p-2">
                            <div className="w-full text-lg  mb-2">
                               {t('name_input')}
                                <input id="criteria_name"
                                    name="name"
                                    value={item.name}
                                    onChange={itemHandler}
                                    className=" w-full border ">

                                </input>
                            </div>
                            <div className="w-full text-lg mt-2 mb-2">
                                {t('description_input')}
                                <input
                                    id="criteria_description"
                                    name="description"
                                    value={item.description}
                                    onChange={itemHandler}
                                    className=" w-full border "/>
                            </div>
                            <div className="text-center">
                                {isItemNew && <Button variant="contained" onClick={addCriteria}><Add/>{t('add_criteria_button')}</Button>}
                                {!isItemNew && <Button variant="contained" onClick={editCriteria}><Edit/>{t('save_changes_button')}</Button>}
                            </div>

                        </div>
                    </div>
                    }

                    {activeStep === 2 &&
                        <div className="flex border shadow-md mt-2">
                        <div className="text-left w-[40%] border shadow-md p-2">
                            <div className="w-full p-1 bg-blue-600 text-white"><h2>{t('alternatives_list')} {itemsList.length}</h2></div>
                            <ul>
                               {
                                    itemsList.map((item, index) =>
                                    <li className="w-full">

                                            <table className="w-full">
                                                <tr>
                                                    <th className="w-[50%] sm:w-[70%]">
                                                         <Typography>
                                                            {item}
                                                        </Typography>
                                                    </th>
                                                    <th className="text-right">
                                                        <span className="mr-0 text-right w-full ">
                                                            <IconButton onClick={() => {toggleToEditItem(index)}} className="hover:cursor-pointer" aria-label="edit"><Edit color="primary"/></IconButton>
                                                            <IconButton onClick={() => {deleteItem(index)}} className="hover:cursor-pointer" aria-label="delete"><Delete color="primary"/></IconButton>
                                                        </span>
                                                    </th>
                                                </tr>
                                            </table>

                                    </li>)
                               }
                            </ul>
                            <div className="text-center p-2"><Button variant="contained" onClick={toggleToCreate}><Add/>{t('add_new_alternative_button')}</Button></div>
                        </div>
                        <div className="text-left w-[60%] border shadow-md p-2">
                            <div className="w-full text-lg  mb-2">
                               {t('name_input')}
                                <input id="criteria_name"
                                    name="name"
                                    value={item.name}
                                    onChange={itemHandler}
                                    className=" w-full border ">

                                </input>
                            </div>
                            <div className="w-full text-lg mt-2 mb-2">
                                {t('description_input')}
                                <input
                                    id="criteria_description"
                                    name="description"
                                    value={item.description}
                                    onChange={itemHandler}
                                    className=" w-full border "/>
                            </div>
                            <div className="text-center">
                                {isItemNew && <Button variant="contained" onClick={addItem}><Add/>{t('add_alternative_button')}</Button>}
                                {!isItemNew && <Button variant="contained" onClick={editItem}><Edit/>{t('save_changes_button')}</Button>}
                            </div>

                        </div>
                    </div>
                    }
                    <div className="w-full text-center p-2">
                        {isNew &&
                            <Button type="submit" disabled={(!(formik.isValid && formik.dirty))} variant="contained">
                                <span><Add/>{t('create_expertise_button')}</span>
                            </Button>
                        }
                        {!isNew && <Button type="submit" disabled={(!formik.isValid)} variant="contained">
                            <span><Edit/>{t('save_changes_button')}</span>
                        </Button>}
                    </div>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        >
                        {t('back_button')}
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {activeStep === steps.length - 1 ? null : <Button onClick={handleNext}>{t('next_button')}</Button>}
                    </Box>
                </React.Fragment>
                {(formik.values.method === AHP_METHOD) && (formik.values.aim !== '') && (formik.values.criteria.length !== 0) && <div className="w-full">
                    <Hierarchy
                        blank={{criteria: formik.values.criteria, items: formik.values.items, aim: formik.values.aim}}
                    />
                </div>}
            </form>

        </div>
    )
}
