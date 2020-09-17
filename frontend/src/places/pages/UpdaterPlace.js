//62-update place
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import './NewPlace.css';
import { useForm } from '../../shared/hooks/form-hook';           // 64-creating custom hook
import Card from '../../shared/components/UIElements/Card';       //67-fixing undefined place error
import { useHttpClient } from '../../shared/hooks/http-hook';     // 155 editing-updating places by userID from db
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';


const UpdatePlace = () => {

  const { isLoading, error, sendRequest, clearError } = useHttpClient();    // 155 editing-updating places by userID from db
  const [loadedPlace, setLoadedPlace] = useState();
  const history = useHistory();
  const auth = useContext(AuthContext);
  // 64-creating custom hook // 66-Adjusting the form hook
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: "",
      isValid: false
    },
    description: {
      value: "",
      isValid: false
    }
  }, false);

  useEffect(() => {                           // 155 editing-updating places by userID from db
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`);
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            }
          },
          true
        );
      } catch (error) { };
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData])

  // // 66-Adjusting the form hook
  // useEffect(() => {
  //   if (identifiedPlace) {

  //   }
  //   setIsLoading(false);
  // }, [setFormData, identifiedPlace]);



  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    // 155 editing-updating places by userID from db
    try {
      await sendRequest(`http://localhost:5000/api/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token             //180- using token to update place
        });
      history.push('/' + auth.userId + '/places');
    } catch (error) { }
  };

  // // 66-Adjusting the form hook
  // if (isLoading) {
  //   return (
  //     <div className="center">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }
  return ((loadedPlace && !error) ?
    (
      <>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (<div className='center'>
          <LoadingSpinner />
        </div>)}
        {!isLoading && loadedPlace
          && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
              initialValue={loadedPlace.title}
              initialValid={true}
            />
            <Input
              id="description"
              element="textarea"
              label="Description"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid description (min. 5 characters)."
              onInput={inputHandler}
              initialValue={loadedPlace.description}
              initialValid={true}
            />
            <Button type="submit" disabled={!formState.isValid}>
              UPDATE PLACE
          </Button>
          </form>}
      </>)
    : (<div className="center"> <Card><h2>Could not find place!</h2></Card></div>)
  );
};
export default UpdatePlace;