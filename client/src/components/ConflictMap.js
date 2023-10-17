import Map from "./Map/Map";
import { DEFAULT_CENTER } from "../pages";
import { useDispatch, useSelector } from "react-redux";
import { Center, Box, HStack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useEffect } from "react";
import { ReportModal } from "./ReportModal";
import ReactDOMServer from "react-dom/server";
import { MdAdd, MdLocationSearching, MdMemory, MdRemove } from "react-icons/md";
import { icons } from "react-icons";
import {
    GiJetFighter,
    GiMachineGunMagazine,
    GiPublicSpeaker,
} from "react-icons/gi";

import {
    setMapReset,
    setSelectedConflictEvent,
} from "src/redux/slices/conflictSlice";
import { Icon, IconButton } from "@chakra-ui/react";

export const ConflictMap = () => {
    const dispatch = useDispatch();
    const selectedConflict = useSelector(
        (state) => state.conflict.selectedConflict
    );

    const conflictEvents = useSelector(
        (state) => state.conflict.conflictEvents
    );

    const providerURL =
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}";
    const providerAttr =
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    useEffect(() => {}, [conflictEvents]);
    const getMarkerIcon = (ceName) => {
        let iconSvg;

        switch (ceName) {
            case "Airstrike/Bombing":
                iconSvg = GiJetFighter;
                break;
            case "Firefight/Shooting":
                iconSvg = GiMachineGunMagazine;
                break;
            case "Leader Announcement":
                iconSvg = GiPublicSpeaker;
                break;
        }

        return L.divIcon({
            html: ReactDOMServer.renderToString(iconSvg),
            iconSize: [30, 30],
        });
    };
    return selectedConflict && selectedConflict.name ? (
        <Box flex={1} h={"full"} pos={"relative"}>
            <ReportModal />
            <Map
                key={JSON.stringify([
                    selectedConflict.latitude,
                    selectedConflict.longitude,
                ])}
                style={{ width: "100%", height: "100%", zIndex: 1 }}
                center={[selectedConflict.latitude, selectedConflict.longitude]}
                zoom={selectedConflict.defaultZoom}
            >
                {({ TileLayer, Marker, Popup }) => (
                    <>
                        <TileLayer
                            url={providerURL}
                            attribution={providerAttr}
                            ext={"png"}
                        />
                    </>
                )}
            </Map>
            <HStack position={"absolute"} zIndex={999} bottom={2} left={2}>
                <IconButton
                    size={"sm"}
                    icon={<Icon as={MdLocationSearching} />}
                    onClick={() => dispatch(setMapReset())}
                />
            </HStack>
        </Box>
    ) : (
        <Loading />
    );
};

const Loading = () => {
    return (
        <Center w={"100%"} h={"100%"}>
            <Spinner />
        </Center>
    );
};
