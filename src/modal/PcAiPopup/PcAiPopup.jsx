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
import "./PcAiPopup.css"
import { se } from "date-fns/locale";

import { model } from "../../api/config";
import Loading from "../../components/Loading";
import { useSleep } from "../../utility/common";
import { CreateSearch, DeleteSearchByid, ReadSearchByid } from "../../service/SearchService";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime } from "../../utility/date";

import TimeAgo from 'react-timeago';
import PcAiCommentpopup from "../PcAiCommentPopup/PcAiCommentPopup";
import { FaListCheck } from "react-icons/fa6";

import ReactTyped from "react-typed";

import { GrUploadOption } from "react-icons/gr";
import LottieAnimation from "../../common/LottieAnimation";
import TypingText from "../../common/TypingText";


const formatter = buildFormatter(koreanStrings); 

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

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
    height:77%;
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
  font-family: 'Pretendard-SemiBold',

`
const SearchContent={
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '530px',
  fontFamily: 'Pretendard-SemiBold',
  overflowY: "auto"
}

const ResultLayer = styled.div`
  width:771px;
  background:#FFF;
  height:100%;
`
const ResultContent = {
  width: '730px',
  height: '400px',
  padding: '20px 20px 0px 20px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",
  backgroundColor:"#f9f9f9"
}

const ResultContent1 = {
  width: '730px',
  height: '300px',
  padding: '20px 20px 0px 20px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",
  backgroundColor:"#f9f9f9"
}

const ResultContent2 = {
  width: '700px',
  height: '90px',
  padding: '10px 25px 0px 25px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"2px dotted #00B8A9",

}

const InputContent = {
  width:'600px',
  margin:'5px 10px',
  border :'none',
  borderRadius: '5px',
  backgroundColor :'#fff',
  fontFamily: 'Pretendard-Light'
}



const SearchDBKeyword = styled.div`
 
  font-family: 'Pretendard-Regular';
  display:flex;
  flex-direction:row;
  gap:6px;
  font-weight:500;
  font-size:18px;
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
  justify-content: center;
  align-items:center;
`
const MemoInfoblink = styled.div`
    position: relative;
    top: -100px;
    color: #242323;
    background-color: #f5f3f3;
    border: 1px solid #ededed;
    padding: 5px;
    font-size: 12px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    -ms-border-radius: 20px;
    -o-border-radius: 20px;
    border-radius: 20px;
    animation-duration: .2s;
    animation-name: point-move;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    min-width: 50px;
    text-align: right;
    width:22%;
    animation: box-ani 1s linear infinite;
    z-index: 5;
    display:flex;
    position: relative;
    left: 550px;


`
const SaveButtonLayer = styled.div`
  position: absolute;
  bottom: 50px;
  right: 10px;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 20px;
  margin-top:20px;
`

const KeywordMain = styled.div`
  font-weight : 700;
  font-size:20px;
  line-height:26px;
  color :#131313;
  padding:15px;
`
const SearchItem = styled.div`
  display:flex;
  flex-direction:column;
  background-color : ${({bgColor}) => bgColor};
  height:70px; 
  padding: 20px 15px;
`
const MemoButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height:44px;
  border: 1px solid #f75100;
  width: 118px;
  border-radius: 4px;



`

const PcAipopup = ({ search,callback, top, left, height, width }) =>{
  const [open, setOpen] = useState(true);
  const [currentloading, setCurrentloading] = useState(true);
  const [searchresult, setSearchresult] = useState('');

  const [searchitems, setSearchitems] = useState([]);
  const [search_id, setSearch_id] = useState('');
  const [search_comment, setSearch_comment] = useState('');

  const [refresh, setRefresh] = useState(-1);
  const [memoenable, setMemoenable] = useState(false);

  const [research, setResearch] = useState('');

  const handleClose = async() => {
    setOpen(false);
    callback();




  };

  const _handleMemo = () =>{
    setMemoenable(true);
    setRefresh((refresh) => refresh +1 );
  }


  useEffect(() => {
    setCurrentloading(currentloading);
    setSearchitems(searchitems);
    setSearchresult(searchresult);
    setMemoenable(memoenable);
    setSearch_id(search_id);
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
      console.log("TCL: FetchData -> searchitems", searchitemsTmp)

      setSearchitems(searchitemsTmp);

      if(search != ''){
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

      }else{
        _handleDBSearch(searchitemsTmp[0].SEARCH,searchitemsTmp);
      }
      setCurrentloading(false);
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
    // setSearch_id("");
    

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
    setResearch("");

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
   */
  const _handleDBSearch = (search, items) =>{

    const FindIndex = items.findIndex(x=>x.SEARCH == search);
    setSearch_id(items[FindIndex].SEARCH_ID);

    if(items[FindIndex].USERCOMMENT != undefined && items[FindIndex].USERCOMMENT != '' ){
      setSearch_comment(items[FindIndex].USERCOMMENT);
    }else{
      setSearch_comment('');
    }
 

    setSearchresult( items[FindIndex].CONTENT);
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
  return (
    <div>

      { memoenable == true ? (
        <PcAiCommentpopup callback={popupmemocallback}
        search_id ={search_id}
        basiccomment={search_comment}
        top={'40%'}  left={'40%'} height={'300px'} width={'380px'} image={imageDB.sample11}></PcAiCommentpopup>
      ) : null}




      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={[style, style.top={top},style.left={left}, style.height={height}, style.width={width}] }>
            <Column style={{height:700, width:'100%'}}>
              <Poptilt>
                <BetweenRow style={{width:"100%"}}>
                  <PopMainLabel>{'홍여사 AI가 궁금 하신 내용을 모두 알려드립니다'}</PopMainLabel>
                  <IconCloseView onClick={handleClose}><IoCloseSharp size={30} color={'#fff'}/></IconCloseView>
                </BetweenRow>
              </Poptilt>
              <Popcontent>
                <Row style={{height:"100%"}}>

                    {
                      currentloading == true ?
                      
                      (<LottieAnimation containerStyle={{zIndex:11}} animationData={imageDB.loadinglarge}/>) :(
                        <>
                          <SearchLayer>
                            <div style={SearchContent}>
                                <KeywordMain>{'검색어'}</KeywordMain>

                                <div style={{marginTop:10}}>
                                  {
                                    searchitems.map((data, index)=>(
                                      <SearchItem bgColor={ index % 2 == 0 ?("#fff") :('#F5FBFF')}>
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
                                          <TimeAgo date={getFullTime(data.CREATEDT)}formatter={formatter}
                                            style={{fontWeight:400, fontSize:14, color :"#A3A3A3"}}
                                          />
                                        </ControlLayer>

                                        <ControlLayer>
                                          <div  onClick={()=>{_handleMemoDelete(data.SEARCH_ID)}} style={{textDecoration:"underline", marginLeft:10, color:'#A16D6D', fontWeight:500}}>삭제</div>
                                        </ControlLayer>
                                      
                                      </Row>
                                  
                                      </SearchItem>
                                      ))
                                  }
                                </div>
                            </div>
                          </SearchLayer>

                          <ResultLayer>

                      

                            {
                              search_comment == '' ? ( 
                                <>
                                  {
                                    search_id == '' ?(    <TypingText text={searchresult} style={ResultContent} speed={50} />):(
                                      <textarea style={ResultContent} value={searchresult} />
                                    )
                                  }
                                </>
                          
                          
                              
                              ):(
                                <div>
                                  <textarea style={ResultContent1} value={searchresult} />
                                  <textarea style={ResultContent2} value={search_comment} />
                                  <div style={{position:'absolute', top: '454px',left: '314px'}}><img src={imageDB.memo} style={{width:20, height:20}}/></div>
                                </div>
                              )
                            }
                  
                            <Row>

                              <Column style={{width:"140px" , height:70}}>

                                <MemoButton onClick={_handleMemo}>
                                  <img src={imageDB.enablememo} style={{width:16, height:16}}/>
                                  <span style={{color :'#F75100', fontSize:16, paddingLeft:5}}>메모저장</span>

                                </MemoButton>
              
                              </Column>

                              <Column style={{width:"620px" , height:70}}>
                                <div style={{height:50}}>
                                <input type={'text'} style={InputContent} value={research}
                                  placeholder={'검색어로는 15자 이상 입력해주세요'}
                                  onKeyDown={handleKeyDown} 
                                  onChange={(e) => {
                                      setResearch(e.target.value);
                                      setRefresh((refresh) => refresh +1);
                                    }}/>
                                <div style={{position: "absolute",top: "560px",right: "30px"}}>
                                  {
                                    research.length < 15  ? ( <img src={imageDB.uploaddisable} style={{width:30}}/>) :(
                                      <img src={imageDB.uploadenable} style={{width:30}} onClick={AIResearch} />
                                    )
                                  }
                              
                                </div>
                              </div>
                              </Column>
                    
                        
                            </Row>
                            <FlexstartRow style={{height:40, paddingLeft:40, display:"flex", justifyContent:"flex-start", alignItems:"flex-start"}}
                            >
                              <img src ={imageDB.Up} style={{width:12, height:12}}/>
                              <div style={{color:"#00B8A9",fontSize:14, fontWeight:400, paddingLeft:5 }}>메모저장을 클릭하면 메모를 별도로 저장할 수 있습니다.</div>
                            </FlexstartRow>
                          
                          </ResultLayer>
                        </>
                      )
                    }


 
                
                </Row>

              </Popcontent>
        

            </Column>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default PcAipopup;