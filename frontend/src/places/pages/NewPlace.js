import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';                              // 153-Adding Post and redirected

import ErrorModal from '../../shared/components/UIElements/ErrorModal';       // 153-Adding Post
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';   //60-managing form-wide state
import Input from '../../shared/components/FormElements/Input';         //56 custom form input
import ImageUpload from '../../shared/components/FormElements/ImageUpload';   // 168- upload image for new place
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
      },
      image: {
        value: null,
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
      const formData = new FormData();          // 168- upload image for new place
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      //formData.append('creator', auth.userId);
      formData.append('image', formState.inputs.image.value);

      await sendRequest(
        'http://localhost:5000/api/places',
        'POST',
        formData,
        { Authorization: "Bearer " + auth.token }               // 179-using and attaching token in React user
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
        {/*// 168- upload image for new place*/}
        <ImageUpload id="image" onInput={inputHandler} errorText="Please upload an image!" />
        {/* /60-managing form-wide state */}
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;