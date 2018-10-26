import axios from 'axios';
import {ApiUrl} from '../config';

export default axios.create({
    baseURL: ApiUrl,
    headers:{
        common:{
            Authorization:'Bearer ' + window.localStorage.access_token
        }
    }
});