// 69-Adding Auth page
import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';     //146-Getting start with Error handling
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload'; //161 -Building image upload component
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';    //73-Adding Authenticated
import { useHttpClient } from '../../shared/hooks/http-hook';       // 151 -improving the http-hook
import './Auth.css';

const Auth = () => {

  const auth = useContext(AuthContext);                       //73-Adding Authenticated
  const [isLoginMode, setIsLoginMode] = useState(true);       // 70-Adding Switch mode

  const { isLoading, error, sendRequest, clearError } = useHttpClient();    // 151 -improving the http-hook

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {                           // 70-Adding Switch mode
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {                                  //143 - sending a post request to the backend
      // 151 -improving the http-hook
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }), { 'Content-Type': 'application/json' });
        auth.login(responseData.userId, responseData.token);          // 179-using and attaching token in React user.id was changed useId   //73-Adding Authenticated
      } catch (err) { }
    } else {
      try {
        const formData = new FormData();          // 165 - FormData instead of json text  https://www.javascripture.com/FormData
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/signup',
          'POST',
          formData
        );
        auth.login(responseData.userId, responseData.token);                                       //73-Adding Authenticated
      } catch (err) { }
    }
  };


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />                              {/* //147-proper error handling in Frontend */}
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please upload an image!" />}                             {/*//161 -Building image upload component */}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          {/* 70-Adding Switch mode */}
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
