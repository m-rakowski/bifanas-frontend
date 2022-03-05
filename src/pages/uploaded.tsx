import {useEffect} from "react";
import '../../styles/Uploaded.module.scss'
import {Box, SimpleGrid} from "@chakra-ui/react";
import UploadedFileCard from "../ui/components/uploaded_file_card";
import {UploadedFileRM} from "../model/uploaded-file-r-m";
import {useDispatch, useSelector} from "react-redux";
import {deleteFile, downloadUploadedFiles, getUploadedFiles, updateTotal,} from "../redux/slices/uploadedFilesSlice";

export default function Uploaded() {

    const dispatch = useDispatch();

    const uploadedList = useSelector(getUploadedFiles);

    useEffect(() => {
        dispatch(downloadUploadedFiles());
    }, []);

    return (<>
        {!!uploadedList?.length && <SimpleGrid minChildWidth="240px" spacing="40px">
            {
                uploadedList.map((uploadedFile: UploadedFileRM) => (
                    <Box key={uploadedFile.id}>
                        <UploadedFileCard
                            uploadedFile={uploadedFile}
                            onDelete={() => dispatch(deleteFile(uploadedFile.savedFileName))}
                            onUpdate={(newTotal, savedFileName) => dispatch(updateTotal(newTotal, savedFileName))}
                        />
                    </Box>
                ))
            }
        </SimpleGrid>}</>)
}
