import "../firebase/firebase-init";
import { Link } from "@chakra-ui/next-js";
import {
    Box,
    Button,
    ChakraProvider,
    Collapse,
    HStack,
    Heading,
    Icon,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Select,
    Text,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import {
    Provider as ReduxProvider,
    useDispatch,
    useSelector,
} from "react-redux";

import { MdCampaign, MdLogin, MdSpeaker } from "react-icons/md";
import { GiAwareness, GiConfrontation, GiWalkieTalkie } from "react-icons/gi";
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
    setSelectedConflict,
    setSelectedConflictEvent,
    toggleClickToReportMode,
} from "src/redux/slices/conflictSlice";
import { toggleShowSignIn } from "src/redux/slices/accountSlice";
import { find } from "lodash";
import { handleClientScriptLoad } from "next/script";

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
    useEffect(() => {
        console.log(conflictEvents);
    }, [conflictEvents]);
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
                bg={"rgb(17,19,21)"}
                color={"white"}
            >
                {/* <Heading size={"md"}`o>{appName}</Heading> */}

                <HStack>
                    <Icon as={GiConfrontation} boxSize={"30px"} />
                    <ConflictSelect />
                </HStack>
                <Box flex={1} />
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

        dispatch(setSelectedConflictEvent(null));
        dispatch(setSelectedConflict(null));
        dispatch(setSelectedConflict(conflict));
    };

    useEffect(() => {
        conflicts && dispatch(setSelectedConflict(conflicts[0]));
    }, [conflicts]);
    return (
        <Popover zIndex={999} placement={"bottom-start"}>
            <PopoverTrigger>
                <Button
                    variant={"ghost"}
                    color={"white"}
                    fontSize={"24px"}
                    _hover={{ bg: "whiteAlpha.100" }}
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
            >
                <PopoverBody bg={"rgb(36,38,39)"}>
                    <VStack w={"full"} spacing={2}>
                        {conflicts?.map((c) => (
                            <Button
                                variant={"ghost"}
                                colorScheme={"whiteAlpha"}
                                fontSize={"20px"}
                                justifyContent={"flex-start"}
                                color={"whiteAlpha.900"}
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
            <AppMenuItem>About</AppMenuItem>

            {/* <SignInButton /> */}
        </HStack>
    );
};

const ReportButton = () => {
    const { isOpen, onClose, onToggle } = useDisclosure();
    const clickToReportMode = useSelector(
        (state) => state.conflict.clickToReportMode
    );

    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(toggleClickToReportMode());
    };

    useEffect(() => {
        console.log(clickToReportMode);
    }, [clickToReportMode]);
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
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(toggleShowSignIn());
    };
    return (
        <>
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
            <SignInModal />
        </>
    );
};

const SignInModal = () => {
    const showSignIn = useSelector((state) => state.account.showSignIn);

    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(toggleShowSignIn());
    };
    return (
        <Modal isOpen={showSignIn} onClose={handleClose} isCentered>
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalBody p={0}>
                    <Box
                        p={6}
                        borderBottom={"1px solid rgba(0,0,0,.2)"}
                        bg={"black"}
                    >
                        <Heading size={"lg"} color={"white"}>
                            Sign In
                        </Heading>
                    </Box>

                    <Box p={6}>
                        <VStack w={"full"}>
                            <Input />
                            <Input />
                        </VStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
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
            }}
        >
            {children}
        </Link>
    );
};
export default MyApp;
