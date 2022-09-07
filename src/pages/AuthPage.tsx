import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hook/redux";
import { signIn } from "../store/actions/AuthActions";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useTranslation } from "react-i18next";
import { Login } from "@mui/icons-material";

export function AuthPage() {
    const dispatch = useAppDispatch();
    const { error, loading } = useAppSelector(state => state.auth)
    const { t } = useTranslation();
    const formik = useFormik({
        initialValues: {
            login: '',
            password: ''
        },
        onSubmit: values => {
            dispatch(signIn({login: values.login, password: values.password}))
        },
        validationSchema: Yup.object({
            login: Yup.string()
                .max(20, t('login_is_not_valid_max'))
                .min(5, t('login_is_not_valid_min'))
                .required(t('required_field')),
            password: Yup.string()
                .min(8, t('password_is_not_valid_min'))
                .max(25, t('password_is_not_valid_max'))
                .required(t('required_field'))
        })
    })

    return(
        <Box className="border m-auto mt-52 w-[420px] pb-2 rounded-lg shadow-lg">
            {error && <Alert severity="error">{error}</Alert>}
            <h2 className="text-center mt-2 font-bold text-2xl">Sign in</h2>
            <form className="m-auto mt-2" onSubmit={formik.handleSubmit}>
                <table className="flex ml-8 w-full">
                    <tr>
                        <td className="w-[100px]">
                             <label htmlFor="login" >{t('login')}</label>
                        </td>
                        <td>
                            <input 
                                className="pl-1 border rounded-sm w-full"
                                type="text" 
                                id="login" 
                                name="login"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.login}
                            />
                        </td>
                    </tr>
                </table>
                <div className="flex ml-8 h-[50px]">
                    { formik.touched.login && formik.errors.login ? (<div className="text-red-600 text-sm">{formik.errors.login}</div>) : null}
                </div>
                <table className="flex ml-8 w-full">
                    <tr>
                        <td className="w-[100px]">
                            <label htmlFor="password">{t('password')}</label>
                        </td>
                        <td>
                           <input 
                                className="pl-1 border rounded-sm"
                                type="password"  
                                id="password"
                                name="password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            /> 
                        </td>
                    </tr>
                </table>
                <div className="ml-8 h-[50px]">
                    { formik.touched.password && formik.errors.password ? (<div className="text-red-600 text-sm">{formik.errors.password}</div>) : null }
                </div>
                <div className="m-auto w-[120px]">
                    <Button disabled={loading} variant="outlined" className="w-full"  type="submit">{t('navigation_signin')} {!loading && <Login className="ml-2"/>} {loading && <CircularProgress className="ml-2" size={'1rem'}/>}</Button>
                </div>
                
            </form>
        </Box>
    )
}