import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../context/User";


import { CiHeart } from "react-icons/ci";
import { USELAW } from "../utility/law";
import { BetweenRow, Row } from "../common/Row";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp  } from "react-icons/io";
import { ref } from "firebase/storage";
import LazyImage from "../common/LasyImage";
import { imageDB } from "../utility/imageData";
import LazyGuideImage from "../common/LasyGuideImage";
import { Column } from "../common/Column";
import { getFontSize } from '../utility/fontsize';

const Container = styled.div`
  width: 70%;
  margin: 50px auto;
  font-size: ${() => getFontSize(18)}px;
  flex-wrap: wrap;
  display: flex;
  flex-direction:row;
  justify-content: space-around;

`
const RowItem = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    border-bottom: 1px solid #ededed; 
    padding-bottom:20px;
    padding-top:20px;
`
const ColumnItem = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
    border-bottom: 1px solid #ededed; 
    padding-bottom:20px;
    padding-top:20px;
`
const Indexno = styled.div`
    color: #849dd2;
    font-weight: 600;
`
const Label  = styled.div`
    margin-left:20px;
`


const style = {
  display: "flex"
};

const CommunityKnow =({containerStyle}) =>  {

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


  const _handleView = (index)=>{

    if(USELAW[index].OPEN == true){
        USELAW[index].OPEN = false;
    }else{
        USELAW[index].OPEN = true;
    }

    setRefresh((refresh) => refresh +1);

  }
 
  return (

    <Container>
    <LazyGuideImage width={'45'} src={imageDB.community1} containerStyle={{width:"100%",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'45'} src={imageDB.community2} containerStyle={{width:"100%",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'45'} src={imageDB.community3} containerStyle={{width:"100%",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'45'} src={imageDB.community4} containerStyle={{width:"100%",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'45'} src={imageDB.community5} containerStyle={{width:"100%",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'45'} src={imageDB.community6} containerStyle={{width:"100%",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'45'} src={imageDB.community7} containerStyle={{width:"100%",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'45'} src={imageDB.community8} containerStyle={{width:"100%",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'45'} src={imageDB.community9} containerStyle={{width:"100%",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>

    </Container>
  );

}

export default CommunityKnow;

