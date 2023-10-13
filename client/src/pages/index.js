import Head from "next/head";

import { ConflictMap } from "../components/ConflictMap";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@chakra-ui/alert";
import { Collapse } from "@chakra-ui/transition";
import { Box, HStack, Heading, Text, VStack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import {
    MdArrowUpward,
    MdCampaign,
    MdChevronLeft,
    MdOutlineArrowDownward,
    MdOutlineArrowUpward,
} from "react-icons/md";
import { Button, IconButton } from "@chakra-ui/button";
import {
    setSideBarState,
    toggleClickToReportMode,
} from "src/redux/slices/conflictSlice";
import { Tag } from "@chakra-ui/tag";
import { ConflictList } from "../components/ConflictList";
import { Tabs } from "@chakra-ui/tabs";
import moment from "moment";
import { Input } from "@chakra-ui/input";

export const DEFAULT_CENTER = [38.907132, -77.036546];

export default function Home() {
    return (
        <>
            <Head>
                <title>FireFront</title>
                <meta
                    name="description"
                    content="Create mapping apps with Next.js Leaflet Starter"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClickToReportAlert />
            <HStack
                spacing={0}
                h={"calc(100vh - 64px)"}
                // border={clickToReportMode && "8px solid white"}
            >
                <ConflictMap />
                <ConflictSideBar />
            </HStack>
        </>
    );
}

const ConflictComments = () => {
    return (
        <VStack flex={1} w={"full"} spacing={0}>
            <Box flex={1} p={4} w={"full"}>
                <Heading>Comments</Heading>
            </Box>
            <Box p={4} w={"full"}>
                <HStack w={"full"}>
                    <Input
                        variant={"unstyled"}
                        placeholder={"Write a comment"}
                        flex={1}
                        style={{ caretColor: "white" }}
                        color={"whiteAlpha.800"}
                    />
                </HStack>
            </Box>
        </VStack>
    );
};
const ConflictSideBar = () => {
    const dispatch = useDispatch();
    const handleBack = () => {
        dispatch(setSideBarState("CONFLICT"));
    };
    const sideBarState = useSelector((state) => state.conflict.sideBarState);
    const getSideBarContent = (newState) => {
        switch (newState) {
            case "CONFLICT":
                return <ConflictList />;
            case "COMMENT":
                return <ConflictComments />;
            default:
                return <></>;
        }
    };
    return (
        <VStack
            minW={"23vw"}
            h={"full"}
            bg={"rgb(17,19,21)"}
            alignItems={"flex-start"}
            spacing={0}
        >
            <Box
                p={4}
                bg={false ? "red.500" : "whiteAlpha.200"}
                borderBottom={"1px solid rgba(0,0,0,.1)"}
                w={"full"}
                color={"white"}
            >
                <VStack
                    spacing={0}
                    justify={"space-between"}
                    alignItems={"flex-start"}
                >
                    {sideBarState === "COMMENT" && (
                        <Button
                            variant={"whiteAlpha.400"}
                            color={"white"}
                            w={"auto"}
                            h={"auto"}
                            onClick={handleBack}
                            p={0}
                            fontWeight={400}
                            fontSize={"12px"}
                            mb={1}
                            leftIcon={<Icon as={MdChevronLeft} />}
                            iconSpacing={"4px"}
                        >
                            Back to Events
                        </Button>
                    )}
                    <Heading size={"md"} color={"white"} mb={1}>
                        {sideBarState === "CONFLICT"
                            ? "Conflict Events"
                            : "Comments"}
                    </Heading>
                </VStack>
                {sideBarState === "CONFLICT" && (
                    <Text fontSize={10}>
                        Last updated {moment().format("MMMM D, YYYY h:mma")}
                    </Text>
                )}
            </Box>
            {getSideBarContent(sideBarState)}
        </VStack>
    );
};

const ClickToReportAlert = () => {
    const selectedConflict = useSelector(
        (state) => state.conflict.selectedConflict
    );
    const clickToReportMode = useSelector(
        (state) => state.conflict.clickToReportMode
    );
    const dispatch = useDispatch();
    const cancelClickToReport = () => {
        dispatch(toggleClickToReportMode());
    };
    return (
        <Collapse in={clickToReportMode} bg={"black"}>
            <Alert bg={"black"} color={"white"} py={2} h={"64px"}>
                <HStack w={"full"}>
                    <HStack flex={1}>
                        <Icon
                            as={MdCampaign}
                            color={"white"}
                            boxSize={"23px"}
                        />

                        <Text color={"white"} fontSize={"sm"}>
                            Click anywhere on the map to report an event for the{" "}
                            {selectedConflict?.name}.
                        </Text>
                    </HStack>
                    <Button
                        p={1}
                        size={"sm"}
                        onClick={cancelClickToReport}
                        variant={"ghost"}
                        colorScheme={"whiteAlpha"}
                        color={"white"}
                    >
                        Cancel
                    </Button>
                </HStack>
            </Alert>
        </Collapse>
    );
};
