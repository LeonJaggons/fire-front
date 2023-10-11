"use client";
import { FireFrontHeader } from "@/components/app/FireFrontHeader";
import "@/styles/globals.css";
import { ChakraProvider, Box } from "@chakra-ui/react";

export default function App({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <Box id={"app-container"}>
                <FireFrontHeader />
                <Box flex={1} h={"full"}>
                    <Component {...pageProps} />
                </Box>
            </Box>
        </ChakraProvider>
    );
}
