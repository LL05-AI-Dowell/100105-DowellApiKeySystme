import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './reducers/data'
import serviceReducer from './reducers/service'

const store = configureStore({
  reducer: {
    data: dataReducer,
    service: serviceReducer,
  },
});

export default store;
