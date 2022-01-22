import {useState} from "react";
import {useUser} from '@auth0/nextjs-auth0';
import Image from 'next/image';
import '../styles/Index.module.scss'
import {
    Box,
    Button,
    Center,
    Heading,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Spinner,
    Stack,
    Text,
    useToast
} from "@chakra-ui/react";
import Dropzone from "../components/dropzone";
import axios from "axios";

export interface OcrResponseRM {
    text: string;
    total: string;
    fileId: string;
}

export default function Index() {
    const [requestInProgress, setRequestInProgress] = useState<boolean>(false);
    const [data, setData] = useState<OcrResponseRM>({total: '', text: '', fileId: ''});
    const [uploadedImage, setUploadedImage] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const toast = useToast()

    const uploadToClient = async (image) => {
        if (image) {
            setUploadedImage(URL.createObjectURL(image));
        }

        const ocrResponseRM = await uploadFileToBackend(image);
        setData(ocrResponseRM);
        setInputValue(ocrResponseRM?.total);
    };

    const updateTotal = async () => {
        try {
            await axios.put<OcrResponseRM>(
                "/backend/api/image/update-total",
                {total: inputValue, fileId: data.fileId}, {});
            toast({
                title: `File uploaded`,
                status: 'success',
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: err?.message,
                status: 'error',
                isClosable: true,
            });
        }
    };


    const uploadFileToBackend = async (image): Promise<OcrResponseRM> => {
        try {
            setRequestInProgress(true);
            const formData = new FormData();
            formData.append("file", image);

            const response = await axios.post<OcrResponseRM>(
                "/backend/api/image/ocr",
                formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
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
                <Stack>
                    <Dropzone onFileAccepted={uploadToClient}/>
                    {uploadedImage && data && data.fileId && <HStack>
                        <Heading as='h3' size='lg'>Amount:</Heading>
                        <NumberInput
                            onChange={() => setInputValue((event.target as HTMLButtonElement)?.value)}
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
                        <Button colorScheme='teal' size='md' onClick={updateTotal}>
                            Send
                        </Button>
                    </HStack>}
                </Stack>
                <Center>
                    <Box p={4} display={{md: 'flex'}}>
                        <Box flexShrink={0}>
                            {uploadedImage && <Image src={uploadedImage}
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
