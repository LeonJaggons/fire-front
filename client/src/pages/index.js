import Head from "next/head";

import { ConflictMap } from "../components/ConflictMap";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@chakra-ui/alert";
import { Collapse, SlideFade } from "@chakra-ui/transition";
import { Center, Box, HStack, Heading, Text, VStack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import { MdCampaign, MdChevronLeft, MdSend } from "react-icons/md";
import { Button, IconButton } from "@chakra-ui/button";
import {
    setSideBarState,
    toggleClickToReportMode,
} from "src/redux/slices/conflictSlice";
import { ConflictList } from "../components/ConflictList";
import moment from "moment";
import { Input } from "@chakra-ui/input";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "src/firebase/firebase-init";
import { useEffect, useState } from "react";
import {
    loadConflictEventComments,
    publishComment,
} from "src/services/conflictService";
import { Avatar } from "@chakra-ui/react";

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
    const [content, setContent] = useState("");
    const selectedComments = useSelector(
        (state) => state.conflict.selectedComments
    );
    const handlePublish = async () => {
        await publishComment(content);
        setContent("");
        await loadConflictEventComments();
    };
    useEffect(() => {
        console.log("CMMENTS", selectedComments);
    }, [selectedComments]);
    return (
        <VStack flex={1} h={"full"} spacing={0} w={"full"}>
            <VStack flex={1} p={4} w={"full"} alignItems={"flex-start"}>
                {selectedComments?.map((c) => {
                    return (
                        <HStack spacing={3}>
                            <Avatar name={c.userName} size={"sm"} />
                            <Box p={2} bg={"whiteAlpha.200"} borderRadius={4}>
                                <Heading
                                    size={"xs"}
                                    fontWeight={500}
                                    fontSize={12}
                                    mb={1}
                                    color={"whiteAlpha.600"}
                                >
                                    {c.userName}
                                </Heading>
                                <Text color={"white"} fontSize={14}>
                                    {c.content}
                                </Text>
                            </Box>
                        </HStack>
                    );
                })}
                {!selectedComments ||
                    (selectedComments && selectedComments.length === 0 && (
                        <Center>
                            <Heading>No comments</Heading>
                        </Center>
                    ))}
            </VStack>

            <Box p={4} w={"full"}>
                <HStack w={"full"}>
                    <Input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        variant={"unstyled"}
                        placeholder={"Write a comment"}
                        flex={1}
                        style={{ caretColor: "white" }}
                        color={"whiteAlpha.800"}
                    />
                    <IconButton
                        icon={<Icon as={MdSend} color={"red.500"} />}
                        variant={"ghost"}
                        onClick={handlePublish}
                        isDisabled={!content || content.trim() === ""}
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
    useEffect(() => {
        const unsub = onAuthStateChanged(
            fireAuth,
            (user) => {
                if (user) {
                    console.log("USER", user);
                } else {
                    console.log("NOTHING");
                }
            },
            (err) => {
                console.log(err);
            }
        );
        return () => {
            unsub();
        };
    }, []);
    return (
        <VStack
            minW={"320px"}
            maxW={"25vw"}
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
                            iconSpacing={"2px"}
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
            {/* {getSideBarContent(sideBarState)} */}
            <SlideFade
                in={sideBarState === "CONFLICT"}
                flex={1}
                hidden={sideBarState !== "CONFLICT"}
                style={{ flex: 1 }}
            >
                <Box minW={"320px"} maxW={"25vw"}>
                    <ConflictList />
                </Box>
            </SlideFade>
            <SlideFade
                h={"full"}
                flex={1}
                in={sideBarState === "COMMENT"}
                hidden={sideBarState !== "COMMENT"}
                style={{ flex: 1 }}
                w={"full"}
            >
                <ConflictComments />
            </SlideFade>
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
                            {selectedConflict?.name} conflict.
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
