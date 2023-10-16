import {
    Box,
    Button,
    Divider,
    HStack,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Select,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    clearNewConflict,
    setReportLocation,
    updateNewConflictEventDescription,
    updateNewConflictEventSource,
    updateNewConflictEventTitle,
    updateNewConflictEventTypeId,
} from "src/redux/slices/conflictSlice";
import { publishConflictEvent } from "src/services/conflictService";

export const ReportModal = () => {
    const dispatch = useDispatch();
    const reportLocation = useSelector(
        (state) => state.conflict.reportLocation
    );
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        dispatch(setReportLocation(null));
    };

    useEffect(() => {
        setIsOpen(reportLocation != null);
        reportLocation == null && dispatch(clearNewConflict());
    }, [reportLocation]);

    return (
        <Modal size={"xl"} isOpen={isOpen} onClose={handleClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalBody p={0}>
                    <ReportForm />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const ReportForm = () => {
    const [loading, setLoading] = useState(false);

    const handlePostReport = async () => {
        setLoading(true);

        await publishConflictEvent();
        setLoading(false);
    };
    return (
        <Box>
            <Box
                p={6}
                py={4}
                borderBottom={"1px solid rgba(0,0,0,.2)"}
                bg={"black"}
            >
                <Heading size={"lg"} color={"white"}>
                    Report an Event
                </Heading>
                <Text color={"white"} fontSize={"14px"}>
                    Omnis aut tempora dicta. Ea at enim fugiat vero id rem.
                </Text>
            </Box>
            <VStack w={"full"} alignItems={"flex-start"} spacing={4} p={6}>
                <ConflictEventTypeSelect />
                <ConflictLocationDisplay />
                <ReportFormInput label={"Title"} />
                <ReportFormInput label={"Description"} textarea />
                <ReportFormInput label={"Source"} />
            </VStack>
            <Box p={6} borderTop={"1px solid rgba(0,0,0,.2)"}>
                <Button
                    w={"full"}
                    bg={"black"}
                    colorScheme="blackAlpha"
                    size={"lg"}
                    onClick={handlePostReport}
                    isLoading={loading}
                >
                    Submit for Approval
                </Button>
            </Box>
        </Box>
    );
};
const ConflictEventTypeSelect = () => {
    const conflictEventTypes = useSelector(
        (state) => state.conflict.conflictEventTypes
    );
    const dispatch = useDispatch();
    const handleChange = (e) => {
        dispatch(updateNewConflictEventTypeId(e.target.value));
    };
    return (
        <VStack w={"full"} alignItems={"flex-start"} spacing={1}>
            <Text>Event Type</Text>
            <Select onChange={handleChange}>
                {conflictEventTypes?.map((cet) => (
                    <option value={cet.id}>{cet.name}</option>
                ))}
            </Select>
        </VStack>
    );
};
const ConflictLocationDisplay = () => {
    const reportLocation = useSelector(
        (state) => state.conflict.reportLocation
    );
    return (
        reportLocation && (
            <HStack w={"full"}>
                <VStack flex={1} alignItems={"flex-start"} spacing={1}>
                    <Text>Latitude</Text>
                    <Input value={reportLocation[0]} readOnly bg={"gray.200"} />
                </VStack>
                <VStack flex={1} alignItems={"flex-start"} spacing={1}>
                    <Text>Longitude</Text>
                    <Input value={reportLocation[1]} bg={"gray.200"} />
                </VStack>
            </HStack>
        )
    );
};
const ReportFormInput = ({ label, textarea }) => {
    const dispatch = useDispatch();
    const handleChange = (e) => {
        switch (label) {
            case "Title":
                dispatch(updateNewConflictEventTitle(e.target.value));
                break;
            case "Description":
                dispatch(updateNewConflictEventDescription(e.target.value));
                break;
            case "Source":
                dispatch(updateNewConflictEventSource(e.target.value));
                break;
        }
    };
    return (
        <VStack w={"full"} alignItems={"flex-start"} spacing={1}>
            <Text>{label}</Text>
            {textarea ? (
                <Textarea onChange={handleChange} />
            ) : (
                <Input onChange={handleChange} />
            )}
        </VStack>
    );
};
