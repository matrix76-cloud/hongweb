import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
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
import LottieAnimation from "../../common/LottieAnimation";
import TypingText from "../../common/TypingText";


const formatter = buildFormatter(koreanStrings); 



const style = {
  position: "absolute",

};

const Popcontent = styled.div`
    height:100%;
    width:100%;
    background:#fff;
    font-family: 'Pretendard-Regular';
`


const ResultLayer = styled.div`
  width:100%;
  background:#FFF;
  height:100%;
`
const ResultContent = {
  width: "80%",
  margin: "0px auto",
  height: "900px",
  padding: "80px 20px 20px 20px",
  fontSize: "16px",
  fontFamily: "Pretendard",
  lineHeight: 2,
  outline: "none",
  resize: "none",
  border: "none",
  backgroundColor: "#fff"
}

const InputContent = {
  width:'95%',
  margin:'5px auto',
  border :'1px solid #dadada',
  borderRadius: '5px',
  backgroundColor :'#fff',
  fontFamily: 'Pretendard-Light',
  flex: '0 0 auto',
}





const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "35%",
  left: "35%"
}



const MobileSearchcontainer = ({ search, search_id }) =>{

   console.log("TCL: MobileSearchcontainer -> SEARCH", search, search_id)

  const [open, setOpen] = useState(true);
  const [currentloading, setCurrentloading] = useState(true);
  const [searchresult, setSearchresult] = useState('');
  const [searchitems, setSearchitems] = useState([]);
  const [search_comment, setSearch_comment] = useState('');

  const [refresh, setRefresh] = useState(-1);
  const [memoenable, setMemoenable] = useState(false);

  const [research, setResearch] = useState('');
  const inputRef = useRef(null);


  const _handleMemo = () =>{
    setMemoenable(true);
    setRefresh((refresh) => refresh +1 );
  }

  useEffect(() => {
    const handleResize = () => {
      if (document.activeElement === inputRef.current) {
          setTimeout(() => {
              inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
    };

  }, []);



  useEffect(() => {
    setCurrentloading(currentloading);
    setSearchitems(searchitems);
    setSearchresult(searchresult);
    setMemoenable(memoenable);

    setSearch_comment(search_comment);
    setResearch(research);

  }, [refresh]);

  /**
   * 데이타를 가져온다
   * 1) 무조건 데이타를 가져 와서 저장 해둔다
   * 2) 검색어가 있다면 zemini에 요청한다
   * 3) 검색 결과를 searchresult 에 저장 해두고 데이타 베이스에 입력한다
   * 4) 검색어가 없다면 처음에 가져온 데이타에서 첫번째 인덱스 값을 보여준다 
   */
  useEffect(() =>{
    async function FetchData(){

      const USER_ID= "01062149756";

      let searchitemsTmp= await ReadSearchByid({USER_ID});
      console.log("TCL: FetchData -> search_id,search ", search_id, search)

      setSearchitems(searchitemsTmp);

      if(search != '' && search != undefined){
        setCurrentloading(true);
        const result = await model.generateContent(search);
        const response = result.response;
        const text = response.text();
        console.log("TCL: FetchData -> text", text)
  
        setSearchresult(text);
  
        const SEARCH = search;
        const CONTENT = text;
  
       await CreateSearch({USER_ID, SEARCH, CONTENT});

        searchitemsTmp= await ReadSearchByid({USER_ID});
        console.log("TCL: FetchData -> searchitems", searchitemsTmp)
  
        setSearchitems(searchitemsTmp);

        setCurrentloading(false);

      }else{
        if(search_id == '' || search_id == undefined ){

          setCurrentloading(false);
          // _handleDBSearch(searchitemsTmp[0].SEARCH,searchitemsTmp);
        }else{
          const FindIndex = searchitemsTmp.findIndex(x=>x.SEARCH_ID == search_id);
          let  AddComment = searchitemsTmp[FindIndex].CONTENT;

          if(searchitemsTmp[FindIndex].USERCOMMENT != undefined){
            AddComment +="\n";
            AddComment +="[사용자 메모]";
            AddComment +="\n";
            AddComment +=searchitemsTmp[FindIndex].USERCOMMENT;
          }
          setSearchresult(AddComment);
          setCurrentloading(false);

          setRefresh((refresh) => refresh +1);
        }

      }

    }
  
    FetchData();

  }, [])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {

      if(research.length > 15){
        AIResearch();
      }

    }
  };


  const AIResearch = async() =>{

    const USER_ID= "01062149756";

    setCurrentloading(true);
    setSearchresult("");
    

    const result = await model.generateContent(research);
    const response = result.response;
    const text = response.text();
    console.log("TCL: FetchData -> text", text)

    setSearchresult(text);

    const SEARCH = research;
    const CONTENT = text;

    await CreateSearch({USER_ID, SEARCH, CONTENT});

    const searchitemsTmp= await ReadSearchByid({USER_ID});
    console.log("TCL: FetchData -> searchitems", searchitemsTmp)

    setSearchitems(searchitemsTmp);
    //setResearch("");

    setCurrentloading(false);
    setRefresh((refresh) => refresh +1);
  }


  const _handlecurrentloadingcallback = async()=> {
    setRefresh((refresh) => refresh +1);
  }


  /**
   * 사용자가 죄측 리스트에서 검색 내용을 클릭햇을때 호출 되는 함수
   * ! 클릭하면서 SEARCH_ID, USERCOMMENT 를 저장해두자(나중에 USERCOMMENT에 내용을 추가 하기 위해)
   * ! 결과값을 USERCOMMENT 를 포함해서 표현
   * ! TODO 우선 사용 하지 않기로 함 검색어를 누르지 않고 검색 할 경우 그냥 결과 화면이 아무것도 안나오게 함
   */
  const _handleDBSearch = (search, items) =>{

    const FindIndex = items.findIndex(x=>x.SEARCH == search);

    setSearch_comment(items[FindIndex].USERCOMMENT);

    let AddComment = items[FindIndex].CONTENT;

    if(items[FindIndex].USERCOMMENT != undefined){
      AddComment +="\n";
      AddComment +="[사용자 메모]";
      AddComment +="\n";
      AddComment +=items[FindIndex].USERCOMMENT;
    }

    setSearchresult(AddComment);
    setRefresh((refresh) => refresh +1);
  }


  /**
   * 상세 메모창이 닫았을때 데이타 로딩값을 다시 로딩
   */
  const popupmemocallback = async () => {
    setMemoenable(!memoenable);
 
    const USER_ID= "01062149756";

    let searchitemsTmp= await ReadSearchByid({USER_ID});
    console.log("TCL: FetchData -> popupmemocallback", searchitemsTmp)
    setSearchitems(searchitemsTmp);
    setRefresh((refresh) => refresh +1);
  };

   /**
   * 메모삭제
   */
  const _handleMemoDelete = async(SEARCH_ID) =>{
    await DeleteSearchByid({SEARCH_ID});
    const FindIndex = searchitems.findIndex(x=>x.SEARCH_ID == SEARCH_ID);

    searchitems.splice(FindIndex, 1);

    setRefresh((refresh) => refresh +1);
  }

  const scrollToInput = () => {
    console.log("TCL: scrollToInput -> ", )
   // 요소를 화면 중앙에 위치시킴
    inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 추가적인 스크롤을 통해 요소를 화면 중앙보다 아래로 위치시킴
    setTimeout(() => {
        window.scrollBy(0, 550); // 스크롤을 250px 아래로 추가 이동
    }, 300); // smooth 스크롤의 애니메이션 시간이 약간의 지연을 줌

  }
  
  return (
    <div>

      {/* { memoenable == true ? (
        <PcAiCommentpopup callback={popupmemocallback}
        search_id ={search_id}
        basiccomment={search_comment}
        top={'40%'}  left={'40%'} height={'300px'} width={'380px'} image={imageDB.sample11}></PcAiCommentpopup>
      ) : null} */}


      {
        currentloading == true ? ( <LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loading}
          width={"100px"} height={'100px'}
          />) :(<Column style={{width:'95%', margin: '0 auto'}}>
          <Popcontent>
            <Row style={{height:"100%"}}>
              <ResultLayer>

                <div   style={{height:60, width:'95%', margin:'60px auto 10px', display:"flex"}}>
                  <input type={'text'} style={InputContent} value={research}
                    class="input"
                    placeholder={'검색어로는 10자 이상 입력해주세요'}
                    onKeyDown={handleKeyDown} 
                    onChange={(e) => {
                        setResearch(e.target.value);
                        setRefresh((refresh) => refresh +1);
                      }}/>
                  <div style={{position: "relative", right:"30px", top:"17px"}}>
                    {
                      research.length < 10  ? ( <img src={imageDB.uploaddisable} style={{width:24}}/>) :(
                        <img src={imageDB.uploadenable} style={{width:24}} onClick={AIResearch} />
                      )
                    }
                  
                  </div>
                </div>

                <TypingText ref={inputRef}  text={searchresult} style={ResultContent} speed={20} mobile={true} />
  
        
              </ResultLayer>
            
            </Row>
  
          </Popcontent>
          </Column>)
      }

    </div>
  );
};

export default MobileSearchcontainer;