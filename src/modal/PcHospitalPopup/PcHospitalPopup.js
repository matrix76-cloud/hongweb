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
import "./PcHospitalPopup.css"
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
import Axios from "axios";


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
    overflow:auto;
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
const SpecialLayer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top:20px;
`
const SpecialItem = styled.div`
    margin: 5px;
    border-radius: 20px;
    height: 30px;
    padding: 5px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9f9f9;

`

const PcHospitalpopup = ({ search,callback, top, left, height, width, name,ykiho }) =>{
  console.log("TCL: PcHospitalpopup -> ykiho", ykiho)
  console.log("TCL: PcHospitalpopup -> name", name)
  const [open, setOpen] = useState(true);
  const [currentloading, setCurrentloading] = useState(true);


  const [refresh, setRefresh] = useState(-1);
  const [specialitem, setSpecialitem] = useState([]);
  const [facilityitem, setFacilityitem] = useState({});
  const [departmentitems, setDepartmentitems] = useState([]);
  const [equipmentitems, setEquipmentitems] = useState([]);

  const handleClose = async() => {
    setOpen(false);
    callback();
  };



  useEffect(() => {
    setCurrentloading(currentloading);



    const jsonPayload = {
      name: ykiho,
   
    };


    Axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/medicalspecial',  jsonPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) =>{

      if(response.data.response.body.items != undefined){
        setSpecialitem(response.data.response.body.items.item);
   
        setRefresh((refresh) => refresh +1);
      }

    })
    .catch((error) => console.error('Error:', error));



    Axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/medicalfacility',  jsonPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) =>{
      console.log("TCL: medicalfacility -> response", response.data.response.body.items.item)
      setFacilityitem(response.data.response.body.items.item);
      
      setRefresh((refresh) => refresh +1);
    })
    .catch((error) => console.error('Error:', error));


    Axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/medicaldepartment',  jsonPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) =>{
      console.log("TCL: medicaldepartment -> response", response.data.response.body.items.item)
      setDepartmentitems(response.data.response.body.items.item);
      
      setRefresh((refresh) => refresh +1);
    })
    .catch((error) => console.error('Error:', error));

    Axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/medicalequipment',  jsonPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) =>{
      console.log("TCL: medicalequipment -> response", response.data.response.body.items.item)
      setEquipmentitems(response.data.response.body.items.item);
      
      setRefresh((refresh) => refresh +1);
    })
    .catch((error) => console.error('Error:', error));


  }, []);

  /**
   * 데이타를 가져온다
   * 1) 무조건 데이타를 가져 와서 저장 해둔다
   * 2) 검색어가 있다면 zemini에 요청한다
   * 3) 검색 결과를 searchresult 에 저장 해두고 데이타 베이스에 입력한다
   * 4) 검색어가 없다면 처음에 가져온 데이타에서 첫번째 인덱스 값을 보여준다 
   */
  useEffect(() =>{
    async function FetchData(){

      setCurrentloading(false);
    }
  
    FetchData();

  }, [])









  return (
    <div>

      {
        currentloading == true && 
     

        <img src={imageDB.sample30} style={{width:100, height:100,
          zIndex:11,
          position:"absolute", top:'40%', left:'57%'}} />

      }


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
            <Column style={{height:700, width:'100%',background:"#fff"}}>
              <Poptilt>
                <BetweenRow style={{width:"100%"}}>
                  <PopMainLabel>{'선택하신 병원'}{name}{'정보에 대한 정보 입니다'}</PopMainLabel>
                  <IconCloseView onClick={handleClose}><IoCloseSharp size={30} color={'#fff'}/></IconCloseView>
                </BetweenRow>
              </Poptilt>
              <Popcontent>
                  <SpecialLayer>
                    {
                      specialitem.map((data, index)=>(
                
                          <SpecialItem>{data.srchCdNm}</SpecialItem>
                    
                      ))
                    }
                  </SpecialLayer>

                  <table>
                    <tbody>
                      {
                        departmentitems.map((data)=>(
                          <tr>
                            <td>{data.dgsbjtCdNm}</td>
                            <td>{data.dtlSdrCnt}</td>
                          </tr>

                        ))
                      }
                    </tbody>
                  </table>

                  <table>
                    <tbody>
                      {
                        equipmentitems.map((data)=>(
                          <tr>
                            <td>{data.oftCdNm}</td>
                            <td>{data.oftCnt}</td>
                          </tr>

                        ))
                      }
                    </tbody>
                  </table>
                
                  <table> 
                    <tbody>             
                      <tr>
                        <td>주소</td>
                        <td>{facilityitem.addr}</td>
                      </tr>     
                      <tr>
                        <td>병원등급</td>
                        <td>{facilityitem.clCdNm}</td>
                      </tr>  
                      <tr>
                        <td>구분</td>
                        <td>{facilityitem.aduChldSprmCnt}</td>
                      </tr> 
                      <tr>
                        <td>구분</td>
                        <td>{facilityitem.anvirTrrmSbdCnt}</td>
                      </tr> 

                      <tr>
                        <td>의사수</td>
                        <td>{facilityitem.addr}</td>
                      </tr> 
                      <tr>
                        <td>구분</td>
                        <td>{facilityitem.chldSprmCnt}</td>
                      </tr> 
                      <tr>
                        <td>홈페이지</td>
                        <td>{facilityitem.hospUrl}</td>
                      </tr>    
                      <tr>
                        <td>중증침대수</td>
                        <td>{facilityitem.hghrSickbdCnt}</td>
                      </tr>
                      <tr>
                        <td>전화번호</td>
                        <td>{facilityitem.telno}</td>
                      </tr>
                      <tr>
                        <td>침대수</td>
                        <td>{facilityitem.stdSickbdCnt}</td>
                      </tr>

          
                  

                    </tbody>
                  </table>
              </Popcontent>
            </Column> 
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default PcHospitalpopup;