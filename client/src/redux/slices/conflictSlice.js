import { createSlice } from "@reduxjs/toolkit";
const EmptyConflictEvent = {
    conflictEventTypeId: "",
    title: "",
    description: "",
    source: "",
};
const initialState = {
    appName: "FireFront",
    conflictEventTypes: null,
    selectedConflict: null,
    conflicts: null,
    reportLocation: null,
    clickToReportMode: false,
    newConflictEvent: EmptyConflictEvent,
    conflictEvents: [],
    selectedConflictEvent: null,
};
export const conflictSlice = createSlice({
    name: "conflict",
    initialState,
    reducers: {
        setConflicts: (state, action) => {
            state.conflicts = [...action.payload];
        },

        setSelectedConflict: (state, action) => {
            console.log(action.payload);
            if (action.payload) {
                state.selectedConflict = { ...action.payload };
            } else {
                state.selectedConflict = {};
            }
        },
        setConflictEventTypes: (state, action) => {
            state.conflictEventTypes = action.payload;
        },
        setReportLocation: (state, action) => {
            state.reportLocation = action.payload;
        },
        toggleClickToReportMode: (state) => {
            state.clickToReportMode = !state.clickToReportMode;
        },
        updateNewConflictEventTitle: (state, action) => {
            state.newConflictEvent = {
                ...state.newConflictEvent,
                title: action.payload,
            };
        },
        updateNewConflictEventDescription: (state, action) => {
            state.newConflictEvent = {
                ...state.newConflictEvent,
                description: action.payload,
            };
        },
        updateNewConflictEventSource: (state, action) => {
            state.newConflictEvent = {
                ...state.newConflictEvent,
                source: action.payload,
            };
        },
        updateNewConflictEventTypeId: (state, action) => {
            state.newConflictEvent = {
                ...state.newConflictEvent,
                conflictEventTypeId: action.payload,
            };
        },
        clearNewConflict: (state) => {
            state.newConflictEvent = EmptyConflictEvent;
        },
        setConflictEvents: (state, action) => {
            state.conflictEvents = action.payload;
        },
        setSelectedConflictEvent: (state, action) => {
            state.selectedConflictEvent = action.payload;
        },
    },
});

export const {
    setConflicts,
    setSelectedConflict,
    setReportLocation,
    setConflictEventTypes,
    toggleClickToReportMode,
    updateNewConflictEventTitle,
    updateNewConflictEventDescription,
    updateNewConflictEventSource,
    updateNewConflictEventTypeId,
    clearNewConflict,
    setConflictEvents,
    setSelectedConflictEvent,
} = conflictSlice.actions;

export default conflictSlice.reducer;
