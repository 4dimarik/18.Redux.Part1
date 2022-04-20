import { createAction, createSlice } from "@reduxjs/toolkit";
import todosService from "../todos.service";
import { setError } from "./errors";

const initialState = { entities: [], isLoading: true };

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    received(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    update(state, action) {
      const elIndex = state.entities.findIndex(
        (el) => el.id === action.payload.id
      );
      state.entities[elIndex] = {
        ...state.entities[elIndex],
        ...action.payload,
      };
    },
    remove(state, action) {
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    loadTasksRequested(state) {
      state.isLoading = true;
    },

    taskRequestFailed(state) {
      state.isLoading = false;
    },
    taskAdded(state, action) {
      state.entities.push(action.payload);
    },
  },
});

const { actions, reducer: taskReducer } = taskSlice;
const {
  update,
  remove,
  received,
  loadTasksRequested,
  taskRequestFailed,
  taskAdded,
} = actions;

const taskRequested = createAction("task/taskRequested");

export const loadTasks = () => async (dispatch) => {
  dispatch(loadTasksRequested());
  try {
    const data = await todosService.fetch();
    dispatch(received(data));
  } catch (e) {
    dispatch(taskRequestFailed());
    dispatch(setError(e.message));
  }
};
export const createTasks = (task) => async (dispatch) => {
  dispatch(taskRequested());
  try {
    const data = await todosService.create(task);
    dispatch(taskAdded(data));
  } catch (e) {
    dispatch(taskRequestFailed());
    dispatch(setError(e.message));
  }
};
export const completeTask = (id) => (dispatch) => {
  dispatch(update({ id, completed: true }));
};

export function titleChanged(id) {
  return update({ id, title: `New title for ${id}` });
}

export function taskDeleted(id) {
  return remove({ id });
}

export const getTasks = () => (state) => state.tasks.entities;
export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading;

export default taskReducer;
