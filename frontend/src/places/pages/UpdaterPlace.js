//62-update place
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import './NewPlace.css';
// 64-creating custom hook
import { useForm } from '../../shared/hooks/form-hook';
//67-fixing undefined place error
import Card from '../../shared/components/UIElements/Card';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u2'
  }
];


export default function UpdaterPlace() {
  const placeId = useParams().placeId;
  const [isLoading, setIsLoading] = useState(true);// 66-Adjusting the form hook
  // 64-creating custom hook // 66-Adjusting the form hook
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

  const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

  // 66-Adjusting the form hook
  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true
          },
          description: {
            value: identifiedPlace.description,
            isValid: true
          }
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedPlace]);



  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  // 66-Adjusting the form hook
  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }
  return (identifiedPlace ?
    (<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input id="title" element="input" type="text" label="Title"
        validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid title."
        onInput={inputHandler} initialValue={formState.inputs.title.value} initialValid={formState.inputs.title.isValid} />

      <Input id="description" element="textarea" label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid description(5 chars)."
        onInput={inputHandler} initialValue={formState.inputs.description.value} initialValid={formState.inputs.description.isValid} />

      <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>)
    : (<div className="center"> <Card><h2>Could not find place!</h2></Card></div>)
  );
};
