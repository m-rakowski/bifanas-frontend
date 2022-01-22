import React from "react";
import {Box, chakra, Flex, Image, useColorModeValue} from "@chakra-ui/react";
import {UploadedFile} from "../model/uploaded-file";

const UploadedFileCard: React.FC<{
    uploadedFile: UploadedFile;
    onDelete?: (id: string) => void;
    readonlyMode?: boolean
}> = ({
          uploadedFile,
          onDelete,
          readonlyMode = false,
      }) => (
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
                fontSize="3xl"
                textTransform="uppercase"
            >{uploadedFile.total}</chakra.h1>
            <chakra.p
                mt={1}
                fontSize="sm"
                style={{whiteSpace: 'pre-wrap'}}
                color={useColorModeValue("gray.600", "gray.400")}
            >{uploadedFile.text}</chakra.p>
        </Box>


        <Image
            src={`/backend/${uploadedFile.url}`}
            alt={`Picture of ${uploadedFile.originalName}`}
            roundedTop="lg"
            w={'100%'}
        />

        <Flex
            alignItems="center"
            justifyContent="space-between"
            px={4}
            py={2}
            bg="gray.900"
            roundedBottom="lg"
        >
            <chakra.h1 color="white" fontWeight="bold" fontSize="lg">
                {uploadedFile.total}
            </chakra.h1>
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
);

export default UploadedFileCard;
