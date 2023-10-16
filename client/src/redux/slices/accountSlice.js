import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showSignIn: false,
    user: null,
};
const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        toggleShowSignIn: (state) => {
            state.showSignIn = !state.showSignIn;
        },
    },
});

export const { toggleShowSignIn } = accountSlice.actions;
export default accountSlice.reducer;