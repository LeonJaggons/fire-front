import Map from "./Map/Map";
import { DEFAULT_CENTER } from "../pages";
import { useSelector } from "react-redux";
import { Center } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useEffect } from "react";
import { ReportModal } from "./ReportModal";

export const ConflictMap = () => {
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

    useEffect(() => {
        console.log(conflictEvents);
    }, [conflictEvents]);
    return selectedConflict && selectedConflict.name ? (
        <>
            <ReportModal />
            <Map
                key={JSON.stringify([
                    selectedConflict.latitude,
                    selectedConflict.longitude,
                ])}
                style={{ width: "100%", height: "100%" }}
                center={[selectedConflict.latitude, selectedConflict.longitude]}
                zoom={selectedConflict.defaultZoom}
                onClick={(e) => console.log(e)}
            >
                {({ TileLayer, Marker, Popup }) => (
                    <>
                        <TileLayer
                            url={providerURL}
                            attribution={providerAttr}
                            ext={"png"}
                        />
                        {conflictEvents?.map((ce) => (
                            <Marker
                                position={[ce.latitude, ce.longitude]}
                            ></Marker>
                        ))}
                    </>
                )}
            </Map>
        </>
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
