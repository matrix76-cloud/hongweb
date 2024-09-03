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
import "./PcAiCommentPopup.css"
import { se } from "date-fns/locale";

import { model } from "../../api/config";
import Loading from "../../components/Loading";
import { useSleep } from "../../utility/common";
import { CreateSearch, ReadSearchByid, UpdateSearchByid } from "../../service/SearchService";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime } from "../../utility/date";

import TimeAgo from 'react-timeago';
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

const Popcontent = styled.div`
    width:100%;
    background:#fff;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    margin-top:10px;
`





const SaveButtonLayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 250px;
  margin: 0 auto;
  margin-top: 10px;
  margin-right: 20px;
`

const ResultContent = {
  width: '345px',
  height: '200px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Regular',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"1px solid #999",
  marginTop:10,
  fontFamily: 'Pretendard-Light'

}




const PcAiCommentpopup = ({ search_id,callback, top, left, height, width, basiccomment }) =>{
  const [open, setOpen] = useState(true);
  const [refresh, setRefresh] = useState(-1);
  const [comment, setComment] = useState('');

  const onAicommentChange = async (e) => {
    setComment(e.target.value);
    setRefresh((refresh) => refresh +1);
  }
  const handleClose = () => {
    setOpen(false);
    callback();
  };



  useEffect(() => {
    setComment(comment);
  
  }, [refresh]);

  useEffect(() =>{
    async function FetchData(){

    }
    FetchData();
  }, [])

  /**
   * Update 할때 Sleep 을 해줘야 한다
   */
  const _handleMemoSave = async() =>{

    const SEARCH_ID = search_id;

    let USERCOMMENT = "";
    if(basiccomment != undefined && basiccomment != ''){
      USERCOMMENT = basiccomment;
      USERCOMMENT +="\n";
    }
  
    USERCOMMENT += comment;
    console.log("TCL: _handleMemoSave -> USERCOMMENT", USERCOMMENT)
    
    const update = await UpdateSearchByid({SEARCH_ID, USERCOMMENT});

    alert("저장되었습니다");
    useSleep(1000);
    setOpen(false);
    callback();


  }
  const _handleMemoClose = () =>{
    setOpen(false);
    callback();
  }


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
          <Box sx={[style, style.top={top},style.left={left}, style.height={height}, style.width={width}] }>
            <Column style={{height:300, width:'100%', background:"#fff"}}>
              <Popcontent>
           
                <div style={{fontSize:16, width:350}}>검색 결과 에 추가해줄 메모를 적어서 추가해주세요</div>
                <textarea style={ResultContent} value={comment} onChange={onAicommentChange} />
         
              </Popcontent>

              <SaveButtonLayer>
                  
                  <div style={{fontSize:18, color :"#A16D6D", marginRight:20}} onClick={_handleMemoClose}>취소</div>

                  <div style={{fontSize:18, color :"#F75100"}} onClick={_handleMemoSave}>저장</div>
               
            

              </SaveButtonLayer>

            </Column>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default PcAiCommentpopup;