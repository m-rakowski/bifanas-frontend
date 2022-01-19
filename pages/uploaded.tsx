import {useEffect, useState} from "react";
import '../styles/Uploaded.module.scss'
import {UploadedFile} from "../model/uploaded-file";
import axios from "axios";
import {Box, SimpleGrid} from "@chakra-ui/react";
import UploadedFileCard from "./components/uploaded_file_card";

export default function Uploaded() {
    const [uploadedList, setUploadedList] = useState<UploadedFile[]>([]);

    const deleteUploadedFile = (id: string) => {
        axios.delete(`http://localhost:8000/images/${id}`)
            .then(() => {
                setUploadedList(uploadedList.filter((uploadedFile) => uploadedFile.id !== id));
            });
    };
    useEffect(() => {
        axios
            .get<UploadedFile[]>('http://localhost:8080/api/images')
            .then((uploadedFiles) => setUploadedList(uploadedFiles.data));
    }, []);
    return (<SimpleGrid minChildWidth="240px" spacing="40px">
        {
            uploadedList.map((uploadedFile: UploadedFile) => (
                <Box key={uploadedFile.id}>
                    {uploadedFile.oldName}
                    <UploadedFileCard
                        uploadedFile={uploadedFile}
                        onDelete={deleteUploadedFile}
                        readonlyMode={false}/>
                </Box>
            ))
        }
    </SimpleGrid>)
}
