import Head from "next/head";

import { ConflictMap } from "../components/ConflictMap";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@chakra-ui/alert";
import { Collapse } from "@chakra-ui/transition";
import { HStack, Text } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import {
    MdArrowUpward,
    MdCampaign,
    MdOutlineArrowDownward,
    MdOutlineArrowUpward,
} from "react-icons/md";
import { Button } from "@chakra-ui/button";
import { toggleClickToReportMode } from "src/redux/slices/conflictSlice";
import { Tag } from "@chakra-ui/tag";
import { ConflictList } from "../components/ConflictList";

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
                <ConflictList />
            </HStack>
        </>
    );
}

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
