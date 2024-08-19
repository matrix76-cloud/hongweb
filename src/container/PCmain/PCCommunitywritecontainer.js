import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { OPTIONTYPE, PCCOMMNUNITYMENU } from "../../utility/screen";
import Button from "../../common/Button";
import SelectItem from "../../components/SelectItem";
import "./PCmain.css"
import { CreateCommunity, CreateCommunitySummary } from "../../service/CommunityService";
import { USER_TMP_ID } from "../../utility/db";
import EditorEx from "../../common/EditorEx";
import { extractTextFromHTML, searchpos, searchposfrom, searchposfromto } from "../../utility/common";
import { FaWheatAwnCircleExclamation } from "react-icons/fa6";



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
const Inputstyle ={
  border: '1px solid #ededed',
  background: '#fff',
  borderRadius:'5px'
}


const PCCommunitywritecontainer =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const [category, setCategory] = useState('');
  const [label, setLabel] = useState('');
  const [body, setBody] = useState('');
  
 

  const onlabelChange =(e)=>{
    setLabel(e.target.value);
    setRefresh((refresh)=>refresh +1);
  }

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

    setCategory(category);
    setLabel(label);
    setBody(body);

    
    console.log("TCL: PCCommunitywritecontainer -> ",category, label, body );

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



  const _hanldesave = async()=>{

    const USER_ID = USER_TMP_ID;
    const LABEL = label;
    const CONTENT = body;

 
    let  COMMUNITYCATEGORY = category;

    if(COMMUNITYCATEGORY == ''){
      COMMUNITYCATEGORY =    PCCOMMNUNITYMENU.DAILYITEM;
    }

  
    console.log("TCL: _hanldesave -> COMMUNITYCATEGORY", COMMUNITYCATEGORY)

    const FindPos = searchpos(CONTENT, "src=");
    console.log("TCL: _hanldesave -> FindPos", CONTENT, FindPos)
    const LastPos = searchposfrom(CONTENT,FindPos + 5,'"' );
    console.log("TCL: _hanldesave -> LastPos", LastPos)

    let REPRESENTIMG = "";
    if(FindPos != -1){
      REPRESENTIMG = searchposfromto(CONTENT, FindPos+ 5, LastPos);
    }

    console.log("TCL: _hanldesave -> REPRESENTIMG", REPRESENTIMG)

    if(label == '' ){
      alert("제목을 입력해주세요");
      return;
    }

    if(body == '' ){
      alert("내용을 입력해주세요");
      return;
    }

    if(body.length < 100){
      alert("게시글은 100자 이상이어야 합니다");
      return;
    }

    const CONTENTSUMMARY = extractTextFromHTML(CONTENT);

    console.log("TCL: _hanldesave -> CONTENTSUMMARY", CONTENTSUMMARY)

    

    const community = await CreateCommunity({ USER_ID, LABEL,COMMUNITYCATEGORY, CONTENT, REPRESENTIMG });

    const COMMUNITY_ID = community;

    const communitysummary = await CreateCommunitySummary({ COMMUNITY_ID, USER_ID, LABEL,COMMUNITYCATEGORY, CONTENTSUMMARY, REPRESENTIMG });

    if(community != -1){
      alert("게시물이 정상적으로 등록 되었습니다");
      navigate("/PCcommunity");

    }else{
      alert("게시물이 정상적으로 등록 되지 못하였습니다");
    }
  

  }
  const _hanldesavetmp = ()=>{

  }
  const _hanldecancle = ()=>{
    
  }

  const selectcallback =(data)=>{
    setCategory(data);
    setRefresh((refresh) => refresh + 1);
  }



  return (
    <Container style={containerStyle}>
      <Column margin={'0px auto;'} width={'80%'} style={{alignItems:"flex-end"}} >
    
        <FlexstartRow height={'20px'} width={'100%'} style={{marginTop:40, paddingLeft:15}}>
            <HotTextMain>게시판 작성</HotTextMain>
        </FlexstartRow>
        <FlexstartRow height={'20px'} width={'100%'} style={{marginTop:40, paddingLeft:15}}>
          <SelectItem
            option={OPTIONTYPE.COMMNUNITYOPTION}
            callback={selectcallback}
          />
          <BetweenRow style={{width:"90%"}}>
            <div style={{color:"#788391", width:"60px"}}>제목</div>
            <input  style={Inputstyle} 
               value={label}
               onChange={onlabelChange}
              type="text" placeholder="게시판 제목을 입력해 주세요"/>
          </BetweenRow>
        </FlexstartRow>

        <div style={{marginTop:20, width:"100%"}}>
          <EditorEx setValue={_handleBody}/>
        </div>

        <FlexEndRow style={{width:"30%", marginBottom:30, marginTop:50,justifyContent:"space-between"}}>
        <Button onPress={_hanldesave} height={'40px'} width={'45%'} radius={'5px'} bgcolor={'#ededed'} color={'#222'} text={'저장'}/>
        <Button onPress={_hanldecancle} height={'40px'} width={'45%'} radius={'5px'} bgcolor={'#ededed'} color={'#222'} text={'취소'}/>
        </FlexEndRow>


      </Column>
    </Container>
  );

}

export default PCCommunitywritecontainer;

