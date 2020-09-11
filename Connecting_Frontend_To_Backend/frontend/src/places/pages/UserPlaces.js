//49-rendering user places
import React, { useEffect, useState } from 'react';

import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom';     //50-getting route params
import { useHttpClient } from '../../shared/hooks/http-hook'; // 154 load places by userID from db
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();    // 154 load places by userID from db
  const [loadedPlaces, setLoadedPlaces] = useState();

  const userId = useParams().userId;           //50-getting route params

  useEffect(() => {                           // 154 load places by userID from db
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);  // 152 - using the http-hook to get users
        setLoadedPlaces(responseData.places);
      } catch (error) { };
    };
    fetchPlaces();
  }, [sendRequest, userId])

  const placeDeletedHandler = (deletedPlaceId) => {             // 156-Deleted places from db
    setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId));
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;