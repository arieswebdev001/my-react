const initState = {
    user:null,
    loaded:false,
    pageTitle:'Dashboard'
};

const rootReducer = (state = initState, action) =>{
    if(action.type === 'UPDATE_USER')
        return {
            ...state,
            user:action.user
        };
    else if(action.type === 'UPDATE_LOADED')
        return {
            ...state,
            loaded:action.loaded
        };
    else if(action.type === 'UPDATE_PAGE_TITLE')
        return {
            ...state,
            pageTitle:action.pageTitle
        };

    return state;
}

export default rootReducer;