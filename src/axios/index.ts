import axios from 'axios';
import { TOKEN_KEY } from '../constants';

const token = () => localStorage.getItem(TOKEN_KEY) 

let authToken =  token()
const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URl,
});

instance.interceptors.request.use(async (req:any) => {
    if(!authToken){
        authToken = token();
    }
  
   // const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1

    //if (!isExpired) return req

    req.headers.Authorization = `Bearer ${token()}`
    return req

}, error => {
    return Promise.reject(error);
});

export default instance