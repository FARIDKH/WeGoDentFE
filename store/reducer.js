import { combineReducers } from 'redux'

// reducer import
import customizationReducer from './customizationReducer'
import snackbarReducer from './snackbarReducer'
import filterReducer from './filterReducer'
//-----------------------|| COMBINE REDUCER ||-----------------------//

const reducer = combineReducers({
    customization: customizationReducer,
    snackbar: snackbarReducer,
    filter: filterReducer,
})

export default reducer
