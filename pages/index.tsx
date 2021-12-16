import {useState} from "react";
import {useUser} from '@auth0/nextjs-auth0';
import Image from 'next/image';
import '../styles/Index.module.scss'
import {Button, Heading, HStack, Spinner, useToast} from "@chakra-ui/react";
import Dropzone from "./components/dropzone";

export default function Index() {
    const [requestInProgress, setRequestInProgress] = useState<boolean>(false);
    const [image, setImage] = useState(null);
    const [data, setData] = useState(null);
    const [secureUrl, setSecureUrl] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const toast = useToast()

    const uploadToClient = (image) => {
        console.log(image.abc);
        if (image) {
            setImage(image);
            setCreateObjectURL(URL.createObjectURL(image));
        }
    };

    const uploadToServer = async (event) => {
        try {
            setRequestInProgress(true);
            const body = new FormData();
            body.append("file", image);
            const response = await fetch("/api/file", {
                method: "POST",
                body
            });
            const {secure_url} = await response.json();
            setSecureUrl(secure_url);
        } catch (err) {
            toast({
                title: `${JSON.stringify(err)}`,
                status: 'error',
                isClosable: true,
            });
        } finally {
            setRequestInProgress(false);
        }
    };

    const getOCR = async () => {
        try {
            setRequestInProgress(true);
            await getParsedData(secureUrl);
        } catch (err) {
            toast({
                title: `${JSON.stringify(err)}`,
                status: 'error',
                isClosable: true,
            });
        } finally {
            setRequestInProgress(false);
        }
    };

    const getParsedData = async (secure_url: string) => {
        const res = await fetch("/api/receipt", {
            body: JSON.stringify({secure_url}),
            method: "POST"
        });
        const data = await res.json();
        setData(data);
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
                <HStack spacing='24px'>
                    <Button colorScheme='teal' variant='link'
                            type="button"
                            onClick={uploadToServer}
                    >Send to server</Button>
                    <Button colorScheme='teal' variant='link'
                            type="button"
                            onClick={getOCR}
                    >Get OCR</Button>
                </HStack>
                {createObjectURL && <Image src={createObjectURL}
                                           alt={'uploaded image'}
                                           width={500}
                                           height={600}
                />}
                <div style={{whiteSpace: 'pre-wrap'}}>{data?.text}</div>
            </div>}
        </>
    )
}
