import { useEffect } from "react";
import Leaflet from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import {
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
        const map = ReactLeaflet.useMap();
        useEffect(() => {
            console.log(selectedConflictEvent);
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
    const ConflictMarker = ({ ce }) => {
        const dispatch = useDispatch();
        ReactLeaflet.useMapEvents({
            click(e) {
                const conflictEvent = find(
                    conflictEvents,
                    (o) =>
                        o.latitude === ce.latitude &&
                        o.longitude === ce.longitude
                );
                dispatch(setSelectedConflictEvent(conflictEvent));
            },
        });
        return (
            <ReactLeaflet.Marker
                // icon={getMarkerIcon(ce.conflictEventType.name)}
                position={[ce.latitude, ce.longitude]}
            ></ReactLeaflet.Marker>
        );
    };
    return (
        <MapContainer {...rest}>
            {children(ReactLeaflet, Leaflet)}
            <LocationFinder />
            <FlyToConflict />
            {conflictEvents?.map((ce) => (
                <ConflictMarker ce={ce} />
            ))}
        </MapContainer>
    );
};

export default Map;
