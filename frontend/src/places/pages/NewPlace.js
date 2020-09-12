import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';                              // 153-Adding Post and redirected

import ErrorModal from '../../shared/components/UIElements/ErrorModal';       // 153-Adding Post
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';   //60-managing form-wide state
import Input from '../../shared/components/FormElements/Input';         //56 custom form input
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';    //58-input validation
import { useForm } from '../../shared/hooks/form-hook';     // 64-formReducer to form-hook
import { useHttpClient } from '../../shared/hooks/http-hook';   // 153-Adding Post
import { AuthContext } from '../../shared/context/auth-context';
import './NewPlace.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient(); // 153-Adding Post

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

  const history = useHistory();

  //64-inputhandler to form-hook
  // //60-managing form-wide state -- const descriptionInputHandler = useCallback((id, value, isValid) => { }, []);
  // 61-finishing add place form
  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        'http://localhost:5000/api/places',
        'POST',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: auth.userId
        }),
        { 'Content-Type': 'application/json' }
      );
      history.push('/');
    } catch (err) { }
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        {/* // 59-adding multiple input */}
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        {/* // 61-finishing add place form */}
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        {/* /60-managing form-wide state */}
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;