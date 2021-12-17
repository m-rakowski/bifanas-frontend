import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import {CloseIcon, HamburgerIcon} from '@chakra-ui/icons';
import {useUser} from "@auth0/nextjs-auth0";
import {useRouter} from 'next/router'

interface LinkLabelPath {
    label: string,
    path: string
}

const Links: LinkLabelPath [] = [
    // {
    //     label: 'Images',
    //     path: 'images',
    // },
    {
        label: 'Home',
        path: '/',
    },
];

const NavLink: React.FC<{
    link: LinkLabelPath
}> = ({link}) => (
    <Link as={NextLink} href={link.path}
          px={2}
          py={1}
          rounded={'md'}
          _hover={{
              textDecoration: 'none',
              bg: useColorModeValue('gray.200', 'gray.700'),
          }}>
        <a>{link.label}</a>
    </Link>
);

export default function Nav() {
    const {user, error, isLoading} = useUser();
    const router = useRouter()

    const {
        isOpen,
        onOpen,
        onClose,
    } = useDisclosure();

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon/> : <HamburgerIcon/>}
                        aria-label={'Open Menu'}
                        display={{md: 'none'}}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{
                                base: 'none',
                                md: 'flex',
                            }}>
                            {Links.map((link) => (
                                <NavLink key={link.path} link={link}/>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        {!user && <Button onClick={() => router.push('/api/auth/login')}>Sign in</Button>}
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}>
                                {user && <Avatar
                                    size={'sm'}
                                    src={user?.picture}
                                />}
                            </MenuButton>
                            <MenuList>
                                {!user && <MenuItem onClick={() => router.push('/api/auth/login')}>Sign in</MenuItem>}
                                {user && <MenuItem onClick={() => router.push('/api/auth/logout')}>Sign out</MenuItem>}
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{md: 'none'}}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link.label} link={link}></NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}
