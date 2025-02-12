import { createStore } from "redux";



const initialState = {
    products:[],
    categories:[]
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
    
        default:
            break;
    }
    return prevState
}

const store = createStore(appReducer)

export default store