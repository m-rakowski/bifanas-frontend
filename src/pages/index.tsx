import React, {useEffect} from "react";
import {UserProfile, useUser} from '@auth0/nextjs-auth0';
import Image from 'next/image';

import '../../styles/Index.module.scss';
import {
    Box,
    Button,
    Center,
    Heading,
    HStack,
    Modal,
    ModalContent,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Spinner,
    Stack,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import Dropzone from "../ui/components/dropzone";
import {JsqrScanner} from "../ui/components/jsqr-scanner";
import {useDispatch, useSelector} from "react-redux";
import { indexPageSlice } from "../redux/slices/indexPageSlice/indexPageSlice";
import {updateTotal, uploadFileToBackend} from "../redux/slices/indexPageSlice/effects/effects";
import {
    getErrorMessage,
    getImageSrc,
    getInputValue, getIsFetching,
    getOcrResponse
} from "../redux/slices/indexPageSlice/selectors/selectors";


export default function Index() {

    const dispatch = useDispatch();

    const imageSrc = useSelector(getImageSrc);
    const inputValue = useSelector(getInputValue);
    const ocrResponse = useSelector(getOcrResponse);
    const errorMessage = useSelector(getErrorMessage);
    const isFetching = useSelector(getIsFetching);

    const toast = useToast();

    useEffect(() => {
        if (ocrResponse) {
            toast({
                title: `Picture uploaded`,
                status: 'success',
                isClosable: true,
            });
        }
        if (errorMessage) {
            toast({
                title: errorMessage,
                status: 'error',
                isClosable: true,
            });
        }
    }, [ocrResponse, errorMessage])

    const {isOpen, onOpen, onClose} = useDisclosure();
    const {user, error, isLoading} = useUser();

    const handleDrop = async (image) => {
        if (image) {
            onOpen();
            dispatch(indexPageSlice.actions.setImageSrc(URL.createObjectURL(image)))
            dispatch(uploadFileToBackend(image));
        }

    };
    const handleScan = (data: string) => {
        if (data) {
            toast({
                title: `QR read`,
                status: 'success',
                isClosable: true,
            });
            const totalAmount = data.split('*').find(segment => segment.startsWith("O:"))?.substring(2);
            dispatch(indexPageSlice.actions.setInputValue(totalAmount))
            onClose();

        }

    };
    return (
        <>
            {user && <div>
                {isFetching && <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />}
                <Stack>
                    <Dropzone onFileAccepted={handleDrop}/>
                    {imageSrc && <HStack>

                        <Heading as='h3' size='lg'>Amount:</Heading>
                        <NumberInput
                            onChange={() => dispatch(indexPageSlice.actions.setInputValue((event.target as HTMLButtonElement)?.value))}
                            value={inputValue}
                            precision={2} step={0.1} width={'300px'}
                        >
                            <NumberInputField

                            />
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>
                        <Button colorScheme='teal' size='md' disabled={!ocrResponse}
                                onClick={() => dispatch(updateTotal(inputValue, ocrResponse?.savedFileName))}>
                            Send
                        </Button>
                    </HStack>}
                </Stack>
                <Center>
                    <Box py={5} display={{md: 'flex'}}>
                        <Box flexShrink={0}>
                            {imageSrc && <Image src={imageSrc}
                                                alt={'uploaded image'}
                                                width={400}
                                                height={800}
                            />}
                        </Box>
                    </Box>
                </Center>

            </div>}

            <Modal onClose={onClose} isOpen={isOpen} size={'xs'}>
                <ModalOverlay/>
                <ModalContent>
                    <h2>Point the camera at the QR code on the receipt to read the total</h2>
                    <JsqrScanner onScanned={handleScan}/>
                </ModalContent>
            </Modal>
        </>
    )
}
