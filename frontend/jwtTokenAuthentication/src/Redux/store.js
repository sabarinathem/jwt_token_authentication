import { createStore } from "redux";



const initialState = {
    products:[],
    categories:[],
    category_id:null,
    search:''
}

function appReducer(prevState = initialState,action){
    switch (action.type) {
        case 'set_products':
            
            return {
                ...prevState,products:action.payload
            }
        case 'set_categories':
        
            return {
                ...prevState,categories:action.payload
            }
        case 'set_category_id':
        
            return {
                ...prevState,category_id:action.payload
            }
        
        case 'set_search':
        
            return {
                ...prevState,search:action.payload
            }
    
        default:
            break;
    }
    return prevState
}

const store = createStore(appReducer)

export default store