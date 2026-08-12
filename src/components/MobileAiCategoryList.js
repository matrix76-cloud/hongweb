import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";
import styled from "styled-components";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";

import "../screen/css/common.css";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { Column, FlexstartColumn } from "../common/Column";

import { imageDB } from "../utility/imageData";

import { se } from "date-fns/locale";

import { model } from "../api/config";
import Loading from "../components/Loading";
import { useSleep } from "../utility/common";
import { CreateSearch, DeleteSearchByid, ReadSearch, ReadSearchByid } from "../service/SearchService";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime } from "../utility/date";

import TimeAgo from 'react-timeago';

import { FaListCheck } from "react-icons/fa6";



import { GrUploadOption } from "react-icons/gr";
import LottieAnimation from "../common/LottieAnimation";
import TypingText from "../common/TypingText";
import { LoadingAnimationStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import { CiSearch } from "react-icons/ci";
import ButtonEx from "../common/ButtonEx";
import { UserContext } from "../context/User";
import { DeleteCATEGORYCONTENTByid, ReadCATEGORYCONTENT, UpdateCATEGORYCONTENTCOLORByid } from "../service/CategoryService";
import { RiDeleteBin5Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import { useNavigate } from "react-router-dom";

import { BsBookmarkCheck } from "react-icons/bs";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { getFontSize } from '../utility/fontsize';
const formatter = buildFormatter(koreanStrings); 


const Container = styled.div`
  background-color : #fff;
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh);
  touch-action: pan-y;

`

const BoxItem = styled.div`
  border: 1px solid #ededed;
  background: ${({bgcolor})=>bgcolor};
  padding: 10px 20px;
  font-size: ${() => getFontSize(14)}px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  &:active {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }
`

const KeywordItem = styled.div`
  font-size: ${() => getFontSize(16)}px;
  font-family: 'Pretendard-Bold';
  display : flex;
  flex-direction : row;
  justify-content : flex-start;
  align-items : center;
  color:#0D47A1
`
const DateItem = styled.div`
  font-size: ${() => getFontSize(13)}px;
  font-family: 'Pretendard-Light';
  color : #666;
  display : flex;
  flex-direction : row;
  justify-content : space-between;
  align-items : center;

`
const ControlButton = styled.div`
  font-size: ${() => getFontSize(12)}px;

  padding: 0px 3px;
  display: flex;
  flex-direction:row;
  justify-content:center;
  align-items:center;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  &:active {

    transform: scale(0.95); /* 눌렀을 때 크기 조정 */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }

`
const ColorButton = styled.div`
  background : ${({bgcolor}) => bgcolor};
  width:10px;
  height:10px;
  border-radius:10px;
  border : 1px solid #999;

`
const ContentLayer = styled.div`

    height: 100%;
    width: 90%;
    display: flex;
    flex-flow: wrap;
    flex-direction: row;
    justify-content: space-around;
    gap: 5px;
    display: grid;
    grid-template-columns: repeat(2, 50%);
    grid-gap: 10px;
    margin-top:70px;


`

const Mark = styled.div`

`


const MobileResultContent = {
  width: '95%',
  height: '440px',
  paddingLeft: '20px',
  marginBottom: '10px',
  color: '#66686F',
  fontSize: '14px',
  fontFamily: 'Pretendard-Regular',
  lineHeight: 2,
  outline: "none",
  resize: "none",
  border: "none",
  marginBottom: '10px',
  paddingLeft: '10px',
  paddingTop: '20px',

}

const IconCloseView = styled.div`
`
const CheckText = styled.div``



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
//   transform: 'translate(-50%, -50%)',
const modalstyle = {
  position: 'absolute',
  top: '90%',
  left: '50%',
  height: '120px',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  padding: '14px 34px',
  borderTopLeftRadius: "20px",
  borderTopRightRadius: "20px",
  zIndex: 100,
};


const PopupItem = styled.div`
  display : flex;
  flex-direction : row;
  justify-content :flex-start;
  align-items: center;
  font-size : 16px;
  font-family: Pretendard-SemiBold;
  height:50px;
`


const ONECOLOR = "#f9e0d38c";
const TWOCOLOR = "#9cd7fa";
const THREECOLOR = "#ffed08";
const FOURCOLOR = "#fff";

const MobileAiCategoryList = ({name}) =>{
  const { dispatch, user } = useContext(UserContext);
  const navigation = useNavigate();

  const [refresh, setRefresh] = useState(-1);
  const [contentitems1, setContentitems1] = useState([]);
  const [addpopup, setAddpopup] = useState(false);
  const [adjustpopup, setAdjustpopup] = useState(false);
  const [loading, setLoading] = useState(false);





  async function FetchData(){

    setLoading(true);
    const USERS_ID = user.USERS_ID;
    const CATEGORY = name;

    const items = await ReadCATEGORYCONTENT({ USERS_ID, CATEGORY });

    if (items != -1) {
      setContentitems1(items);  
    }


    setLoading(false);
    setRefresh((refrehs) => refresh +1);

  }
  useEffect(() =>{


    FetchData();

  }, [])

  const _handleContent = async(id, keyword, content, memoitems)=>{

    const CATEGORYCONTENT_ID = id;
    const KEYWORD = keyword;
    const CONTENT = content;
    const MEMOITEMS = memoitems


    navigation("/Mobileaicategorycontent", {state:{CATEGORYCONTENT_ID : CATEGORYCONTENT_ID,
      CONTENT : CONTENT,
      MEMOITEMS : MEMOITEMS,
      KEYWORD : KEYWORD}});
  }





  const _handleAdjust = async (id) => {

    setAdjustpopup(true);

  }

  const _handleColorChange = async(id, type)=>{
    setLoading(true);
    setRefresh((refresh) => refresh +1);
    const CATEGORYCONTENT_ID = id;
    let BGCOLOR = "";
    if(type == 1){
      BGCOLOR = ONECOLOR;
    }else if(type == 2){
      BGCOLOR = TWOCOLOR;
    }else if(type == 3){
      BGCOLOR = THREECOLOR;
    }else if(type == 4){
      BGCOLOR = FOURCOLOR;
    }
    const update = await UpdateCATEGORYCONTENTCOLORByid({CATEGORYCONTENT_ID, BGCOLOR});
    FetchData();
  }


  const ChangePopup = ({ callback, CATEGORYCONTENT_ID }) => {
    const [open, setOpen] = React.useState(true);
    const [categoryname, setCategoryname] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const { dispatch, user } = React.useContext(UserContext);


    const _handleDelete = async (id) => {
      setLoading(true);
      const CATEGORYCONTENT_ID = id;
      const Delete = await DeleteCATEGORYCONTENTByid({ CATEGORYCONTENT_ID });
      FetchData();
    }

    const _handleChange = async (id) => {

    }


    const handleClose = async () => {

      setOpen(false);
      callback();
      setRefresh((refresh) => refresh + 1);
    }

    const _handleChangePopupClose = () => {
      setOpen(false);
      callback();
      setRefresh((refresh) => refresh + 1);
    }
    useEffect(() => {
      setOpen(open);
      setLoading(loading);
    }, [refresh])

    return (
      <Container>

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
            <Box sx={modalstyle}>

              <BetweenRow>
                <div style={{ fontFamily: "Pretendard-SemiBold", fontSize: () => getFontSize(20) }}>색상변경</div>
                <IconCloseView onClick={_handleChangePopupClose}>
                  <img src={imageDB.ic_common_close_bottomsheet_24} style={{ width: 24 }} />
                </IconCloseView>
              </BetweenRow>



            </Box>
          </Fade>
        </Modal>

  

      </Container>
    );
  }

  const AdjustPopup = ({ callback, CATEGORYCONTENT_ID }) => {
    const [open, setOpen] = React.useState(true);
    const [categoryname, setCategoryname] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const { dispatch, user } = React.useContext(UserContext);
    const [changepopup, setChangepopup] = React.useState(false);


    const _handleDelete = async (id) => {
      setLoading(true);
      const CATEGORYCONTENT_ID = id;
      const Delete = await DeleteCATEGORYCONTENTByid({ CATEGORYCONTENT_ID });
      FetchData();
    }

    const _handleChange = async (id) => {
      setChangepopup(true);
      setRefresh((refresh) => refresh + 1);
    }


    const handleClose = async () => {

      setOpen(false);
      callback();
      setRefresh((refresh) => refresh + 1);
    }

    const _handleAddPopupClose = () => {
      setOpen(false);
      callback();
      setRefresh((refresh) => refresh + 1);
    }

    const changepopupclose = () => {
      setOpen(false);
      callback();
      setRefresh((refresh) => refresh + 1);   
    }
    useEffect(() => {
      setOpen(open);
      setLoading(loading);
      setChangepopup(changepopup);
    }, [refresh])

    return (
      <div>

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
            <Box sx={modalstyle}>

              <BetweenRow>
                <div style={{ fontFamily: "Pretendard-SemiBold", fontSize: () => getFontSize(20) }}>결과 삭제</div>
                <IconCloseView onClick={_handleAddPopupClose}>
                  <img src={imageDB.ic_common_close_bottomsheet_24} style={{ width: 24 }} />
                </IconCloseView>
              </BetweenRow>

              <FlexstartColumn style={{ marginTop: 15 }}>
                {/* <PopupItem onClick={() => { _handleChange(CATEGORYCONTENT_ID) }}>
                  <img src={imageDB.ic_common_etc_color} style={{width:24}}/>
                  <div style={{paddingLeft:10}}>색상 변경</div>
                </PopupItem> */}
                <PopupItem onClick={() => { _handleDelete(CATEGORYCONTENT_ID) }}>
                  <img src={imageDB.ic_common_etc_del} style={{ width: 24 }} />
                  <div style={{ paddingLeft: 10 }}>삭제</div>
                </PopupItem>

              </FlexstartColumn>

              
              {
                changepopup === true && <ChangePopup callback={changepopupclose} CATEGORYCONTENT_ID={data.CATEGORYCONTENT_ID} />
              }

         
            </Box>
          </Fade>
        </Modal>
      </div>
    );
  }


  const adjustpopupclose = () => {
    setAdjustpopup(false);
    setRefresh((refresh) => refresh + 1);
  }


  
  return (
    <Column style={{width:'100%', margin: '0 auto'}}>

    {loading == true && <LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loading}
      width={"50px"} height={'50px'}/>
    }
      
  

    <Row style={{alignItems:"unset"}}>

    <ContentLayer>
    {
      contentitems1.map((data, index)=>(
        <Column>
          <BoxItem bgcolor={'#E3F2FD'} >
          <KeywordItem>
              {data.KEYWORD.slice(0,16)}
              {data.KEYWORD.length > 16 ? "..." : null}
          </KeywordItem>
  
            <div style={{ height: 120, color:"#0D47A1" }} onClick={() => {
              _handleContent(data.CATEGORYCONTENT_ID,
                data.KEYWORD, data.CONTENT, data.MEMOITEMS)
            }}>
            {data.CONTENT.slice(0, 80)}
            {data.CONTENT.length > 80 ? "..." : null}
            </div>
            <BetweenRow style={{marginTop:40}}>

              <DateItem>
                <div><TimeAgo date={getFullTime(data.CREATEDT)} formatter={formatter} /></div>

                {/* {
                  data.MEMOITEMS.length != 0 && <Mark> <BsBookmarkCheckFill color={'#ff7e19'} /></Mark>
                } */}
              </DateItem>
              <FlexEndRow style={{ width: "30%"}}>

                {
                  data.BGCOLOR === '#f9e0d38c' && <ControlButton>
                    <ColorButton bgcolor={'#FEF3FF'}  />
                  </ControlButton>
                }


                {
                  data.BGCOLOR === '#069ffa' && <ControlButton>
                    <ColorButton bgcolor={'#FEF3FF'}  />
                  </ControlButton>
                }


                {
                  data.BGCOLOR === '#FFEEB6' && <ControlButton>
                    <ColorButton bgcolor={'#FEF3FF'}/>
                  </ControlButton>
                }



                {
                  data.BGCOLOR === '#fff' && <ControlButton>
                    <ColorButton bgcolor={'#FEF3FF'} />
                  </ControlButton>
                }

                {/* {
                  data.BGCOLOR === '#fff' &&

                  <ControlButton>
                    <ColorButton bgcolor={'#fff'} onClick={() => { _handleColorChange(data.CATEGORYCONTENT_ID, 4) }} />
                  </ControlButton>
                } */}


                <ControlButton>
                  <HiOutlineAdjustmentsHorizontal onClick={() => { _handleAdjust(data.CATEGORYCONTENT_ID) }} />
                </ControlButton>


              </FlexEndRow>

            </BetweenRow>

        </BoxItem>

          
          {
            adjustpopup === true && <AdjustPopup callback={adjustpopupclose} CATEGORYCONTENT_ID={data.CATEGORYCONTENT_ID} />
          }


      </Column>
      ))
            
            
    }
    </ContentLayer>





    </Row>
    <div style={{height:200}}/>
    

    </Column> 
  );
};

export default MobileAiCategoryList;