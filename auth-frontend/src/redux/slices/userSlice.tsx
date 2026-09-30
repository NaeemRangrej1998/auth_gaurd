import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    usersData: []
}
const usersSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUsersData: (state, action) => {
            state.usersData = action.payload
        }
    }
})
export const { setUsersData } = usersSlice.actions

export default usersSlice.reducer