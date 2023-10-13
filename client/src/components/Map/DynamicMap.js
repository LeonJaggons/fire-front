import { useEffect } from "react";
import Leaflet from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import {
    setReportLocation,
    toggleClickToReportMode,
} from "src/redux/slices/conflictSlice";

const { MapContainer } = ReactLeaflet;

const Map = ({ children, className, width, height, ...rest }) => {
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
    return (
        <MapContainer {...rest}>
            {children(ReactLeaflet, Leaflet)}
            <LocationFinder />
        </MapContainer>
    );
};

export default Map;
