import {createSlice} from '@reduxjs/toolkit';
import {OcrResponseRM} from "../../../model/ocr-response-rm";
import {indexPageReducers} from "./reducers/reducers";

export interface IndexPageSliceState {
    imageSrc: any;
    ocrResponse: OcrResponseRM;
    inputValue: string;
    isFetching: boolean;
    errorMessage: string;
}

export const indexPageSliceStateInitialState: IndexPageSliceState = {
    imageSrc: null,
    ocrResponse: null,
    inputValue: '',
    isFetching: false,
    errorMessage: ''
};

export const indexPageSlice = createSlice({
    name: 'indexPageSlice',
    initialState: indexPageSliceStateInitialState,
    reducers: indexPageReducers
});
