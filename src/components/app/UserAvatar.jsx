import React from "react";
import {
    Avatar,
    Button,
    HStack,
    Input,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
} from "@chakra-ui/react";

export const UserAvatar = () => {
    return (
        <Popover>
            <PopoverTrigger>
                <Button variant={"ghost"} colorScheme={"messenger"}>
                    <Text fontSize={14}>Sign In</Text>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverBody p={0}>
                    <Tabs isFitted variant={"line"}>
                        <TabList>
                            <Tab>Sign In</Tab>
                            <Tab>Sign Up</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <SignInForm />
                            </TabPanel>
                            <TabPanel>
                                <SignUpForm />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};
const SignInForm = () => {
    return (
        <VStack w={"full"}>
            <Input placeholder={"Email"} />
            <Input placeholder={"Password"} />
            <Button variant={"ghost"} colorScheme={"messenger"} w={"full"}>
                Sign In
            </Button>
        </VStack>
    );
};
const SignUpForm = () => {
    return (
        <VStack w={"full"}>
            <HStack>
                <Input placeholder={"First Name"} />
                <Input placeholder={"Last Name"} />
            </HStack>
            <Input placeholder={"Email"} />
            <Input placeholder={"Password"} />
            <Input placeholder={"Confirm Password"} />
            <Button
                justifyContent={"start"}
                w={"full"}
                variant={"outline"}
                color={"gray.500"}
                fontWeight={400}
            >
                Allow Location Services
            </Button>
            <Button variant={"ghost"} colorScheme={"messenger"} w={"full"}>
                Sign Up
            </Button>
        </VStack>
    );
};
