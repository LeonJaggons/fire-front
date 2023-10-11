import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

export const ConflictMap = ({ conflictEventData }) => {
    const [selectedEvent, setSelectedEvent] = React.useState();
    return (
        <MapContainer
            center={[0, 0]}
            zoom={8}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.{ext}"
                maxZoom={20}
                minZoom={0}
                ext={"png"}
            />
        </MapContainer>
    );
};
