// Selectors
import {AppState} from "../../../store";

export const getImageSrc = (state: AppState) => state.indexPage.imageSrc;
export const getOcrResponse = (state: AppState) => state.indexPage.ocrResponse;
export const getInputValue = (state: AppState) => state.indexPage.inputValue;
export const getIsFetching = (state: AppState) => state.indexPage.isFetching;
export const getErrorMessage = (state: AppState) => state.indexPage.errorMessage;
