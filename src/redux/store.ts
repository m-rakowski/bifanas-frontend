import {configureStore} from '@reduxjs/toolkit';

import uploadedFilesReducer, {UploadedFilesSliceState} from './slices/uploadedFilesSlice';
import indexPageReducer, {IndexPageSliceState} from "./slices/indexPageSlice";

export default configureStore({
    reducer: {
        uploadedFiles: uploadedFilesReducer,
        indexPage: indexPageReducer,
    },
});

export interface AppState {
  uploadedFiles: UploadedFilesSliceState,
  indexPage: IndexPageSliceState,
}
