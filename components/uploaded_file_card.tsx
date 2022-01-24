import React, {useState} from "react";
import {
    Box,
    Button,
    chakra,
    Collapse,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    Image,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import {UploadedFileRM} from "../model/uploaded-file-r-m";

const UploadedFileCard: React.FC<{
    uploadedFile: UploadedFileRM;
    onDelete?: (id: string) => void;
    onUpdate?: (newTotal: string, savedFileName: string) => void;
}> = ({
          uploadedFile,
          onDelete,
          onUpdate,
      }) => {
    const [show, setShow] = useState(false);

    const handleToggle = () => setShow(!show);
    return (
        <Box
            maxW="xs"
            mx="auto"
            bg={useColorModeValue("white", "gray.800")}
            shadow="lg"
            rounded="lg"
        >
            <Box px={4} py={2}>
                <chakra.h1
                    color={useColorModeValue("gray.800", "white")}
                    fontWeight="bold"
                    fontSize="sm"
                    textTransform="uppercase"
                >{uploadedFile.timestamp}</chakra.h1>
                <Collapse startingHeight={50} in={show}
                          onClick={handleToggle} >
                    {show && <Text
                        mt={1}
                        fontSize="sm"
                        style={{whiteSpace: 'pre-wrap'}}
                    >{uploadedFile.text}</Text>}
                    {!show && <Text
                        mt={1}
                        fontSize="sm"
                        noOfLines={show ? 100: 2}
                        style={{whiteSpace: 'pre-wrap'}}
                    >{uploadedFile.text}</Text>}
                </Collapse>
            </Box>


            <Image
                src={`/backend/${uploadedFile.savedFileName}`}
                alt={`Picture of ${uploadedFile.originalName}`}
                roundedTop="lg"
                w={'100%'}
            />

            <Flex
                alignItems="center"
                justifyContent="space-between"
                px={4}
                py={2}
                roundedBottom="lg"
            >
                <Editable
                    defaultValue={uploadedFile.total}
                    onBlur={() => onUpdate((event.target as HTMLButtonElement)?.value, uploadedFile.savedFileName)}>
                    <EditablePreview/>
                    <EditableInput/>
                </Editable>

                <chakra.button
                    onClick={() => onDelete(uploadedFile.id)}
                    px={2}
                    py={1}
                    bg="white"
                    fontSize="xs"
                    color="gray.900"
                    fontWeight="bold"
                    rounded="lg"
                    textTransform="uppercase"
                    _hover={{
                        bg: "gray.200",
                    }}
                    _focus={{
                        bg: "gray.400",
                    }}
                >
                    Delete
                </chakra.button>
            </Flex>
        </Box>
    )
};

export default UploadedFileCard;
