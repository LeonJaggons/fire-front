import Head from "next/head";

import Map from "../components/Map/Map";

const DEFAULT_CENTER = [38.907132, -77.036546];

export default function Home() {
    return (
        <>
            <Head>
                <title>Next.js Leaflet Starter</title>
                <meta
                    name="description"
                    content="Create mapping apps with Next.js Leaflet Starter"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Map
                style={{ width: "100%", height: "100%" }}
                center={DEFAULT_CENTER}
                zoom={12}
            >
                {({ TileLayer, Marker, Popup }) => (
                    <>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={DEFAULT_CENTER}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </>
                )}
            </Map>
        </>
    );
}
