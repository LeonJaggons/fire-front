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
    Select,
    useDisclosure,
} from "@chakra-ui/react";
import {
    Provider as ReduxProvider,
    useDispatch,
    useSelector,
} from "react-redux";

import { MdCampaign, MdSpeaker } from "react-icons/md";
import { GiAwareness } from "react-icons/gi";
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
    toggleClickToReportMode,
} from "src/redux/slices/conflictSlice";
import { find } from "lodash";

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
                spacing={"80px"}
                h={"64px"}
                bg={"black"}
                color={"white"}
            >
                {/* <Heading size={"md"}`o>{appName}</Heading> */}

                <HStack>
                    <Icon as={GiAwareness} boxSize={"30px"} mr={2} />
                    <ConflictSelect />
                </HStack>
                <Box flex={1} />
                <AppMenu />
            </HStack>
        </Collapse>
    );
};

const ConflictSelect = () => {
    const conflicts = useSelector((state) => state.conflict.conflicts);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const conflict = find(conflicts, (c) => c.id === e.target.value);

        dispatch(setSelectedConflict(null));
        dispatch(setSelectedConflict(conflict));
    };
    return (
        <Select
            variant={"unstyled"}
            fontSize={"28px"}
            fontWeight={"800"}
            onChange={handleChange}
            flex={"1 1 0px"}
            justifyContent={"center"}
            alignItems={"center"}
            borderBottomColor={"white"}
            _focus={{ borderColor: "white" }}
            _active={{ borderColor: "white" }}
        >
            {conflicts?.map((c) => (
                <option value={c.id}>{c.name}</option>
            ))}
        </Select>
    );
};

const AppMenu = () => {
    return (
        <HStack id={"app-menu"} spacing={8}>
            <ReportButton />
            <AppMenuItem>Map</AppMenuItem>

            <AppMenuItem href={"/conflict"}>Conflict</AppMenuItem>
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
                color={!clickToReportMode ? "black" : "white"}
                bg={!clickToReportMode ? "white" : "black"}
                colorScheme={!clickToReportMode ? "blackAlpha" : "whiteAlpha"}
                _hover={{
                    bg: !clickToReportMode ? "gray.200" : "gray.800",
                }}
                rightIcon={<Icon as={MdCampaign} boxSize={"24px"} />}
            >
                Report Event
            </Button>
        </>
    );
};
const AppMenuItem = ({ children, href }) => {
    return (
        <Link className="app-menu-item" href={href ?? "/"} as={NextLink}>
            {children}
        </Link>
    );
};
export default MyApp;
