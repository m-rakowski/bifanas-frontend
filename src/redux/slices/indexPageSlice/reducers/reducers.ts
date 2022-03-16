import {Draft, PayloadAction} from "@reduxjs/toolkit";
import {OcrResponseRM} from "../../../../model/ocr-response-rm";
import {IndexPageSliceState} from "../indexPageSlice";

export const indexPageReducers = {
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
    }
}
