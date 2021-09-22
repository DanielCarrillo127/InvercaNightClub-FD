import React from "react";
import "./SideBar.css";
import {
  IoStorefrontOutline,
  IoLogOutOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { FiTruck } from "react-icons/fi";
import { SiCoffeescript } from "react-icons/si";
import { useHistory } from "react-router-dom";

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
        <SiCoffeescript className="nav__logo-icon" />
      </p>
      <menu className="items-wrapper">
        <a href="/cashier" className="menu-item"><IoStorefrontOutline className="icon2" size={35} /> </a>
        <a href="/storehouse" className="menu-item"> <FiTruck className="icon" size={30}  /></a>
        <a href="/dashboard" className="menu-item"> <IoPersonCircleOutline className="icon2" size={40} /></a>
        <p onClick={HandleLogOut} className="menu-item"><IoLogOutOutline className="icon2" size={35} /></p>
      </menu>
    </div>
  );
}

export default SideBar;
