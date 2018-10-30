const initState = {
    user:null,
    loaded:false,
    pageTitle:'Dashboard',
    levels:[],
    properties:[],
    extras:[]
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
    else if(action.type === 'UPDATE_LEVELS')
        return {
            ...state,
            levels:action.levels
        };
    else if(action.type === 'UPDATE_PROPERTIES')
        return {
            ...state,
            properties:action.properties
        };
    else if(action.type === 'UPDATE_EXTRAS')
        return {
            ...state,
            extras:action.extras
        };
    return state;
}

export default rootReducer;