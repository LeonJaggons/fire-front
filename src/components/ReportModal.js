import {
    Box,
    Button,
    Center,
    Divider,
    HStack,
    Heading,
    Icon,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Select,
    SimpleGrid,
    Text,
    Textarea,
    VStack,
    Image,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
    clearNewConflict,
    setReportLocation,
    updateNewConflictEventDescription,
    updateNewConflictEventSource,
    updateNewConflictEventTitle,
    updateNewConflictEventTypeId,
} from "src/redux/slices/conflictSlice";
import { publishConflictEvent } from "src/services/conflictService";
import DatePicker from "react-datepicker";
import moment from "moment";
import {
    MdAddAPhoto,
    MdPhone,
    MdPhoto,
    MdPhotoAlbum,
    MdUpload,
    MdUploadFile,
} from "react-icons/md";

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
            <ModalContent borderRadius={0}>
                <ModalBody p={0}>
                    <ReportForm />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const ReportForm = () => {
    const [loading, setLoading] = useState(false);
    const [uploadImages, setUploadImages] = useState([]);
    const [date, setDate] = useState(new Date());

    const handlePostReport = async () => {
        setLoading(true);

        await publishConflictEvent(date, uploadImages);
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
            </Box>
            <VStack
                overflowY={"scroll"}
                maxH={"60vh"}
                w={"full"}
                alignItems={"flex-start"}
                spacing={4}
                p={6}
            >
                <ConflictImageUpload setUploadImages={setUploadImages} />
                <HStack w="full">
                    <Box flex={1}>
                        <Text>Date</Text>
                        <HStack spacing={0} h={"40px"}>
                            <Input
                                w={"180px"}
                                as={DatePicker}
                                selected={date}
                                onChange={(d) => {
                                    if (
                                        moment(d).isSameOrBefore(
                                            moment(),
                                            "day"
                                        )
                                    )
                                        setDate(d);
                                    else setDate(new Date());
                                }}
                                style={{ width: "100%" }}
                                dateFormat={"MMMM d, yyyy"}
                            />
                        </HStack>
                    </Box>
                </HStack>
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
const ConflictImageUpload = ({ setUploadImages }) => {
    const inputRef = useRef();
    const [images, setImages] = useState([]);

    const handleChange = (e) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map((f) => {
                return {
                    name: f.name,
                    url: URL.createObjectURL(f),
                };
            });
            setImages([...images, ...newImages]);
        }
    };
    useEffect(() => {
        setUploadImages(images);
    }, [images]);
    return (
        <>
            <SimpleGrid columns={3} spacing={1}>
                {images?.map((img) => (
                    <Image src={img.url} borderRadius={5} />
                ))}
                <Button
                    p={4}
                    bg={"gray.100"}
                    h={"full"}
                    onClick={() => inputRef?.current?.click()}
                    fontWeight={400}
                >
                    <VStack>
                        <Icon as={MdAddAPhoto} boxSize={"30px"} />
                        <Text fontSize={14} color={"blackAlpha.700"}>
                            Upload images...
                        </Text>
                    </VStack>
                </Button>
            </SimpleGrid>
            <Input
                ref={inputRef}
                onChange={handleChange}
                type={"file"}
                display={"none"}
            />
        </>
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
    useEffect(() => {
        dispatch(updateNewConflictEventTypeId(conflictEventTypes[0].id));
    }, [conflictEventTypes]);
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
