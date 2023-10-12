import { Link } from "@chakra-ui/next-js";
import { Box, ChakraProvider, HStack, Heading } from "@chakra-ui/react";
import "@styles/globals.scss";
import NextLink from "next/link";

function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <AppContainer>
                <AppHeader />
                <AppContent>
                    <Component {...pageProps} />
                </AppContent>
            </AppContainer>
        </ChakraProvider>
    );
}

const AppContainer = ({ children }) => {
    return <Box id={"app-container"}>{children}</Box>;
};
const AppContent = ({ children }) => {
    return <Box id={"app-content"}>{children}</Box>;
};

const AppHeader = () => {
    return (
        <HStack id={"app-header"}>
            <Heading size={"md"}>Fire Front</Heading>
            <AppMenu />
        </HStack>
    );
};

const AppMenu = () => {
    return (
        <HStack id={"app-menu"} spacing={8}>
            <AppMenuItem>Map</AppMenuItem>
            <AppMenuItem>Conflict</AppMenuItem>
        </HStack>
    );
};

const AppMenuItem = ({ children }) => {
    return (
        <Link className="app-menu-item" href={"/"} as={NextLink}>
            {children}
        </Link>
    );
};
export default MyApp;
