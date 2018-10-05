import axios from 'axios';

export default axios.create({
    baseURL: 'https://takara.exactiv.com/',
    headers:{
        common:{
            Authorization:'Bearer ' + window.localStorage.access_token
        }
    }
});