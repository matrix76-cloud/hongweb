import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { FiUnderline } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";




const Container = styled.div`
  font-size:20px;
  color:#3f4850;
  width:10%;
  texg-align:center;
  display:flex;
  justify-content:center;
  flex-direction:row;
  align-items:center;
  height: 38px;
  line-height: 38px;
  font-size: 16px;
`
const style = {
  display: "flex"
};

/**
 * 메뉴를 Hover 했을때  밑줄 표시 되는 컨트롤
 */

const Categorymenu =(props) =>  {

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  return (
    <Container onClick={()=>{props.callback(props.menu)}}>
 
        <div
          className={(isHovering == true || props.clickstatus ==true) ? "CategoryMenuHovered" : ""}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
        {props.children}
        </div>
  
    </Container>
  );

}

export default Categorymenu;

