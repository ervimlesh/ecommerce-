import React from "react";

import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import Navbar from "./Navbar";

import Slider from "react-slick";
import MenuHeader from "./Layout/MenuHeader";
const Header = () => {
  return (
    <>
      <Navbar />
      <MenuHeader />
      
    </>
  );
};

export default Header;
