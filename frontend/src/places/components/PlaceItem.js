//49 rendering user places
import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import './PlaceItem.css';
//51-adding custom button
import Button from '../../shared/components/FormElements/Button';
//52-Adding Modal
import Modal from '../../shared/components/UIElements/Modal';
//53-map google
import Map from '../../shared/components/UIElements/Map';
//74-Auth context usage
import { AuthContext } from '../../shared/context/auth-context';

const PlaceItem = props => {
  const auth = useContext(AuthContext);   //74-Auth context usage
  const [showMap, setShowMap] = useState(false);  //52-Adding Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);  // 68-Showing deletion warning

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  // 68-Showing deletion warning
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = () => {
    setShowConfirmModal(false);
    console.log('DELETING...');
  };

  return (
    //52-Adding Modal
    <React.Fragment>
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
          </React.Fragment>
        }>
        <p>
          Do you want to delete this place?
          It can't be undone thereafter.</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {auth.isLoggedIn && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && (
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
