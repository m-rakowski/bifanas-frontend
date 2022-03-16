import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit';
import axios from "axios";
import {UploadedFileRM} from "../../../model/uploaded-file-r-m";
import {OcrResponseRM} from "../../../model/ocr-response-rm";
import {Dispatch} from "redux";
import {AppState} from "../../store";


export interface UploadedFilesSliceState {
    allUploadedFiles: UploadedFileRM[],
    isFetching: boolean,
    isError: boolean
}

const initialState: UploadedFilesSliceState = {
    allUploadedFiles: [],
    isFetching: false,
    isError: false
};

export const uploadedFilesSlice = createSlice({
    name: 'uploadedFilesSlice',
    initialState,
    reducers: {
        setUploadedFiles: (
            state: Draft<UploadedFilesSliceState>,
            action: PayloadAction<UploadedFilesSliceState>
        ) => {
            state.allUploadedFiles = action.payload.allUploadedFiles;
        },
        resetUploadedFiles: (state: Draft<UploadedFilesSliceState>) => {
            state.allUploadedFiles = [];
        },
        downloadSuccess(state, action: PayloadAction<UploadedFileRM[]>) {
            state.isFetching = false
            state.isError = false
            state.allUploadedFiles = action.payload
        },
        downloadFailure(state) {
            state.isFetching = false
            state.isError = true
        },
        deletionSuccess(state, action: PayloadAction<UploadedFileRM>) {
            state.isFetching = false
            state.isError = false
            state.allUploadedFiles = state.allUploadedFiles.filter(file => file.id !== action.payload.id)
        },
        deletionFailure(state) {
            state.isFetching = false
            state.isError = true
        },
        updatingTotalSuccess(state, action: PayloadAction<OcrResponseRM>) {
            state.isFetching = false
            state.isError = false
        },
        updatingTotalFailure(state) {
            state.isFetching = false
            state.isError = true
        },
    },
});

export type UploadedFilesThunk = (
    dispatch: Dispatch<any>,
    getState: () => UploadedFilesSliceState
) => Promise<any>;

// Selectors
export const getUploadedFiles = (state: AppState) => state.uploadedFiles.allUploadedFiles;
export const getIsError = (state: AppState) => state.uploadedFiles.isError;
export const getIsFetching = (state: AppState) => state.uploadedFiles.isFetching;

export const downloadUploadedFiles = (): UploadedFilesThunk => {
    return async (dispatch) => {
        try {
            const {data} = await axios
                .get<UploadedFileRM[]>('/backend/api/images');
            dispatch(uploadedFilesSlice.actions.downloadSuccess(data))
        } catch (e) {
            dispatch(uploadedFilesSlice.actions.downloadFailure())
        }
    }
}
export const deleteFile = (savedFileName: string): UploadedFilesThunk => {
    return async (dispatch) => {
        try {
            const {data} = await axios.delete(`/backend/api/images/${savedFileName}`)
            dispatch(uploadedFilesSlice.actions.deletionSuccess(data))
        } catch (e) {
            dispatch(uploadedFilesSlice.actions.deletionFailure())
        }
    }
}

export const updateTotal = (newTotal: string, savedFileName: string): UploadedFilesThunk => {
    return async (dispatch) => {
        try {
            const {data} = await axios.put<OcrResponseRM>(
                "/backend/api/image/update-total",
                {total: newTotal, savedFileName: savedFileName}, {});
            dispatch(uploadedFilesSlice.actions.updatingTotalSuccess(data))
        } catch (e) {
            dispatch(uploadedFilesSlice.actions.updatingTotalFailure())
        }
    }
}


// export const uploadFileToBackend = (image): UploadedFilesThunk => {
//     return async (dispatch) => {
//         try {
//             const formData = new FormData();
//             formData.append("file", image);
//
//             const {data} = await axios.post<OcrResponseRM>(
//                 "/backend/api/image/ocr",
//                 formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 });
//             dispatch(uploadedFilesSlice.actions.uploadSuccess(data))
//         } catch (e) {
//             dispatch(uploadedFilesSlice.actions.uploadFailure())
//         }
//     }
// }
