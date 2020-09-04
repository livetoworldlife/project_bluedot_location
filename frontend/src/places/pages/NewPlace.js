import React from 'react';

//56 custom form input
import Input from '../../shared/components/FormElements/Input';
//58-input validation
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
//60-managing form-wide state
import Button from '../../shared/components/FormElements/Button';
import './NewPlace.css';
// 64-formReducer to form-hook
import { useForm } from '../../shared/hooks/form-hook';

// 64-formReducer to form-hook
const NewPlace = () => {
  // 64-use reducer to form-hook
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      }
    }, false
  );

  //64-inputhandler to form-hook

  // //60-managing form-wide state -- const descriptionInputHandler = useCallback((id, value, isValid) => { }, []);
  // 61-finishing add place form
  const placeSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend!
  };
  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input id="title" element="input" type="text" label="Title"
        validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid title."
        onInput={inputHandler} />
      {/* // 59-adding multiple input */}
      <Input id="description" element="textarea" label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid description(5 chars)."
        onInput={inputHandler} />
      {/* // 61-finishing add place form */}
      <Input id="address" element="input" label="Address"
        validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid address."
        onInput={inputHandler} />
      {/* /60-managing form-wide state */}
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default NewPlace;