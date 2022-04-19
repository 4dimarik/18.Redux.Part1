import * as actionTypes from "./actionTypes";

export function reducer(state = [], action) {
  switch (action.type) {
    case actionTypes.taskUpdated: {
      const newArray = [...state];
      const elIndex = newArray.findIndex((el) => el.id === action.payload.id);
      newArray[elIndex] = { ...newArray[elIndex], ...action.payload };
      return newArray;
    }
    case actionTypes.taskDeleted: {
      const newArray = [...state];
      return newArray.filter((el) => el.id !== action.payload.id);
    }
    default:
      return state;
  }
}
