import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Row } from "../common/Row";
import { UserContext } from "../context/User";



const Container = styled.div`

`
const style = {
  display: "flex"
};

const mapstyle = {
  position: "absolute",
  overflow: "hidden",
  top: '10%',
  width:'100%',
};

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


const CurrentMap =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    async function FetchData(){
    } 
    FetchData();
  }, [])
  useEffect(()=>{

  },[refresh])

 
  return (

    <Container style={containerStyle}>
   
      <Row>
        <div style={{display:"flex", width:'100%'}}>
          <div id="map" className="Map" style={mapstyle}></div>
        </div>  
      </Row>

    </Container>
  );

}

export default CurrentMap;

