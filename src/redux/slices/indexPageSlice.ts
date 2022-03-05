import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit';
import axios from "axios";
import {UploadedFileRM} from "../../model/uploaded-file-r-m";
import {OcrResponseRM} from "../../model/ocr-response-rm";
import {AppState} from "../store";
import {Dispatch} from "redux";
import {uploadedFilesSlice, UploadedFilesSliceState, UploadedFilesThunk} from "./uploadedFilesSlice";

export interface IndexPageSliceState {
    imageSrc: any;
    ocrResponse: OcrResponseRM;
    inputValue: string;
    isFetching: boolean;
    errorMessage: string;
}

const initialState: IndexPageSliceState = {
    imageSrc: null,
    ocrResponse: null,
    inputValue: '',
    isFetching: false,
    errorMessage: ''
};

export const indexPageSlice = createSlice({
    name: 'indexPageSlice',
    initialState,
    reducers: {
        setImageSrc: (
            state: Draft<IndexPageSliceState>,
            action: PayloadAction<any>
        ) => {
            state.imageSrc = action.payload;
        },
        setInputValue: (
            state: Draft<IndexPageSliceState>,
            action: PayloadAction<string>
        ) => {
            state.inputValue = action.payload;
        },
        uploadSuccess(state, action: PayloadAction<OcrResponseRM>) {
            state.isFetching = false
            state.errorMessage = ''
            state.ocrResponse = action.payload;
        },
        uploadFailure(state) {
            state.isFetching = false
            state.errorMessage = ''
        },
        setIsFetching(state, action: PayloadAction<boolean>) {
            state.isFetching = action.payload;
        },
    },
});

export type IndexPageThunk = (
    dispatch: Dispatch<any>,
    getState: () => IndexPageSliceState
) => Promise<any>;

// Selectors
export const getImageSrc = (state: AppState) => state.indexPage.imageSrc;
export const getOcrResponse = (state: AppState) => state.indexPage.ocrResponse;
export const getInputValue = (state: AppState) => state.indexPage.inputValue;
export const getIsFetching = (state: AppState) => state.indexPage.isFetching;
export const getErrorMessage = (state: AppState) => state.indexPage.errorMessage;


export const updateTotal = (newTotal: string, savedFileName: string): IndexPageThunk => {
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


export const uploadFileToBackend = (image): IndexPageThunk => {
    return async (dispatch) => {
        try {
            dispatch(indexPageSlice.actions.setIsFetching(true));

            const formData = new FormData();
            formData.append("file", image);

            const {data} = await axios.post<OcrResponseRM>(
                "/backend/api/image/ocr",
                formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            dispatch(indexPageSlice.actions.uploadSuccess(data))
        } catch (e) {
            dispatch(indexPageSlice.actions.uploadFailure())
        }
    }
}

export default indexPageSlice.reducer;
