import {Dispatch} from "redux";
import axios from "axios";
import {OcrResponseRM} from "../../../../model/ocr-response-rm";
import {uploadedFilesSlice} from "../../uploadedFilesSlice/uploadedFilesSlice";
import {indexPageSlice, IndexPageSliceState} from "../indexPageSlice";

export type IndexPageThunk = (
    dispatch: Dispatch<any>,
    getState: () => IndexPageSliceState
) => Promise<any>;

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
