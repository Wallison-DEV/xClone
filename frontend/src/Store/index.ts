import { configureStore } from '@reduxjs/toolkit';

import entryReducer from './reducers/entry'
import profileReducer from './reducers/profile'
import api from '../Services/api';
import authenticationMiddleware from './middleware/authenticationMiddleware';

export const store = configureStore({
    reducer: {
        entry: entryReducer,
        profile: profileReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware).concat(authenticationMiddleware),
});

export type RootReducer = ReturnType<typeof store.getState>;