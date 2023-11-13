import { useEffect } from "react";
import Leaflet from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import {
    setMapSearching,
    setReportLocation,
    setSelectedConflictEvent,
    toggleClickToReportMode,
} from "src/redux/slices/conflictSlice";
import { find } from "lodash";

const { MapContainer } = ReactLeaflet;

const Map = ({ children, className, width, height, ...rest }) => {
    const conflictEvents = useSelector(
        (state) => state.conflict.conflictEvents
    );
    const dispatch = useDispatch();
    if (className) {
        mapClassName = `${mapClassName} ${className}`;
    }

    useEffect(() => {
        (async function init() {
            delete Leaflet.Icon.Default.prototype._getIconUrl;
            Leaflet.Icon.Default.mergeOptions({
                iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
                iconUrl: "leaflet/images/marker-icon.png",
                shadowUrl: "leaflet/images/marker-shadow.png",
            });
        })();
    }, []);
    ``;
    const clickToReportMode = useSelector(
        (state) => state.conflict.clickToReportMode
    );
    const LocationFinder = () => {
        const _ = ReactLeaflet.useMapEvents({
            click(e) {
                if (clickToReportMode) {
                    dispatch(setReportLocation([e.latlng.lat, e.latlng.lng]));
                    dispatch(toggleClickToReportMode());
                }
            },
        });
    };

    const FlyToConflict = () => {
        const selectedConflictEvent = useSelector(
            (state) => state.conflict.selectedConflictEvent
        );
        const reportLocation = useSelector(
            (state) => state.conflict.reportLocation
        );
        const map = ReactLeaflet.useMap();
        useEffect(() => {
            !reportLocation &&
                selectedConflictEvent &&
                map &&
                map.flyTo(
                    [
                        selectedConflictEvent.latitude,
                        selectedConflictEvent.longitude,
                    ],
                    14
                );
        }, [selectedConflictEvent]);
        return null;
    };

    const ReportMarker = () => {
        const map = ReactLeaflet.useMap();
        const selectedConflict = useSelector(
            (state) => state.conflict.selectedConflict
        );
        const reportLocation = useSelector(
            (state) => state.conflict.reportLocation
        );
        useEffect(() => {
            if (reportLocation && map) {
                map.flyTo(reportLocation, 13);
            } else {
                map.flyTo(
                    [selectedConflict.latitude, selectedConflict.longitude],
                    selectedConflict.defaultZoom
                );
            }
        }, [reportLocation]);
        return (
            reportLocation && <ReactLeaflet.Marker position={reportLocation} />
        );
    };
    const ConflictMarker = ({ ce }) => {
        const dispatch = useDispatch();
        const map = ReactLeaflet.useMap();
        // ReactLeaflet.useMapEvents({
        //     click(e) {
        //     },
        // });
        return (
            <ReactLeaflet.Marker
                // icon={getMarkerIcon(ce.conflictEventType.name)}
                position={[ce.latitude, ce.longitude]}
                eventHandlers={{
                    click: (e) => {
                        dispatch(setMapSearching());
                        dispatch(setSelectedConflictEvent(ce));
                    },
                }}
            ></ReactLeaflet.Marker>
        );
    };

    const ResetMap = () => {
        const dispatch = useDispatch();
        const mapMode = useSelector((state) => state.conflict.mapMode);
        const selectedConflict = useSelector(
            (state) => state.conflict.selectedConflict
        );
        const map = ReactLeaflet.useMap();
        useEffect(() => {
            if (mapMode === "RESET") {
                map.flyTo(
                    [selectedConflict.latitude, selectedConflict.longitude],
                    selectedConflict.defaultZoom
                );
                dispatch(setMapSearching());
            }
        }, [mapMode]);
        return null;
    };
    return (
        <MapContainer {...rest}>
            {children(ReactLeaflet, Leaflet)}
            <LocationFinder />
            <FlyToConflict />
            {conflictEvents?.map((ce) => (
                <ConflictMarker ce={ce} />
            ))}
            <ReportMarker />
            <ResetMap />
        </MapContainer>
    );
};

export default Map;
