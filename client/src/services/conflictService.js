import {
    addDoc,
    collection,
    getDocs,
    onSnapshot,
    query,
    where,
    doc,
    updateDoc,
    arrayUnion,
    orderBy,
    arrayRemove,
    increment,
    Timestamp,
} from "@firebase/firestore";
import axios from "axios";
import { find } from "lodash";
import { fireStore } from "src/firebase/firebase-init";
import {
    setConflictEventTypes,
    setConflictEvents,
    setConflicts,
    setReportLocation,
    setSelectedComments,
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
export const publishConflictEvent = async (date) => {
    const user = store.getState().account.user;
    // const ipAddr = (await axios.get("'https://api.ipify.org?format=json'")).data
    //     .ip;
    const selectedConflict = store.getState().conflict.selectedConflict;
    const newConflictEvent = store.getState().conflict.newConflictEvent;
    const reportLocation = store.getState().conflict.reportLocation;

    const conflictEvent = {
        ...newConflictEvent,
        userId: user.userId,
        conflictId: selectedConflict.id,
        latitude: reportLocation[0],
        longitude: reportLocation[1],
        eventDate: date,
        upvotes: 0,
        downvotes: 0,
        createdDate: Timestamp.now(),
    };

    await addDoc(conflictEventCollection, conflictEvent);
    store.dispatch(setReportLocation(null));
};

export const upvote = async () => {
    const selectedConflictEvent =
        store.getState().conflict.selectedConflictEvent;
    const user = store.getState().account.user;

    const userDoc = doc(fireStore, "user", user.userId);
    const conflictEventDoc = doc(
        fireStore,
        "conflictEvent",
        selectedConflictEvent.id
    );

    await updateDoc(userDoc, {
        upvoted: arrayUnion(selectedConflictEvent.id),
    });
    await updateDoc(conflictEventDoc, {
        upvotes: increment(1),
    });
};
export const downvote = async () => {
    const selectedConflictEvent =
        store.getState().conflict.selectedConflictEvent;
    const user = store.getState().account.user;

    const userDoc = doc(fireStore, "user", user.userId);
    const conflictEventDoc = doc(
        fireStore,
        "conflictEvent",
        selectedConflictEvent.id
    );

    await updateDoc(userDoc, {
        downvoted: arrayUnion(selectedConflictEvent.id),
    });
    await updateDoc(conflictEventDoc, {
        downvotes: increment(1),
    });
};

export const resetUpvote = async () => {
    const selectedConflictEvent =
        store.getState().conflict.selectedConflictEvent;
    const user = store.getState().account.user;

    const userDoc = doc(fireStore, "user", user.userId);
    const conflictEventDoc = doc(
        fireStore,
        "conflictEvent",
        selectedConflictEvent.id
    );

    await updateDoc(userDoc, {
        upvoted: arrayRemove(selectedConflictEvent.id),
    });
    await updateDoc(conflictEventDoc, {
        upvotes: increment(-1),
    });
};
export const resetDownvote = async () => {
    const selectedConflictEvent =
        store.getState().conflict.selectedConflictEvent;
    const user = store.getState().account.user;

    const userDoc = doc(fireStore, "user", user.userId);
    const conflictEventDoc = doc(
        fireStore,
        "conflictEvent",
        selectedConflictEvent.id
    );

    await updateDoc(userDoc, {
        downvoted: arrayRemove(selectedConflictEvent.id),
    });
    await updateDoc(conflictEventDoc, {
        downvotes: increment(-1),
    });
};
export const loadConflictEventComments = async () => {
    const selectedConflictEvent =
        store.getState().conflict.selectedConflictEvent;
    const commentCollection = collection(fireStore, "comment");
    console.log(selectedConflictEvent);
    const commentQry = query(
        commentCollection,
        where("conflictEventId", "==", selectedConflictEvent.id),
        orderBy("createdDate", "desc")
    );
    const commentDocs = await getDocs(commentQry);

    const userCol = collection(fireStore, "user");
    const userDocs = await getDocs(userCol);
    const users = userDocs.docs.map((ud) => {
        return { userId: ud.id, ...ud.data() };
    });

    const comments = commentDocs.docs.map((dc) => {
        const user = find(users, (o) => o.userId === dc.data().userId);
        return {
            ...dc.data(),
            userName: user.firstName + " " + user.lastName,
            createdDate: dc.data().createdDate.toDate(),
        };
    });
    console.log(comments);
    store.dispatch(setSelectedComments(comments));
};
export const publishComment = async (content) => {
    const selectedConflictEvent =
        store.getState().conflict.selectedConflictEvent;
    const user = store.getState().account.user;
    const commentData = {
        conflictEventId: selectedConflictEvent.id,
        userId: user.userId,
        content: content,
        createdDate: Timestamp.now(),
    };
    const commentCollection = collection(fireStore, "comment");
    await addDoc(commentCollection, commentData);
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
