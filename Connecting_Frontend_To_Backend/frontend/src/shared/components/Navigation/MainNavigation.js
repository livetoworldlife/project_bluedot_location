//43-
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainHeader from './MainHeader';

import NavLinks from './NavLinks';                //44 navlink
import SideDrawer from './SideDrawer';            //45-mobile navigation
import Backdrop from '../UIElements/Backdrop';    //47-drawer state
import './MainNavigation.css';

export default function MainNavigation(props) {
  //47-drawer state
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const openDrawerHandler = () => setDrawerIsOpen(true);
  const closeDrawerHandler = () => setDrawerIsOpen(false);

  return (
    <React.Fragment>
      {/* 47-drawer state */}
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      {/* 45-mobile navlinks 48-animation*/}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">
            bluedot
        </Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
}
