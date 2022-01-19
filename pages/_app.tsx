import {UserProvider} from '@auth0/nextjs-auth0';
import {ChakraProvider, Container} from '@chakra-ui/react';
import '../styles/globals.scss';
import '../theme/styles.scss';
import theme from '../theme';
import Nav from "../components/nav";

export default function App({Component, pageProps}) {
    // If you've used `withAuth`, pageProps.user can pre-populate the hook
    // if you haven't used `withAuth`, pageProps.user is undefined so the hook
    // fetches the user from the API routes
    const {user} = pageProps;

    return (
        <UserProvider user={user}>
            <ChakraProvider theme={theme}>
                <Nav/>
                <Container maxW="container.xl"
                           px={[5, 10, 20]}
                           py={[10, 20, 30]}
                           h={{
                               base: 'auto',
                               md: '100vh',
                           }}>
                    <Component {...pageProps} />
                </Container>
            </ChakraProvider>
        </UserProvider>
    );
}

