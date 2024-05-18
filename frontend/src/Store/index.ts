import { configureStore } from '@reduxjs/toolkit';

import entryReducer from './reducers/entry'
import profileReducer from './reducers/profile'
import postReducer from './reducers/post'
import api from '../Services/api';

export const store = configureStore({
    reducer: {
        entry: entryReducer,
        profile: profileReducer,
        post: postReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

export type RootReducer = ReturnType<typeof store.getState>;
