import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { PCCOMMNUNITYMENU } from "../../utility/screen";

import Button from "../../common/Button";
import { DeleteCommunityByid, DeleteCommunitySummaryByid, ReadCommunityByid, UpdateCommunityByid, UpdateCommunitySummaryByid } from "../../service/CommunityService";
import SelectItem from "../../components/SelectItem";
import { ListItem } from "@mui/material";
import "./PCmain.css"
import EditorEx from "../../common/EditorEx";
import { extractTextFromHTML, searchpos, searchposfrom, searchposfromto, useSleep } from "../../utility/common";

import TimeAgo from 'react-timeago';
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime } from "../../utility/date";

const formatter = buildFormatter(koreanStrings); 



const Container = styled.div`
  background-color : #fff;
`
const style = {
  display: "flex"
};



const HotTextMain = styled.div`
  font-size: 20px;
  color: #959595
  fontweight: 600;
  line-height: 66px;
  height: 66px;

`
const TagDisplay = styled.div`
  font-size: 18px;
  margin-right: 10px;
  border: 1px solid #ededed;
  width: 100px;
  padding: 5px;
  border-radius: 20px;
  background: #ff8400;
  color: #fff;
  display: flex;
  justify-content: center;

`

const Inputstyle ={
  border: '1px solid #ededed',
  background: '#fff',
  borderRadius:'5px'
}


const PCCommunityreadcontainer =({containerStyle, COMMUNITY_ID, COMMUNITYSUMMARY_ID}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [communityitem, setCommunityitem] = useState({});
  const [label, setLabel] = useState('');
  const [adjuststatus, setAdjuststatus] = useState(false);
 
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  useEffect(()=>{
    async function FetchData(){

      const communitydata = await ReadCommunityByid({COMMUNITY_ID});
      console.log("TCL: FetchData  ReadCommunityByid -> ", communitydata);
      setCommunityitem(communitydata);
      setLabel(communitydata.LABEL);
      setBody(communitydata.CONTENT);
      setRefresh((refresh)=>refresh +1);
    } 
    FetchData();
  }, [])

  const onlabelChange =(e)=>{
    setLabel(e.target.value);
    setRefresh((refresh)=>refresh +1);
  }


  useEffect(()=>{
    setAdjuststatus(adjuststatus);
    setLabel(label);
    setBody(body);
  },[refresh])


  /**
   * Editor 에서 변경된 데이타 callback
   * 
   */
  const _handleBody = (data) =>{

    console.log("TCL: _handleBody -> data", data);
    setBody(data);
    setRefresh((refresh) => refresh +1);

  }

  /**
   * 
   * 업데이트를 진행하자
   */
  const _hanldesave = async()=>{

    const LABEL = label;
    const CONTENT = body;

    let  COMMUNITYCATEGORY = category;

    if(COMMUNITYCATEGORY == ''){
      COMMUNITYCATEGORY =  PCCOMMNUNITYMENU.DAILYITEM;
    }

  
    console.log("TCL: _hanldesave -> COMMUNITYCATEGORY", label)

    const FindPos = searchpos(CONTENT, "src=");
    console.log("TCL: _hanldesave -> FindPos", CONTENT, FindPos)
    const LastPos = searchposfrom(CONTENT,FindPos + 5,'"' );
    console.log("TCL: _hanldesave -> LastPos", LastPos);


    let REPRESENTIMG = "";
    if(FindPos != -1){
      REPRESENTIMG = searchposfromto(CONTENT, FindPos+ 5, LastPos);
    }

    console.log("TCL: _hanldesave -> REPRESENTIMG", REPRESENTIMG)

    const CONTENTSUMMARY = extractTextFromHTML(CONTENT);

    const community = await UpdateCommunityByid({ COMMUNITY_ID, LABEL, CONTENT, REPRESENTIMG });

    const communitysummary = await UpdateCommunitySummaryByid({ COMMUNITYSUMMARY_ID, LABEL, CONTENTSUMMARY, REPRESENTIMG });

    if(community == 0){
   
      navigate("/PCcommunity");
      alert("게시물이 정상적으로 업데이트 되었습니다");

    }else{
      alert("게시물이 정상적으로 업데이트 되지 못하였습니다");
    }



    setRefresh((refresh) => refresh +1);
  }

  /**
   * 모드만 수정모드로 변환 해준다
   */
  const _hanldeadjust = ()=>{
    setAdjuststatus(true);
    setRefresh((refresh) => refresh +1);

  }

  /**
   * 삭제를 진행한다
   */
  const _hanldedelete = async()=>{

    const community = await DeleteCommunityByid({COMMUNITY_ID});

    const communitysummary = await DeleteCommunitySummaryByid({COMMUNITYSUMMARY_ID});

    if(community == 0){
   
      navigate("/PCcommunity");
      alert("게시물이 정상적으로 삭제 되었습니다");

    }else{
      alert("게시물이 정상적으로 삭제 되지 못하였습니다");
    }


  }
  



  return (
    <Container style={containerStyle}>
      <Column margin={'0px auto;'} width={'80%'} style={{alignItems:"flex-end"}} >
    

        { adjuststatus == false &&
          <>
            <FlexstartRow height={'20px'} width={'100%'} style={{marginTop:30, paddingLeft:15,
                paddingBottom: '10px'}}>
                <TagDisplay>{communityitem.COMMUNITYCATEGORY}</TagDisplay>
                <div style={{fontSize:20,fontWeight:700}}>{communityitem.LABEL}</div>

                <FlexstartRow style={{marginLeft:30}}>
                  <div>
                    <img src={imageDB.sample2} style={{width:'40px'}}/>
                  </div>
                  <div>관리자</div>
                  <div><TimeAgo date={getFullTime(communityitem.CREATEDT)}formatter={formatter}/></div>
                </FlexstartRow>

            </FlexstartRow>

            <FlexstartRow width={'100%'} style={{marginTop:10, paddingLeft:15, border:"1px solid #ededed"}}>
                <div
                  style={{ padding: "50px 0px", backgroundColor: "#fff" }}
                  dangerouslySetInnerHTML={{ __html: communityitem.CONTENT }}
                ></div>
            </FlexstartRow>
            </>
        }
        { adjuststatus == true &&
          <>
              <FlexstartRow height={'20px'} width={'100%'} style={{marginTop:40, paddingLeft:15}}>
          
                  <BetweenRow style={{width:"90%"}}>
                    <div style={{color:"#788391", width:"60px"}}>제목</div>
                    <input  style={Inputstyle} 
                      value={label}
                      onChange={onlabelChange}
                      type="text" placeholder="게시판 제목을 입력해 주세요"/>
                  </BetweenRow>
              </FlexstartRow>

              <div style={{marginTop:20, width:"100%"}}>
                <EditorEx value ={communityitem.CONTENT} setValue={_handleBody}/>
              </div>
            </>
        }



        <FlexEndRow style={{width:"30%", marginBottom:30, marginTop:50,justifyContent:"space-between"}}>
        <Button onPress={_hanldesave} height={'40px'} width={'45%'} radius={'5px'} bgcolor={'#ededed'} color={'#222'} text={'저장'}/>
        <Button onPress={_hanldeadjust} height={'40px'} width={'45%'} radius={'5px'} bgcolor={'#ededed'} color={'#222'} text={'수정'}/>
        </FlexEndRow>


      </Column>
    </Container>
  );

}

export default PCCommunityreadcontainer;

