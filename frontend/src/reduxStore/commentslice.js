import { createSlice } from '@reduxjs/toolkit';

const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: []
    },
    reducers: {
        setComment: (state, action) => {
            state.comments = action.payload;
        },
        addComment: (state, action) => {
            state.comments.push(action.payload);
        },
        updateComments: (state, action) => {
            state.comments = action.payload;
        },
    },
});

export const { setComment, addComment, updateComments } = commentSlice.actions;
export default commentSlice.reducer;