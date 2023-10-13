import { configureStore } from "@reduxjs/toolkit";

import conflictReducer from "./slices/conflictSlice";
import accountReducer from "./slices/accountSlice";
export const store = configureStore({
    reducer: {
        account: accountReducer,
        conflict: conflictReducer,
    },
});
