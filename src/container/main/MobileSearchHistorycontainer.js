import React, { Fragment, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";
import styled from "styled-components";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";

import "../../screen/css/common.css";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { IoCloseSharp } from "react-icons/io5";
import Button from "../../common/Button";
import { FILTERITEMMONEY, FILTERITEMPERIOD, FILTERITMETYPE, LoadingType } from "../../utility/screen";

import { WORKNAME } from "../../utility/work";
import { ROOMSIZE, ROOMSIZEDISPALY } from "../../utility/room";

import { MdLockReset } from "react-icons/md";
import { imageDB } from "../../utility/imageData";

import { se } from "date-fns/locale";

import { model } from "../../api/config";
import Loading from "../../components/Loading";
import { useSleep } from "../../utility/common";
import { CreateSearch, DeleteSearchByid, ReadSearchByid } from "../../service/SearchService";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime } from "../../utility/date";

import TimeAgo from 'react-timeago';

import { FaListCheck } from "react-icons/fa6";

import ReactTyped from "react-typed";

import { GrUploadOption } from "react-icons/gr";
import { Navigation } from "react-calendar";
import { useNavigate } from "react-router-dom";


const formatter = buildFormatter(koreanStrings); 



const style = {
  position: "absolute",

};
const IconCloseView = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items:center;
  margin-right:20px;
`;



const Poptilt = styled.div`
  background-color: #FF7125;
  height: 58px;
  position: relative;
  width :100%;
  display:flex;
  justify-content:center;
  align-items:center;
`
const Popcontent = styled.div`
    height:100%;
    width:100%;
    background:#fff;
    font-family: 'Pretendard-Regular';
`

const PopMainLabel = styled.div`
  font-size: 20px;
  font-weight: 700;
  padding-left: 24px;
  line-height: 60px;
  color :#fff;

`

const SearchLayer = styled.div`
  width:309px; 
  background:#fff;
  height:100%;
  padding : "24px 1px 24px 24px";
  font-family: 'Pretendard-SemiBold',

`
const SearchContent={
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Pretendard-SemiBold',
  overflowY: "auto",
  width:"100%"
}

const EmptyLine = styled.div`
  height :1px;
  background:#ededed;
  width :100%;

`



const KeywordMain = styled.div`
  font-weight : 700;
  font-size:20px;
  line-height:26px;
  color :#131313;
`
const SearchDBKeyword = styled.div`
 
  font-family: 'Pretendard-Regular';
  display:flex;
  flex-direction:row;
  height:45px;
  gap:6px;
  font-weight:500;
  font-size:16px;
  line-height:23.4px;

  &:hover{
    text-decoration :underline;
  } 
`
const ControlLayer = styled.div`
  color: #A3A3A3;
  font-family: 'Pretendard-Regular';
  font-size: 14px;
  display:flex;
  flex-direction:row;
  height:14px;
  line-height:18.2px;
`

const MobileSearchHistorycontainer = ({ containerStyle }) =>{
  const navigation = useNavigate();

  const [searchitems, setSearchitems] = useState([]);
  const [refresh, setRefresh] = useState(1);

  const _handleMemoDelete = async(SEARCH_ID) =>{
  
    await DeleteSearchByid({SEARCH_ID});
   

    async function FetchData(){

      const USER_ID= "01062149756";

      let searchitemsTmp= await ReadSearchByid({USER_ID});
      console.log("TCL: FetchData -> searchitems", searchitemsTmp)

      setSearchitems(searchitemsTmp);

    }
  
    FetchData();

    setRefresh((refresh) => refresh +1);
  }
  const _handleDBSearch = async(search, items) =>{

    const FindIndex = items.findIndex(x=>x.SEARCH == search);

    navigation("/Mobilesearch",{state :{search_id :items[FindIndex].SEARCH_ID}});
  }

  /**
   * 데이타를 가져온다
   * 1) 무조건 데이타를 가져 온다
   */
  useEffect(() =>{
    async function FetchData(){

      const USER_ID= "01062149756";

      let searchitemsTmp= await ReadSearchByid({USER_ID});
      console.log("TCL: FetchData -> searchitems", searchitemsTmp)

      setSearchitems(searchitemsTmp);

    }
  
    FetchData();

  }, [])

  useEffect(()=>{
    setSearchitems(searchitems);
  },[refresh])


  return (
    <div>

      <Column style={{width:'100%'}}>

        <div style={SearchContent}>


            <div style={{marginTop:50}}>
              {
                searchitems.map((data)=>(
                  <div>
                    <FlexstartColumn style={{ marginTop:"10px", padding:"5px 24px", width:"85%"}}>
                      <FlexstartRow >
                        <SearchDBKeyword onClick={()=>{_handleDBSearch(data.SEARCH, searchitems)}}> 
                          {data.SEARCH.slice(0, 50)}
                          {data.SEARCH.length > 50 ? "..." : null}
                        </SearchDBKeyword> 
                      </FlexstartRow>
                      <Row style={{width:"100%", paddingTop:5, paddingBottom:10, justifyContent:"space-between"}}>                               
                        <ControlLayer>
                          {
                            data.USERCOMMENT != undefined && <img src={imageDB.memo} style={{width:'16px', height:'16px', marginRight:5}}/>
                          }
                          <TimeAgo date={getFullTime(data.CREATEDT)}formatter={formatter} style={{fontWeight:400, fontSize:14, color :"#A3A3A3"}}/>
                        </ControlLayer>
                        <ControlLayer>
                          <div  onClick={()=>{_handleMemoDelete(data.SEARCH_ID)}} style={{textDecoration:"underline", marginLeft:10, color:'#A16D6D', fontWeight:500}}>삭제</div>
                        </ControlLayer>           
                      </Row>
                    </FlexstartColumn>
                    <EmptyLine/>
                  </div>
                  ))
              }
            </div>
        </div>
      </Column>
    </div>
  );
};

export default MobileSearchHistorycontainer;