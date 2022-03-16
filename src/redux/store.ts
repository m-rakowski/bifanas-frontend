import {configureStore} from '@reduxjs/toolkit';
import {uploadedFilesSlice, UploadedFilesSliceState} from "./slices/uploadedFilesSlice/uploadedFilesSlice";
import {indexPageSlice, IndexPageSliceState} from "./slices/indexPageSlice/indexPageSlice";


export default configureStore({
    reducer: {
        uploadedFiles: uploadedFilesSlice.reducer,
        indexPage: indexPageSlice.reducer,
    },
});

export interface AppState {
    uploadedFiles: UploadedFilesSliceState,
    indexPage: IndexPageSliceState,
}
