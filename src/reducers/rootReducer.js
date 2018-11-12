const initState = {
    default_property:null,
    user:null,
    loaded:false,
    pageTitle:'Dashboard',
    levels:[],
    properties:[],
    extras:[],
    room_type:null,
    room_types:[],
    rooms_list_view: window.localStorage.getItem("UPDATE_ROOMS_LIST_VIEW") === null?'grid':window.localStorage.getItem("UPDATE_ROOMS_LIST_VIEW")
};

const rootReducer = (state = initState, action) =>{
    if(action.type === 'UPDATE_USER')
        return {
            ...state,
            user:action.payload
        };
    else if(action.type === 'UPDATE_DEFAULT_PROPERTY')
        return {
            ...state,
            default_property:action.payload
        };
    else if(action.type === 'UPDATE_LOADED')
        return {
            ...state,
            loaded:action.payload
        };
    else if(action.type === 'UPDATE_PAGE_TITLE')
        return {
            ...state,
            pageTitle:action.payload
        };
    else if(action.type === 'UPDATE_LEVELS')
        return {
            ...state,
            levels:action.payload
        };
    else if(action.type === 'UPDATE_PROPERTIES')
        return {
            ...state,
            properties:action.payload
        };
    else if(action.type === 'UPDATE_EXTRAS')
        return {
            ...state,
            extras:action.payload
        };
    else if(action.type === 'UPDATE_ROOM_TYPE')
        return {
            ...state,
            room_type:action.payload
        };
    else if(action.type === 'UPDATE_PROPERTIES')
        return {
            ...state,
            properties:action.payload
        };
    else if(action.type === 'UPDATE_ROOM_TYPES')
            return {
                ...state,
                room_types:action.payload
            };
    else if(action.type === 'UPDATE_ROOMS_LIST_VIEW'){
        window.localStorage.setItem('UPDATE_ROOMS_LIST_VIEW', action.payload);
        return {
            ...state,
            rooms_list_view:action.payload
        };
    }
            
    return state;
}

export default rootReducer;