import {indexPageSlice, indexPageSliceStateInitialState} from "../indexPageSlice";

describe('authenticate reducer', () => {
    it('returns the initial state', () => {
        expect(indexPageSlice.reducer(
                indexPageSliceStateInitialState,
                null)).toEqual(indexPageSliceStateInitialState);
    });
});
