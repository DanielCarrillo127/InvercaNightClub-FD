import React from "react";
import "./SideBar.css";
import {
  IoStorefrontOutline,
  IoLogOutOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { FiTruck } from "react-icons/fi";

import { useHistory } from "react-router-dom";
import logoName from "../../Recursos/rayoprimoFA.svg"

function SideBar() {
  let history = useHistory();
  const HandleLogOut = () => {
    localStorage.clear();
    history.push("/login");
  };

  const HandleActive = () => {
    document.getElementById('circularMenu1').classList.toggle('active');
  };

  return (

    <div id="circularMenu1" className="circular-menu circular-menu-left">
      <p className="floating-btn"  onClick={() => HandleActive()}>
        {/* <IoBeerOutline className="nav__logo-icon" size={25} /> */}
        <img src={logoName} alt='logoname' width="40" height="60" />
      </p>
      <menu className="items-wrapper">
        <a href="/cashier" className="menu-item"><IoStorefrontOutline className="icon" size={25} /> </a>
        <a href="/storehouse" className="menu-item"> <FiTruck className="icon" size={25}  /></a>
        <a href="/dashboard" className="menu-item"> <IoPersonCircleOutline className="icon2" size={35} /></a>
        <p onClick={HandleLogOut} className="menu-item"><IoLogOutOutline className="icon2" size={32} /></p>
      </menu>
    </div>
  );
}

export default SideBar;
