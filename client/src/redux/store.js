import { configureStore } from "@reduxjs/toolkit";

import conflictReducer from "./slices/conflictSlice";
export const store = configureStore({
    reducer: {
        conflict: conflictReducer,
    },
});
