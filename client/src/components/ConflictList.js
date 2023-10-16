import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Center,
    Divider,
    HStack,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import {
    MdCampaign,
    MdCheck,
    MdComment,
    MdDoneAll,
    MdFlight,
    MdLocalFireDepartment,
    MdMoreVert,
    MdReport,
} from "react-icons/md";
import {
    PiArrowCircleDown,
    PiArrowCircleDownFill,
    PiArrowCircleUp,
    PiArrowCircleUpFill,
} from "react-icons/pi";
import { Button, IconButton } from "@chakra-ui/button";
import { useEffect, useState } from "react";
import {
    setSelectedConflictEvent,
    setSideBarState,
} from "src/redux/slices/conflictSlice";
import {
    GiArtilleryShell,
    GiJetFighter,
    GiMachineGun,
    GiMachineGunMagazine,
    GiMushroomCloud,
    GiPublicSpeaker,
} from "react-icons/gi";
import { Collapse } from "@chakra-ui/transition";
import moment from "moment/moment";
import { Progress } from "@chakra-ui/progress";
import { toggleShowSignIn } from "src/redux/slices/accountSlice";

export const ConflictList = () => {
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
            w={"full"}
            spacing={0}
        >
            {conflictEvents?.map((c) => (
                <ConflictEvent c={c} />
            ))}
        </VStack>
    );
};
const ConflictEvent = ({ c }) => {
    const [isUpvoted, setIsUpvoted] = useState();
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(setSelectedConflictEvent(c));
    };
    const selectedConflictEvent = useSelector(
        (state) => state.conflict.selectedConflictEvent
    );
    const getFFIcon = (name) => {
        switch (name) {
            case "Airstrike/Bombing":
                return GiJetFighter;
            case "Firefight/Shooting":
                return GiMachineGunMagazine;
            case "Leader Announcement":
                return GiPublicSpeaker;
            case "Artillery":
                return GiArtilleryShell;
            case "Explosion":
                return GiMushroomCloud;
        }
        return null;
    };
    useEffect(() => {
        console.log(c, selectedConflictEvent);
    }, [c, selectedConflictEvent]);

    const user = useSelector((state) => state.account.user);
    const handleCommentClick = () => {
        if (user) {
            dispatch(setSideBarState("COMMENT"));
        } else {
            dispatch(toggleShowSignIn());
        }
    };
    const handleReportClick = () => {
        if (user) {
            // dispatch(setSideBarState("COMMENT"));
        } else {
            dispatch(toggleShowSignIn());
        }
    };
    const handleUpvote = () => {
        if (user) {
            // dispatch(setSideBarState("COMMENT"));
        } else {
            dispatch(toggleShowSignIn());
        }
    };
    const handleDownvote = () => {
        if (user) {
            // dispatch(setSideBarState("COMMENT"));
        } else {
            dispatch(toggleShowSignIn());
        }
    };
    return (
        <Box
            shadow={"sm"}
            _hover={{ shadow: "md", bg: "whiteAlpha.100" }}
            w={"full"}
            bg={
                selectedConflictEvent &&
                selectedConflictEvent.id === c.id &&
                "whiteAlpha.50"
            }
            borderLeft={
                selectedConflictEvent &&
                selectedConflictEvent.id === c.id &&
                "6px solid rgba(255,255,255,.8)"
            }
            p={4}
            py={2}
            onClick={handleClick}
            borderBottom={"1px solid rgba(255,255,255,.05)"}
            cursor={"pointer"}
        >
            <VStack w={"full"}>
                <HStack spacing={4} w={"full"}>
                    <Center
                        boxSize={"40px"}
                        w={"40px"}
                        bg={"red.600"}
                        borderRadius={"5px"}
                    >
                        {c.conflictEventType && (
                            <Icon
                                as={getFFIcon(c.conflictEventType.name)}
                                color={"whiteAlpha.900"}
                                boxSize={"28px"}
                            />
                        )}
                    </Center>
                    <VStack
                        w={"full"}
                        alignItems={"flex-start"}
                        flex={1}
                        spacing={1}
                    >
                        <Heading size={"sm"} color={"white"} noOfLines={1}>
                            {c.title}
                        </Heading>

                        <Text fontSize={"xs"} color={"gray.400"} noOfLines={1}>
                            {c.description}
                        </Text>
                    </VStack>
                    <VStack spacing={0}>
                        <IconButton
                            variant={"ghost"}
                            color={"whiteAlpha.500"}
                            onClick={handleUpvote}
                            icon={
                                <Icon
                                    boxSize={"24px"}
                                    as={
                                        isUpvoted && isUpvoted === true
                                            ? PiArrowCircleUpFill
                                            : PiArrowCircleUp
                                    }
                                />
                            }
                            borderBottomRadius={0}
                            _hover={{
                                bg: "whiteAlpha.100",
                                color: "whiteAlpha.900",
                            }}
                        />
                        <IconButton
                            variant={"ghost"}
                            color={"whiteAlpha.500"}
                            onClick={handleDownvote}
                            icon={
                                <Icon
                                    boxSize={"24px"}
                                    as={
                                        isUpvoted && isUpvoted === false
                                            ? PiArrowCircleDownFill
                                            : PiArrowCircleDown
                                    }
                                />
                            }
                            borderTopRadius={0}
                            _hover={{
                                bg: "whiteAlpha.100",
                                color: "whiteAlpha.900",
                            }}
                        />
                    </VStack>
                </HStack>
            </VStack>
            <Collapse
                in={selectedConflictEvent && selectedConflictEvent.id === c.id}
            >
                <Box w={"full"} alignItems={"flex-start"} mb={2}>
                    <HStack alignItems={"center"} spacing={1} mb={2}>
                        <Icon
                            as={MdDoneAll}
                            color={"whiteAlpha.700"}
                            boxSize={"12px"}
                        />
                        <Text fontSize={12} color={"whiteAlpha.700"}>
                            Authenticity Score
                        </Text>
                    </HStack>
                    <Progress
                        borderRadius={5}
                        size={"sm"}
                        w={"full"}
                        colorScheme={"whiteAlpha"}
                        value={30}
                        backgroundColor={"whiteAlpha.100"}
                    />
                </Box>

                <HStack my={1} spacing={0}>
                    <Button
                        flex={1}
                        onClick={handleCommentClick}
                        size={"sm"}
                        variant={"ghost"}
                        color={"whiteAlpha.500"}
                        _hover={{ bg: "whiteAlpha.100", color: "white" }}
                        borderRightRadius={0}
                    >
                        Comment
                    </Button>
                    <Button
                        borderLeftRadius={0}
                        flex={1}
                        size={"sm"}
                        variant={"ghost"}
                        color={"whiteAlpha.500"}
                        _hover={{ bg: "whiteAlpha.100", color: "white" }}
                        borderRadius={0}
                        onClick={handleReportClick}
                    >
                        Report
                    </Button>
                    <IconButton
                        borderLeftRadius={0}
                        size={"sm"}
                        variant={"ghost"}
                        color={"whiteAlpha.500"}
                        _hover={{ bg: "whiteAlpha.100", color: "white" }}
                        icon={<Icon as={MdMoreVert} />}
                    >
                        Report
                    </IconButton>
                </HStack>
            </Collapse>
        </Box>
    );
};
