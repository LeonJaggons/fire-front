import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authState: "SIGN_IN",
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
        setUser: (state, action) => {
            state.user = action.payload;
        },
        toggleAuthState: (state) => {
            switch (state.authState) {
                case "SIGN_IN":
                    state.authState = "SIGN_UP";
                    break;
                case "SIGN_UP":
                    state.authState = "SIGN_IN";
                    break;
            }
        },
    },
});

export const { toggleShowSignIn, toggleAuthState, setUser } =
    accountSlice.actions;
export default accountSlice.reducer;
