import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { FiUnderline } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";




const Container = styled.div`
  position: absolute;
  color: #fff;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10px;
  background: #0000007d;
  font-weight: 600;
  height: 35px; 
  width: 80px;
`
const style = {
  display: "flex"
};

/**
 * 사진 Hover 했을때   컨트롤
 */

const Communitypicture =(props) =>  {

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  return (
    <Container>
 
        <div
          className={(isHovering == true) ? "PictureHovered" : ""}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
        {props.children}
        </div>
  
    </Container>
  );

}

export default Communitypicture;

