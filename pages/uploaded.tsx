import {useEffect, useState} from "react";
import '../styles/Uploaded.module.scss'
import {UploadedFileRM} from "../model/uploaded-file-r-m";
import axios from "axios";
import {Box, SimpleGrid, useToast} from "@chakra-ui/react";
import UploadedFileCard from "../components/uploaded_file_card";
import {OcrResponseRM} from "./index";

export default function Uploaded() {
    const toast = useToast()

    const updateTotal = async (newTotal: string, savedFileName: string) => {
        try {
            await axios.put<OcrResponseRM>(
                "/backend/api/image/update-total",
                {total: newTotal, savedFileName: savedFileName}, {});
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

    const [uploadedList, setUploadedList] = useState<UploadedFileRM[]>([]);

    const deleteUploadedFile = (id: string) => {
        axios.delete(`/backend/api/images/${id}`)
            .then(() => {
                setUploadedList(uploadedList.filter((uploadedFile) => uploadedFile.id !== id));
            });
    };
    useEffect(() => {
        axios
            .get<UploadedFileRM[]>('/backend/api/images')
            .then((uploadedFiles) => setUploadedList(uploadedFiles.data));
    }, []);
    return (<SimpleGrid minChildWidth="240px" spacing="40px">
        {
            uploadedList.map((uploadedFile: UploadedFileRM) => (
                <Box key={uploadedFile.id}>
                    <UploadedFileCard
                        uploadedFile={uploadedFile}
                        onDelete={deleteUploadedFile}
                        onUpdate={updateTotal}/>
                </Box>
            ))
        }
    </SimpleGrid>)
}
