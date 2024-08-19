import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { FiUnderline } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";




const Container = styled.div`
  font-size: 20px;
  color: ${({clickstatus}) => clickstatus == true ? ('#ff2a75') :('#959595') };
  fontweight: ${({clickstatus}) => clickstatus == true ? ('600') :('') };
  line-height: 66px;
  height: 66px;
  margin: 0 14px;
`
const style = {
  display: "flex"
};

/**
 * 메뉴를 Hover 했을때 컨트롤
 */

const Communitymenu =(props) =>  {

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
          className={(isHovering == true || props.clickstatus ==true) ? "CommunityMenuHovered" : ""}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
        {props.children}
        </div>
  
    </Container>
  );

}

export default Communitymenu;

