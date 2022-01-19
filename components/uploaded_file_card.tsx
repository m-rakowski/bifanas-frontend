import {Box, Flex, Image, Tooltip, useColorModeValue,} from '@chakra-ui/react';
import {DeleteIcon} from '@chakra-ui/icons';
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
        bg={useColorModeValue('white', 'gray.800')}
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position={'relative'}
    >

        <Image
            src={`/backend/${uploadedFile.url}`}
            alt={`Picture of ${uploadedFile.oldName}`}
            roundedTop="lg"
            w={'100%'}
        />

        <Box p="6">
            <Flex mt="1" justifyContent="space-between" alignContent="center">
                <Box
                    fontSize="2xl"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated>
                    {uploadedFile.total}
                </Box>
                <Box
                    fontSize="2xl"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated>
                    {uploadedFile.oldName}
                </Box>
                <Box
                    fontSize="2s"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated>
                    {uploadedFile.text}
                </Box>

                {!readonlyMode
                && <Tooltip
                    label="Delete"
                    bg="white"
                    placement={'top'}
                    color={'gray.800'}
                    fontSize={'1.2em'}>
                    <Box display={'flex'}>
                        <DeleteIcon
                            alignSelf={'center'} h={5} w={5} onClick={() => onDelete(uploadedFile.id)}
                            aria-label="Search database"
                        />
                    </Box>
                </Tooltip>}
            </Flex>
        </Box>
    </Box>);
export default UploadedFileCard;
