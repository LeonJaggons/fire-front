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
    MdClose,
    MdComment,
    MdDoneAll,
    MdLink,
    MdMoreVert,
    MdShare,
    MdSource,
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
    GiArtilleryShell,
    GiGunshot,
    GiJetFighter,
    GiMilitaryAmbulance,
    GiMushroomCloud,
    GiPublicSpeaker,
} from "react-icons/gi";
import { Collapse } from "@chakra-ui/transition";
import { Progress } from "@chakra-ui/progress";
import { toggleShowSignIn } from "src/redux/slices/accountSlice";
import {
    downvote,
    loadConflictEventComments,
    resetDownvote,
    resetUpvote,
    upvote,
} from "src/services/conflictService";
import {
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

export const ConflictList = () => {
    const clickToReportMode = useSelector(
        (state) => state.conflict.clickToReportMode
    );
    const conflictEvents = useSelector(
        (state) => state.conflict.conflictEvents
    );
    return (
        <Box
            // bg={"black"}
            alignItems={"flex-start"}
            w={"full"}
            spacing={0}
        >
            {conflictEvents?.map((c) => (
                <ConflictEvent c={c} />
            ))}
        </Box>
    );
};
const ConflictEvent = ({ c }) => {
    const [currImage, setCurrImage] = useState(0);
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
    function decimalToDMS(decimal) {
        const degrees = Math.floor(decimal);
        const minutesDecimal = (decimal - degrees) * 60;
        const minutes = Math.floor(minutesDecimal);
        const seconds = (minutesDecimal - minutes) * 60;

        return `${degrees}° ${minutes}' ${seconds.toFixed(2)}"`;
    }
    const closeMore = () => {
        setMoreOpen(false);
        setCurrImage(0);
    };
    return (
        <>
            <Box
                shadow={"sm"}
                _hover={{ shadow: "md", bg: "whiteAlpha.100" }}
                w={"380px"}
                overflowX={"hidden"}
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
                <VStack w={"full"} mb={1} alignItems={"flex-start"}>
                    <HStack spacing={3} w={"full"} justify={"space-between"}>
                        <HStack>
                            <Center
                                boxSize={"32px"}
                                bg={"red.600"}
                                rounded={"full"}
                            >
                                {c.conflictEventType && (
                                    <Icon
                                        as={getFFIcon(c.conflictEventType.name)}
                                        color={"whiteAlpha.900"}
                                        boxSize={"18px"}
                                    />
                                )}
                            </Center>
                            <Box>
                                <Text
                                    color={"whiteAlpha.500"}
                                    fontSize={"12px"}
                                    noOfLines={1}
                                >
                                    {c.createdDate &&
                                        timeSince(c.createdDate.toDate())}
                                </Text>
                                <HStack>
                                    <Text
                                        color={"whiteAlpha.800"}
                                        fontSize={"12px"}
                                        noOfLines={1}
                                    >
                                        {decimalToDMS(c.latitude)}N
                                    </Text>

                                    <Text
                                        color={"whiteAlpha.800"}
                                        fontSize={"12px"}
                                        noOfLines={1}
                                    >
                                        {decimalToDMS(c.longitude)}E
                                    </Text>
                                </HStack>
                            </Box>
                        </HStack>
                    </HStack>
                    <Heading size={"sm"} color={"white"} noOfLines={1} mt={2}>
                        {c.title}
                    </Heading>
                    {/* <Text
                        fontSize={"sm"}
                        mt={2}
                        color={"gray.200"}
                        noOfLines={1}
                    >
                        {c.description}
                    </Text> */}
                    {c.imgs && (
                        <Image
                            src={c.imgs[0]}
                            borderRadius={3}
                            h={"200px"}
                            w={"full"}
                            objectFit={"cover"}
                        />
                    )}
                </VStack>
                <Collapse
                    in={
                        selectedConflictEvent &&
                        selectedConflictEvent.id === c.id
                    }
                >
                    <HStack align={"center"}>
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

                            <HStack mt={2} spacing={0}>
                                <Button
                                    flex={1}
                                    onClick={handleCommentClick}
                                    size={"sm"}
                                    fontSize={11}
                                    variant={"ghost"}
                                    color={"whiteAlpha.500"}
                                    _hover={{
                                        bg: "whiteAlpha.100",
                                        color: "white",
                                    }}
                                    leftIcon={<Icon as={MdShare} />}
                                    borderRightRadius={0}
                                >
                                    Source
                                </Button>
                                <Button
                                    flex={1}
                                    onClick={handleCommentClick}
                                    size={"sm"}
                                    fontSize={11}
                                    variant={"ghost"}
                                    color={"whiteAlpha.500"}
                                    _hover={{
                                        bg: "whiteAlpha.100",
                                        color: "white",
                                    }}
                                    borderRadius={0}
                                >
                                    Comment{" "}
                                    {user && `(${selectedComments?.length})`}
                                </Button>
                                <Button
                                    borderLeftRadius={0}
                                    flex={1}
                                    size={"sm"}
                                    variant={"ghost"}
                                    fontSize={11}
                                    color={"whiteAlpha.500"}
                                    _hover={{
                                        bg: "whiteAlpha.100",
                                        color: "white",
                                    }}
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
                                    _hover={{
                                        bg: "whiteAlpha.100",
                                        color: "white",
                                    }}
                                    icon={<Icon as={MdMoreVert} />}
                                >
                                    Report
                                </IconButton>
                            </HStack>
                        </Box>

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
                </Collapse>
            </Box>
            <Modal
                isOpen={moreOpen}
                onClose={closeMore}
                size={"3xl"}
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
                        <HStack justify={"space-between"}>
                            <HStack>
                                <Icon
                                    mr={2}
                                    boxSize={"36px"}
                                    as={getFFIcon(c.conflictEventType.name)}
                                />
                                <Box>
                                    <Text
                                        color={"whiteAlpha.700"}
                                        fontSize={14}
                                    >
                                        {c.createdDate &&
                                            timeSince(c.createdDate.toDate())}
                                    </Text>
                                    <Heading fontSize={"26px"}>
                                        {c.title}
                                    </Heading>
                                </Box>
                            </HStack>
                            <IconButton
                                variant={"link"}
                                color={"whiteAlpha.700"}
                                icon={<Icon as={MdClose} boxSize={"28px"} />}
                                _hover={{ color: "white" }}
                                onClick={closeMore}
                            />
                        </HStack>
                    </Box>

                    {c.imgs && (
                        <Box w={"full"} position={"relative"} h={"400px"}>
                            <Image
                                src={c.imgs[currImage]}
                                h={"full"}
                                w={"full"}
                                objectFit={"cover"}
                            />

                            <HStack
                                width={"full"}
                                position={"absolute"}
                                bottom={2}
                                alignSelf={"center"}
                                justify={"center"}
                            >
                                <HStack
                                    bg={"blackAlpha.600"}
                                    p={2}
                                    borderRadius={5}
                                >
                                    {c.imgs?.map((img, i) => (
                                        <Image
                                            borderWidth={
                                                i === currImage ? 4 : 0
                                            }
                                            onMouseDown={() => setCurrImage(i)}
                                            borderColor={"red.500"}
                                            borderStyle={"solid"}
                                            borderRadius={5}
                                            src={img}
                                            aspectRatio={1}
                                            h={"80px"}
                                            objectFit={"cover"}
                                        />
                                    ))}
                                </HStack>
                            </HStack>
                        </Box>
                    )}
                    <ModalBody p={6} borderRadius={0}>
                        <Box>
                            <VStack spacing={4} alignItems={"start"}>
                                <Box>
                                    <Link target="_blank" href={c.source}>
                                        <Button
                                            h={"auto"}
                                            p={4}
                                            variant={"ghost"}
                                        >
                                            <Box>
                                                <Image
                                                    maxH={"40px"}
                                                    h={"40px"}
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
