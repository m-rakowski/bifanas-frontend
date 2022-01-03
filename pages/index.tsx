import {useState} from "react";
import {useUser} from '@auth0/nextjs-auth0';
import Image from 'next/image';
import '../styles/Index.module.scss'
import {Box, Button, Center, Flex, Heading, HStack, Spinner, Text, useToast} from "@chakra-ui/react";
import Dropzone from "./components/dropzone";
import axios from "axios";

export interface OcrResponse {
    text: string;
    total: string;
}
export default function Index() {
    const [requestInProgress, setRequestInProgress] = useState<boolean>(false);
    const [image, setImage] = useState(null);
    const [data, setData] = useState<OcrResponse>(null);
    const [secureUrl, setSecureUrl] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const toast = useToast()

    const uploadToClient = async (image) => {
        console.log(image.abc);
        if (image) {
            setImage(image);
            setCreateObjectURL(URL.createObjectURL(image));
        }

        setData(await uploadStraightToOCRServer(image));
    };

    const uploadToServer = async (image) => {
        try {
            setRequestInProgress(true);
            const formData = new FormData();
            formData.append("file", image);
            const response = await axios.post(
                "/api/file",
                formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            setSecureUrl(response.data.secure_url)
            toast({
                title: `File uploaded`,
                status: 'success',
                isClosable: true,
            });
            return response.data.secure_url;

        } catch (err) {
            toast({
                title: err?.message,
                status: 'error',
                isClosable: true,
            });
        } finally {
            setRequestInProgress(false);
        }
    };
    const uploadStraightToOCRServer = async (image) => {
        try {
            setRequestInProgress(true);
            const formData = new FormData();
            formData.append("file", image);
            const response = await axios.post<OcrResponse>(
                "https://bifanas-backend.herokuapp.com/api/ocr/file",
                // "http://localhost:8080/api/ocr/file",
                formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            toast({
                title: `File uploaded`,
                status: 'success',
                isClosable: true,
            });

            return response.data;

        } catch (err) {
            toast({
                title: err?.message,
                status: 'error',
                isClosable: true,
            });
        } finally {
            setRequestInProgress(false);
        }
    };
    const getOCR = async (secure_url) => {
        try {
            setRequestInProgress(true);
            const res = await axios.post("/api/receipt",
                {secure_url},
            );
            setData(res.data);

            toast({
                title: `Scanning for text`,
                status: 'success',
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: err?.message,
                status: 'error',
                isClosable: true,
            });
        } finally {
            setRequestInProgress(false);
        }
    };

    const {user, error, isLoading} = useUser();

    return (
        <>
            {user && <div>
                {requestInProgress && <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />}
                <Heading as='h3' size='lg'>Amount: {data?.total}</Heading>
                <Dropzone onFileAccepted={uploadToClient}/>

                <Center>
                    <Box p={4} display={{md: 'flex'}}>
                        <Box flexShrink={0}>
                            {createObjectURL && <Image src={createObjectURL}
                                                       alt={'uploaded image'}
                                                       width={400}
                                                       height={800}
                            />}
                        </Box>
                        <Box mt={{base: 4, md: 0}} ml={{md: 6}}>
                            {data?.text && <Text
                                fontWeight='bold'
                                textTransform='uppercase'
                                fontSize='sm'
                                letterSpacing='wide'
                                color='teal.600'
                            >Parsed text</Text>}

                            <Text mt={2} color='gray.500' style={{whiteSpace: 'pre-wrap'}}>
                                {data?.text}
                            </Text>
                        </Box>
                    </Box>
                </Center>

            </div>}
        </>
    )
}
