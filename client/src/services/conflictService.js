import {
    addDoc,
    collection,
    getDocs,
    onSnapshot,
    query,
    where,
} from "@firebase/firestore";
import { find } from "lodash";
import { fireStore } from "src/firebase/firebase-init";
import {
    setConflictEventTypes,
    setConflictEvents,
    setConflicts,
    setReportLocation,
    setSelectedConflict,
} from "src/redux/slices/conflictSlice";
import { store } from "src/redux/store";

const conflictCollection = collection(fireStore, "conflict");
const conflictEventCollection = collection(fireStore, "conflictEvent");
const conflictEventTypeCollection = collection(fireStore, "conflictEventType");

export const getAllConflicts = async () => {
    const conflictsSnap = await getDocs(conflictCollection);
    const conflicts = conflictsSnap.docs.map((c) => {
        const conflictId = c.id;
        const conflictData = c.data();
        return {
            id: conflictId,
            ...conflictData,
            startDate: conflictData.startDate
                ? conflictData.startDate.toDate()
                : null,
            endDate: conflictData.endDate
                ? conflictData.endDate.toDate()
                : null,
        };
    });
    return conflicts;
};

export const loadAllConflicts = async () => {
    const conflicts = await getAllConflicts();
    if (conflicts.length > 0) {
        store.dispatch(setConflicts(conflicts));
        store.dispatch(setSelectedConflict(conflicts[0]));
    }
};
export const getAllConflictEventTypes = async () => {
    const conflictEventTypeSnap = await getDocs(conflictEventTypeCollection);
    const conflictEventTypes = conflictEventTypeSnap.docs.map((c) => {
        return { id: c.id, ...c.data() };
    });
    return conflictEventTypes;
};

export const loadConflictEventTypes = async () => {
    const conflictEventTypes = await getAllConflictEventTypes();
    store.dispatch(setConflictEventTypes(conflictEventTypes));
};
export const publishConflictEvent = async () => {
    const selectedConflict = store.getState().conflict.selectedConflict;
    const newConflictEvent = store.getState().conflict.newConflictEvent;
    const reportLocation = store.getState().conflict.reportLocation;

    const conflictEvent = {
        ...newConflictEvent,
        conflictId: selectedConflict.id,
        latitude: reportLocation[0],
        longitude: reportLocation[1],
    };

    await addDoc(conflictEventCollection, conflictEvent);
    store.dispatch(setReportLocation(null));
};

export const streamConflictEvents = (conflictId) => {
    const conflictEventQry = query(
        conflictEventCollection,
        where("conflictId", "==", conflictId)
    );
    const unsub = onSnapshot(conflictEventQry, (snap) => {
        let conflictEvents = [];
        for (let conflictDoc of snap.docs) {
            const conflictEventData = conflictDoc.data();
            const conflictEvent = {
                ...conflictEventData,
                conflictEventType: find(
                    store.getState().conflict.conflictEventTypes,
                    (o) => o.id === conflictEventData.conflictEventTypeId
                ),
                id: conflictDoc.id,
            };
            conflictEvents.push(conflictEvent);
        }
        store.dispatch(setConflictEvents(conflictEvents));
    });
    return unsub;
};
