import Head from "next/head";

import { ConflictMap } from "../components/ConflictMap";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@chakra-ui/alert";
import { Collapse } from "@chakra-ui/transition";
import { Box, Center, HStack, Heading, Text, VStack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import {
    MdArrowUpward,
    MdCampaign,
    MdFlight,
    MdLocalFireDepartment,
    MdOutlineArrowDownward,
    MdOutlineArrowUpward,
} from "react-icons/md";
import {
    PiArrowCircleDown,
    PiArrowCircleDownFill,
    PiArrowCircleUp,
    PiArrowCircleUpFill,
} from "react-icons/pi";
import { Button, IconButton } from "@chakra-ui/button";
import { toggleClickToReportMode } from "src/redux/slices/conflictSlice";
import { Tag } from "@chakra-ui/tag";
import { useState } from "react";

export const DEFAULT_CENTER = [38.907132, -77.036546];

export default function Home() {
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
        <>
            <Head>
                <title>Next.js Leaflet Starter</title>
                <meta
                    name="description"
                    content="Create mapping apps with Next.js Leaflet Starter"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
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
                                Click anywhere on the map to report an event for
                                the {selectedConflict?.name}.
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

            <HStack
                spacing={0}
                h={"calc(100vh - 64px)"}
                // border={clickToReportMode && "8px solid white"}
            >
                <ConflictMap />
                <ConflictList />
            </HStack>
        </>
    );
}

const ConflictList = () => {
    const clickToReportMode = useSelector(
        (state) => state.conflict.clickToReportMode
    );
    const conflictEvents = useSelector(
        (state) => state.conflict.conflictEvents
    );
    return (
        <VStack
            // bg={"black"}
            h={"full"}
            alignItems={"flex-start"}
            minW={"25vw"}
            bg={"gray.100"}
        >
            <Box
                p={4}
                bg={true ? "red.500" : "#333333"}
                borderBottom={"1px solid rgba(0,0,0,.1)"}
                w={"full"}
                color={"white"}
            >
                <Heading size={"md"} color={"white"} mb={1}>
                    Conflict Events
                </Heading>
                <Text fontSize={12}>Last updated</Text>
            </Box>

            {conflictEvents?.map((c) => (
                <ConflictEvent c={c} />
            ))}
        </VStack>
    );
};

const ConflictEvent = ({ c }) => {
    const [isUpvoted, setIsUpvoted] = useState();
    const getFFIcon = (name) => {
        switch (name) {
            case "Airstrike/Bombing":
                return MdFlight;
            case "Firefight/Shooting":
                return MdLocalFireDepartment;
            case "Leader Announcement":
                return MdCampaign;
        }
        return null;
    };
    return (
        <Box
            shadow={"sm"}
            _hover={{ shadow: "md" }}
            w={"full"}
            p={4}
            py={2}
            cursor={"pointer"}
        >
            <VStack w={"full"}>
                <HStack spacing={4} w={"full"}>
                    <Center
                        boxSize={"50px"}
                        w={"50px"}
                        bg={"red.500"}
                        borderRadius={"25px"}
                    >
                        <Icon
                            as={getFFIcon(c.conflictEventType.name)}
                            color={"white"}
                            boxSize={"34px"}
                        />
                    </Center>
                    <VStack
                        w={"full"}
                        alignItems={"flex-start"}
                        flex={1}
                        spacing={1}
                    >
                        <Heading size={"sm"}>{c.title}</Heading>

                        <Text fontSize={"sm"}>{c.description}</Text>
                    </VStack>
                    <VStack spacing={0}>
                        <IconButton
                            variant={"ghost"}
                            icon={
                                <Icon
                                    as={
                                        isUpvoted && isUpvoted === true
                                            ? PiArrowCircleUpFill
                                            : PiArrowCircleUp
                                    }
                                />
                            }
                        />
                        <IconButton
                            variant={"ghost"}
                            icon={
                                <Icon
                                    as={
                                        isUpvoted && isUpvoted === false
                                            ? PiArrowCircleDownFill
                                            : PiArrowCircleDown
                                    }
                                />
                            }
                        />
                    </VStack>
                </HStack>
            </VStack>
        </Box>
    );
};
