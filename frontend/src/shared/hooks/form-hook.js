// 64-creating custom hook
import { useCallback, useReducer } from 'react';

//60-managing form-wide state
const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        isValid: formIsValid
      };
    default:
      return state;
  }
};
export const useForm = (initialInputs, initialFormValidity) => {
  //60-managing form-wide state
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity
  });


  // 59-sharing input values
  //useCalback=to wrap a function and define dependencies of it under which it should re-render
  const inputHandler = useCallback((id, value, isValid) => {
    //60-managing form-wide state
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id
    });
  }, []);
  return [formState, inputHandler];
};


