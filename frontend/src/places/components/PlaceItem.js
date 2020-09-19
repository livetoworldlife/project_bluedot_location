//49 rendering user places
import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';       //51-adding custom button
import Modal from '../../shared/components/UIElements/Modal';           //52-Adding Modal
import Map from '../../shared/components/UIElements/Map';               //53-map google
import ErrorModal from '../../shared/components/UIElements/ErrorModal';     // 156-Deleting places from db
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';        //74-AuthContext  usage
import { useHttpClient } from '../../shared/hooks/http-hook';           // 156-Deleting places from db
import './PlaceItem.css';

const PlaceItem = props => {
  const auth = useContext(AuthContext);                                 //74-AuthContext  usage
  const [showMap, setShowMap] = useState(false);                        //52-Adding Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);      // 68-Showing deletion warning
  const { isLoading, error, sendRequest, clearError } = useHttpClient(); // 156-Deleting places from db

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);
  // 68-Showing deletion warning
  const showDeleteWarningHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    // 156-Deleting places from db
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + auth.token }            //180- using token to delete place
      );
      props.onDelete(props.id);
    } catch (error) { }
  };

  return (
    //52-Adding Modal
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          {/* //53-map google */}
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      {/* 68-Showing deletion warning */}
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>}
      >
        <p>
          Do you want to delete this place?
          It can't be undone thereafter.</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;