import { toggleCheckAuth } from "../reducers/entry";

const authenticationMiddleware = store => next => action => {
    const dispatch = store.dispatch;
    if (action.type.endsWith('rejected')) {  
        const status = action.payload?.status || (action.error && action.error.message && action.error.message.status);
        console.log(action)
        if (status == 403 || status == 401) {
            dispatch(toggleCheckAuth());
        }
    }
    return next(action);
};

export default authenticationMiddleware;