import {
    Box,
    Button,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    setUser,
    toggleAuthState,
    toggleShowSignIn,
} from "src/redux/slices/accountSlice";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { fireAuth, fireStore } from "../firebase/firebase-init";
import axios from "axios";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import moment from "moment";

export const SignInModal = () => {
    const showSignIn = useSelector((state) => state.account.showSignIn);
    const authState = useSelector((state) => state.account.authState);

    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(toggleShowSignIn());
    };
    const handleClick = () => {
        dispatch(toggleAuthState());
    };
    return (
        <Modal isOpen={showSignIn} onClose={handleClose} isCentered>
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalBody p={0}>
                    <Box
                        p={6}
                        py={4}
                        borderBottom={"1px solid rgba(0,0,0,.2)"}
                        bg={"black"}
                    >
                        <Heading size={"lg"} color={"white"}>
                            {authState === "SIGN_IN" ? "Sign In" : "Sign Up"}
                        </Heading>
                    </Box>

                    <Box p={6}>
                        {authState === "SIGN_IN" ? (
                            <SignInForm />
                        ) : (
                            <SignUpForm />
                        )}
                    </Box>
                    <Box p={6} py={4} borderTop={"1px solid rgba(0,0,0,.2)"}>
                        <VStack w={"full"} spacing={4}>
                            <Button
                                variant={"link"}
                                color={"black"}
                                onClick={handleClick}
                            >
                                {authState === "SIGN_IN"
                                    ? "Dont have an account? Sign up"
                                    : "Back to log in"}
                            </Button>
                        </VStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
const SignUpForm = () => {
    const [ipAddress, setIpAddress] = useState();
    const [canCreateAccount, setCanCreateAccount] = useState(false);
    const EmptyUser = {
        firstName: "",
        lastName: "",
        email: "",
    };
    const [newUser, setNewUser] = useState(EmptyUser);
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const updateNewUser = (param, val) => {
        setNewUser({
            ...newUser,
            [param]: val,
        });
    };

    const updateFirstName = (e) => updateNewUser("firstName", e.target.value);
    const updateLastName = (e) => updateNewUser("lastName", e.target.value);
    const updateEmail = (e) => updateNewUser("email", e.target.value);
    const updatePassword = (e) => setPassword(e.target.value);

    const determineCanCreateAccount = async () => {
        const ipAddr = (await axios.get("https://api.ipify.org?format=json"))
            .data.ip;
        setIpAddress(ipAddr);
        const userCollection = collection(fireStore, "user");
        const userQry = query(userCollection, where("ipAddr", "==", ipAddr));
        const userDocs = await getDocs(userQry);
        setCanCreateAccount(userDocs.size === 0);
    };

    const createAccount = async () => {
        const userCred = await createUserWithEmailAndPassword(
            fireAuth,
            newUser.email,
            password
        );
        const userID = userCred.user.uid;
        const userData = {
            ...newUser,
            ipAddr: ipAddress,
            createdDate: new Date(),
            userId: userID,
        };
        await setDoc(doc(fireStore, "user", userID), userData);
        dispatch(setUser(userData));
        dispatch(toggleShowSignIn());
    };
    useEffect(() => {
        console.table(newUser);
    }, [newUser]);
    useEffect(() => {
        determineCanCreateAccount();
    }, []);

    return (
        (true || canCreateAccount) && (
            <VStack w={"full"}>
                <Box w={"full"}>
                    <Text mb={1}>First Name</Text>
                    <Input onChange={updateFirstName} />
                </Box>
                <Box w={"full"}>
                    <Text mb={1}>Last Name</Text>
                    <Input onChange={updateLastName} />
                </Box>
                <Box w={"full"}>
                    <Text mb={1}>Email Address</Text>
                    <Input onChange={updateEmail} />
                </Box>
                <Box w={"full"}>
                    <Text mb={1}>Password</Text>
                    <Input onChange={updatePassword} />
                </Box>
                <Button
                    mt={2}
                    w={"full"}
                    bg={"black"}
                    colorScheme="blackAlpha"
                    size={"lg"}
                    onClick={createAccount}
                >
                    Continue
                </Button>
            </VStack>
        )
    );
};
const SignInForm = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const updateUsername = (e) => setUsername(e.target.value);
    const updatePassword = (e) => setPassword(e.target.value);

    const handleSignIn = async () => {
        setLoading(true);
        const userCred = await signInWithEmailAndPassword(
            fireAuth,
            username,
            password
        ).catch((err) => {
            console.log(err);
        });
        if(!)
        const userDocRef = doc(fireStore, "user", userCred.user.uid);
        const userDoc = await getDoc(userDocRef);
        dispatch(
            setUser({
                ...userDoc.data(),
                userId: userDoc.id,
                createdDate: moment(userDoc.data().createdDate.toDate()),
            })
        );
        setLoading(false);
        dispatch(toggleShowSignIn());
    };
    return (
        <VStack w={"full"}>
            <Box w={"full"}>
                <Text mb={1}>Username</Text>
                <Input value={username} onChange={updateUsername} />
            </Box>
            <Box w={"full"}>
                <Text mb={1}>Password</Text>
                <Input
                    value={password}
                    type={"password"}
                    onChange={updatePassword}
                />
            </Box>
            <Button
                mt={2}
                w={"full"}
                bg={"black"}
                colorScheme="blackAlpha"
                size={"lg"}
                onClick={handleSignIn}
            >
                Continue
            </Button>
        </VStack>
    );
};
