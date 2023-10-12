import React from "react";
import {
    Box,
    Button,
    HStack,
    Heading,
    Icon,
    Link,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
} from "@chakra-ui/react";
import { UserAvatar } from "./UserAvatar";
import {
    MdLocalAirport,
    MdLocalFireDepartment,
    MdSafetyCheck,
} from "react-icons/md";

export const FireFrontHeader = () => {
    return (
        <HStack
            justify={"space-between"}
            p={4}
            py={2}
            borderBottom={"1px solid rgba(0,0,0,.1)"}
            zIndex={999}
            shadow={"md"}
        >
            <FireFrontLogo />
            <FireFrontMenu />
        </HStack>
    );
};

const FireFrontLogo = () => {
    return (
        <Button variant={"link"} color={"black"}>
            <HStack spacing={1}>
                <Icon as={MdSafetyCheck} boxSize={"22px"} />
                <Heading
                    m={0}
                    letterSpacing={-0.5}
                    fontSize={22}
                    fontWeight={700}
                >
                    FireFront
                </Heading>
            </HStack>
        </Button>
    );
};
const FireFrontMenu = () => {
    return (
        <HStack spacing={4}>
            <ConflictSelect />
            <FireFrontMenuItem>About</FireFrontMenuItem>
            <UserAvatar />
        </HStack>
    );
};

const FireFrontMenuItem = ({ children }) => {
    return (
        <Button variant={"ghost"} fontSize={14} colorScheme={"messenger"}>
            {children}
        </Button>
    );
};
const ConflictSelect = () => {
    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    variant={"ghost"}
                    colorScheme={"messenger"}
                    fontSize={14}
                >
                    Conflicts
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverBody></PopoverBody>
            </PopoverContent>
        </Popover>
    );
};
