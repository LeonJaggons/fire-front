import "react-datepicker/dist/react-datepicker.css";
import "../firebase/firebase-init";
import { Link } from "@chakra-ui/next-js";
import {
    Avatar,
    Box,
    Button,
    ChakraProvider,
    Collapse,
    Divider,
    HStack,
    Heading,
    Icon,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Select,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import {
    Provider as ReduxProvider,
    useDispatch,
    useSelector,
} from "react-redux";

import { MdCampaign, MdLogin, MdSpeaker } from "react-icons/md";
import {
    GiAwareness,
    GiCloakDagger,
    GiConfrontation,
    GiWalkieTalkie,
} from "react-icons/gi";
import "@styles/globals.scss";
import NextLink from "next/link";
import { store } from "src/redux/store";
import { useEffect } from "react";
import {
    loadAllConflicts,
    loadConflictEventTypes,
    streamConflictEvents,
} from "src/services/conflictService";
import {
    setMapReset,
    setSelectedConflict,
    setSelectedConflictEvent,
    toggleClickToReportMode,
} from "src/redux/slices/conflictSlice";
import { toggleShowSignIn } from "src/redux/slices/accountSlice";
import { create, find } from "lodash";
import { handleClientScriptLoad } from "next/script";
import { Timestamp, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { SignInModal } from "./SignInModal";

function MyApp({ Component, pageProps }) {
    return (
        <Providers>
            <AppContainer>
                <AppHeader />
                <AppContent>
                    <Component {...pageProps} />
                </AppContent>
            </AppContainer>
        </Providers>
    );
}

const Providers = ({ children }) => {
    return (
        <ChakraProvider>
            <ReduxProvider store={store}>{children}</ReduxProvider>
        </ChakraProvider>
    );
};

const AppContainer = ({ children }) => {
    const conflictEvents = useSelector(
        (state) => state.conflict.conflictEvents
    );
    const selectedConflict = useSelector(
        (state) => state.conflict.selectedConflict
    );
    const onFirstLoad = async () => {
        await loadAllConflicts();
        await loadConflictEventTypes();
    };
    useEffect(() => {
        onFirstLoad();
    }, []);
    useEffect(() => {
        let unsub;
        if (selectedConflict) {
            unsub = streamConflictEvents(selectedConflict.id);
        }
        return () => {
            unsub && unsub();
        };
    }, [selectedConflict]);
    return <Box id={"app-container"}>{children}</Box>;
};
const AppContent = ({ children }) => {
    return <Box id={"app-content"}>{children}</Box>;
};

const AppHeader = () => {
    const appName = useSelector((state) => state.conflict.appName);
    const clickToReportMode = useSelector(
        (state) => state.conflict.clickToReportMode
    );
    return (
        <Collapse in={!clickToReportMode}>
            <HStack
                id={"app-header"}
                shadow={"md"}
                h={"64px"}
                spacing={"12px"}
                justify={"space-between"}
                bg={"rgb(17,19,21)"}
                color={"white"}
            >
                {/* <Heading size={"md"}`o>{appName}</Heading> */}

                <HStack>
                    <Icon as={GiConfrontation} boxSize={"24px"} />
                    <Heading
                        fontSize={"24px"}
                        letterSpacing={-1}
                        fontWeight={700}
                    >
                        FireFront
                    </Heading>
                </HStack>
                <HStack>
                    <ConflictSelect />
                </HStack>
                {/* <Box flex={1} /> */}
                <AppMenu />
            </HStack>
        </Collapse>
    );
};

const ConflictSelect = () => {
    const selectedConflict = useSelector(
        (state) => state.conflict.selectedConflict
    );
    const conflicts = useSelector((state) => state.conflict.conflicts);
    const dispatch = useDispatch();

    const handleClick = (e) => {
        const conflict = find(conflicts, (c) => c.id === e);

        dispatch(setMapReset());
        dispatch(setSelectedConflictEvent(null));
        dispatch(setSelectedConflict(null));
        dispatch(setSelectedConflict(conflict));
    };

    useEffect(() => {
        conflicts && dispatch(setSelectedConflict(conflicts[0]));
    }, [conflicts]);
    return (
        <Popover zIndex={999} placement={"bottom"}>
            <PopoverTrigger>
                <Button
                    variant={"ghost"}
                    color={"white"}
                    fontSize={"30px"}
                    _hover={{ bg: "whiteAlpha.100" }}
                    px={1}
                    fontWeight={800}
                    letterSpacing={-1}
                >
                    {selectedConflict?.name}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                zIndex={999}
                border={"none"}
                shadow={"none"}
                borderRadius={5}
                overflow={"hidden"}
                top={1}
            >
                <PopoverBody bg={"rgb(36,38,39)"}>
                    <VStack w={"full"} spacing={2}>
                        {conflicts?.map((c) => (
                            <Button
                                variant={"ghost"}
                                colorScheme={"whiteAlpha"}
                                fontSize={"20px"}
                                justifyContent={"center"}
                                color={"whiteAlpha.900"}
                                letterSpacing={-1}
                                onClick={() => handleClick(c.id)}
                                w={"full"}
                            >
                                {c.name}
                            </Button>
                        ))}
                    </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
        // <Select
        //     variant={"unstyled"}
        //     fontSize={"28px"}
        //     fontWeight={"800"}
        //     onChange={handleChange}
        //     flex={"1 1 0px"}
        //     justifyContent={"center"}
        //     alignItems={"center"}
        //     borderBottomColor={"white"}
        //     _focus={{ borderColor: "white" }}
        //     _active={{ borderColor: "white" }}
        // >
        // </Select>
    );
};

const AppMenu = () => {
    return (
        <HStack id={"app-menu"} spacing={8}>
            <ReportButton />
            <AppMenuItem>Map</AppMenuItem>
            <AppMenuItem href={"/about"}>About</AppMenuItem>

            <SignInButton />
        </HStack>
    );
};

const ReportButton = () => {
    const { isOpen, onClose, onToggle } = useDisclosure();
    const user = useSelector((state) => state.account.user);
    const clickToReportMode = useSelector(
        (state) => state.conflict.clickToReportMode
    );

    const dispatch = useDispatch();
    const handleClick = () => {
        if (user) {
            dispatch(setSelectedConflictEvent(null));
            dispatch(toggleClickToReportMode());
        } else {
            dispatch(toggleShowSignIn());
        }
    };

    useEffect(() => {}, [clickToReportMode]);
    return (
        <>
            <Button
                onClick={handleClick}
                fontWeight={400}
                fontSize={"14px"}
                variant={"ghost"}
                color={"gray.200"}
                bg={!clickToReportMode ? "whiteAlpha.200" : "black"}
                colorScheme={!clickToReportMode ? "blackAlpha" : "whiteAlpha"}
                _hover={
                    {
                        // bg: !clickToReportMode ? ".200" : "gray.800",
                    }
                }
                rightIcon={<Icon as={MdCampaign} boxSize={"24px"} />}
            >
                Report Event
            </Button>
        </>
    );
};
const SignInButton = () => {
    const user = useSelector((state) => state.account.user);
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(toggleShowSignIn());
    };
    return (
        <>
            {user ? (
                <Avatar
                    name={`${user.firstName} ${user.lastName}`}
                    size={"sm"}
                />
            ) : (
                <Button
                    fontWeight={400}
                    fontSize={"14px"}
                    variant={"link"}
                    color={"gray.400"}
                    p={0}
                    _hover={{ color: "white" }}
                    iconSpacing={2}
                    onClick={handleClick}
                    rightIcon={<Icon as={MdLogin} />}
                >
                    Sign In
                </Button>
            )}
            <SignInModal />
        </>
    );
};

const AppMenuItem = ({ children, href }) => {
    return (
        <Link
            className="app-menu-item"
            href={href ?? "/"}
            as={NextLink}
            color={"gray.400"}
            ml={2}
            _hover={{
                color: "white",
                fontWeight: 600,
            }}
        >
            {children}
        </Link>
    );
};
export default MyApp;
