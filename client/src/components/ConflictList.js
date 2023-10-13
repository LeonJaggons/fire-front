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
    MdComment,
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
import { setSelectedConflictEvent } from "src/redux/slices/conflictSlice";
import {
    GiJetFighter,
    GiMachineGun,
    GiMachineGunMagazine,
    GiPublicSpeaker,
} from "react-icons/gi";
import { Collapse } from "@chakra-ui/transition";

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
            minW={"23vw"}
            bg={"rgb(17,19,21)"}
            spacing={0}
        >
            <Box
                p={4}
                bg={false ? "red.500" : "whiteAlpha.200"}
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
        }
        return null;
    };
    useEffect(() => {
        console.log(c, selectedConflictEvent);
    }, [c, selectedConflictEvent]);
    return (
        <Box
            shadow={"sm"}
            _hover={{ shadow: "md", bg: "whiteAlpha.50" }}
            w={"full"}
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
                        <Icon
                            as={getFFIcon(c.conflictEventType.name)}
                            color={"whiteAlpha.900"}
                            boxSize={"28px"}
                        />
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

                        <Text fontSize={"sm"} color={"gray.400"} noOfLines={1}>
                            {c.description}
                        </Text>
                    </VStack>
                    <VStack spacing={0}>
                        <IconButton
                            variant={"ghost"}
                            color={"whiteAlpha.500"}
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
                <Divider my={2} borderColor={"whiteAlpha.200"} />
                <HStack mb={1} spacing={0}>
                    <Button
                        flex={1}
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
