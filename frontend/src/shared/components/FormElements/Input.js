//56 custom form input
import React, { useReducer, useEffect } from 'react';

import './Input.css';
//58-input validation
import { validate } from '../../util/validators';

//57managing internel state input reducer
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators) //58-input validation
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true
      };
    default:
      return state;
  }
};

const Input = props => {
  //57managing internel state usereducer 
  const [inputState, dispatch] = useReducer(inputReducer,
    {
      value: props.initialValue || "",
      isValid: props.initialValid || false,
      isTouched: false
    });

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators    //58-input validation
    });
  };
  // 58-adding input validator
  const touchHandler = () => {
    dispatch(
      {
        type: 'TOUCH'
      }
    );
  };
  // 59-sharing input values
  const { id, onInput } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  //56 actual input element-flexible
  // const element =
  //   props.element === 'input' ? (
  //     <input id={props.id} type={props.type} placeholder={props.placeholder} />
  //   ) : (
  //       <textarea id={props.id} rows={props.rows || 3} />
  //     );

  return (
    <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
      <label htmlFor={props.id}>{props.label}</label>
      {
        props.element === 'input'
          ? <input id={props.id} type={props.type} placeholder={props.placeholder}
            onChange={changeHandler} value={inputState.value}
            onBlur={touchHandler} />
          : <textarea id={props.id} rows={props.rows || 3}
            onChange={changeHandler} value={inputState.value}
            onBlur={touchHandler} />
      }
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;