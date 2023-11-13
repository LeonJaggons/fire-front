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
    setMapSearching,
    setSelectedConflictEvent,
    setSideBarState,
} from "src/redux/slices/conflictSlice";
import {
    GiAk47,
    GiArtilleryShell,
    GiGunshot,
    GiJetFighter,
    GiMachineGun,
    GiMachineGunMagazine,
    GiMilitaryAmbulance,
    GiMushroomCloud,
    GiPublicSpeaker,
} from "react-icons/gi";
import { Collapse } from "@chakra-ui/transition";
import moment from "moment/moment";
import { Progress } from "@chakra-ui/progress";
import { toggleShowSignIn } from "src/redux/slices/accountSlice";
import {
    downvote,
    loadConflictEventComments,
    resetDownvote,
    resetUpvote,
    upvote,
} from "src/services/conflictService";
import { times, update } from "lodash";
import {
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
} from "@chakra-ui/react";
import Iframe from "react-iframe";
import { Link } from "@chakra-ui/next-js";

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
    const [moreOpen, setMoreOpen] = useState(false);
    const user = useSelector((state) => state.account.user);
    const [isUpvoted, setIsUpvoted] = useState();
    const [isDownvoted, setIsDownvoted] = useState();
    const [authScore, setAuthScore] = useState();
    const dispatch = useDispatch();
    const selectedConflictEvent = useSelector(
        (state) => state.conflict.selectedConflictEvent
    );
    const handleClick = () => {
        if (selectedConflictEvent && c.id === selectedConflictEvent.id) {
            setMoreOpen(true);
        } else {
            setMoreOpen(false);
            dispatch(setSelectedConflictEvent(c));
            dispatch(setMapSearching());
        }
    };

    useEffect(() => {
        if (!user) {
            setIsUpvoted(null);
        } else {
            setIsUpvoted(user.upvoted && user.upvoted.includes(c.id));
            setIsDownvoted(user.downvoted && user.downvoted.includes(c.id));
        }
    }, [user]);

    const getFFIcon = (name) => {
        switch (name) {
            case "Airstrike/Bombing":
                return GiJetFighter;
            case "Firefight/Shooting":
                return GiGunshot;
            case "Leader Announcement":
                return GiPublicSpeaker;
            case "Artillery":
                return GiArtilleryShell;
            case "Explosion":
                return GiMushroomCloud;
            case "Humanitarian Aid":
                return GiMilitaryAmbulance;
        }
        return null;
    };

    const updateAuthScore = () => {
        const upvoteCount = c.upvotes;
        const total = c.upvotes + c.downvotes;
        setAuthScore((upvoteCount / total) * 100);
    };

    useEffect(() => {
        user && selectedConflictEvent && loadConflictEventComments();
        c && updateAuthScore();
    }, [c, user, selectedConflictEvent]);

    const handleCommentClick = (e) => {
        if (user) {
            dispatch(setSideBarState("COMMENT"));
        } else {
            dispatch(toggleShowSignIn());
        }
        e.stopPropagation();
    };

    const handleReportClick = (e) => {
        if (user) {
            // dispatch(setSideBarState("COMMENT"));
        } else {
            dispatch(toggleShowSignIn());
        }
        e.stopPropagation();
    };

    const handleUpvote = async (e) => {
        e.stopPropagation();
        if (user) {
            if (!isUpvoted) {
                await upvote();
                setIsUpvoted(true);
            } else {
                if (isUpvoted) {
                    await resetUpvote();
                    setIsUpvoted(null);
                }
            }
            if (isDownvoted) {
                resetDownvote();
                setIsDownvoted(null);
            }
            // dispatch(setSideBarState("COMMENT"));
        } else {
            dispatch(toggleShowSignIn());
        }
    };

    const handleDownvote = async (e) => {
        e.stopPropagation();
        if (user) {
            if (!isDownvoted) {
                await downvote();
                setIsDownvoted(true);
            } else {
                if (isDownvoted) {
                    await resetDownvote();
                    setIsDownvoted(null);
                }
            }
            if (isUpvoted) {
                setIsUpvoted(null);
                resetUpvote();
            }
        } else {
            dispatch(toggleShowSignIn());
        }
    };

    const selectedComments = useSelector(
        (state) => state.conflict.selectedComments
    );

    function getRootDomain(url) {
        if (url == null || url.trim() === "") return "";

        const domain = new URL(url).hostname;
        const domainParts = domain.split(".").reverse();
        const rootDomain = domainParts[1] + "." + domainParts[0];
        return rootDomain;
    }

    function getImageFromSrc(source) {
        const root = getRootDomain(source);
        switch (root) {
            case "cnn.com":
                return "/cnn_logo.png";
            case "msnbc.com":
                return "/msnbc_logo.png";
            case "foxnews.com":
                return "/fox_logo.png";
        }
    }
    function timeSince(date) {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        };

        for (const [interval, secondsInInterval] of Object.entries(intervals)) {
            const intervalCount = Math.floor(seconds / secondsInInterval);

            if (intervalCount > 1) {
                return `${intervalCount} ${interval}s ago`;
            } else if (intervalCount === 1) {
                return `1 ${interval} ago`;
            }
        }

        return "Just now";
    }
    return (
        <>
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
                <VStack w={"full"} mb={2}>
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
                            <HStack>
                                <Heading
                                    size={"sm"}
                                    color={"white"}
                                    noOfLines={1}
                                >
                                    {c.title}
                                </Heading>
                            </HStack>
                            <Text
                                color={"gray.400"}
                                fontSize={"sm"}
                                noOfLines={1}
                            >
                                {c.createdDate &&
                                    timeSince(c.createdDate.toDate())}
                            </Text>
                        </VStack>
                        {user &&
                            selectedConflictEvent &&
                            selectedConflictEvent.id === c.id && (
                                <VStack spacing={0}>
                                    <IconButton
                                        variant={"ghost"}
                                        color={"whiteAlpha.500"}
                                        onClick={handleUpvote}
                                        icon={
                                            <Icon
                                                boxSize={"24px"}
                                                as={
                                                    isUpvoted &&
                                                    isUpvoted === true
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
                                                    isDownvoted &&
                                                    isDownvoted === true
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
                            )}
                    </HStack>
                    {/* <Text
                        fontSize={"sm"}
                        mt={2}
                        color={"gray.200"}
                        noOfLines={1}
                    >
                        {c.description}
                    </Text> */}
                </VStack>
                <Collapse
                    in={
                        selectedConflictEvent &&
                        selectedConflictEvent.id === c.id
                    }
                >
                    <Box w={"full"} alignItems={"flex-start"} mb={2} mt={2}>
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
                            value={authScore}
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
                            Comment {user && `(${selectedComments?.length})`}
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
            <Modal
                isOpen={moreOpen}
                onClose={() => setMoreOpen(false)}
                size={"2xl"}
                isCentered
            >
                <ModalOverlay />
                <ModalContent borderRadius={0}>
                    <Box
                        p={4}
                        px={6}
                        bg={"black"}
                        color={"whiteAlpha.900"}
                        w={"full"}
                    >
                        <HStack>
                            <Icon
                                mr={2}
                                boxSize={"36px"}
                                as={getFFIcon(c.conflictEventType.name)}
                            />
                            <Box>
                                <Heading fontSize={"26px"}>{c.title}</Heading>
                                <Text color={"whiteAlpha.700"}>
                                    {c.createdDate &&
                                        timeSince(c.createdDate.toDate())}
                                </Text>
                            </Box>
                        </HStack>
                    </Box>
                    <ModalBody p={6} borderRadius={0}>
                        <Box>
                            <VStack spacing={4} alignItems={"start"}>
                                <Box>
                                    <Link target="_blank" href={c.source}>
                                        <Button
                                            w={"25%"}
                                            h={"auto"}
                                            p={4}
                                            variant={"ghost"}
                                        >
                                            <Box>
                                                <Image
                                                    src={getImageFromSrc(
                                                        c.source
                                                    )}
                                                />
                                            </Box>
                                        </Button>
                                    </Link>
                                </Box>
                                <Box>
                                    <Heading size={"sm"} mb={1}>
                                        Description
                                    </Heading>
                                    <Text>{c.description}</Text>
                                </Box>
                            </VStack>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
