import * as React from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";
import styled from "styled-components";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";

import "../../screen/css/common.css";
import { BetweenRow, FlexEndRow, FlexstartRow } from "../../common/Row";
import { Column } from "../../common/Column";
import { IoCloseSharp } from "react-icons/io5";
import Button from "../../common/Button";
import { FILTERITEMMONEY, FILTERITEMPERIOD, FILTERITMETYPE } from "../../utility/screen";
import "./PcFilterPopup.css";
import { WORKNAME } from "../../utility/work";
import { ROOMSIZE, ROOMSIZEDISPALY } from "../../utility/room";

import { MdLockReset } from "react-icons/md";
import { imageDB } from "../../utility/imageData";

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
  top: "10%",
  left: "50%",
  height: "600px",
  transform: "translate(-50%, -50%)",
  width: "600px",
};
const IconCloseView = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items:center;
  margin-right:30px;
`;



const Poptilt = styled.div`
  border-top-left-radius :15px;
  border-top-right-radius :15px;
  background-color: #fafafa;
  height: 12%;
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
`
const Popbottom = styled.div`
    height:12%;
    width:100%;
    background:#fafafa;
    border-bottom-left-radius :15px;
    border-bottom-right-radius :15px;
    display:flex;
`
const PopMainLabel = styled.div`
  font-size: 20px;
  font-weight: 600;
  padding-left: 50px;
  line-height: 60px;

`
const CheckButton = styled.div`
  color: ${({clickstatus}) => clickstatus == true ? ('#f32a89') :('#777070') };
  background: ${({clickstatus}) => clickstatus == true ? ('#ffecf2') :('#f7f7f7') };
  font-weight: ${({clickstatus}) => clickstatus == true ? ('600') :('600') };
  padding: 5px 10px;
  border-radius: 10px;
  margin-left: 10px;
  box-shadow: inset 0 0 5px #fff;
  transition: .2s all;
  font-size: 14px;
  height: 36px;
  line-height: 34px;
  border-radius: 5px;
  margin-bottom:10px;
  display:flex;
  justify-content:center;
  align-items:center;


`
const CheckButton2 = styled.div`
  color: ${({clickstatus}) => clickstatus == true ? ('#f32a89') :('#777070') };
  background: ${({clickstatus}) => clickstatus == true ? ('#ffecf2') :('#fff') };
  font-weight: ${({clickstatus}) => clickstatus == true ? ('600') :('600') };
  border: ${({clickstatus}) => clickstatus == true ? ('null') :('1px solid #ededed') };
  padding: 5px 10px;
  border-radius: 10px;
  margin-left: 10px;
  box-shadow: inset 0 0 5px #fff;
  transition: .2s all;
  font-size: 14px;
  height: 36px;
  line-height: 34px;
  border-radius: 5px;
  margin-bottom:10px;
  display:flex;
  justify-content:center;
  align-items:center;


`

const WorkItems=[
  {name : WORKNAME.HOMECLEAN, img:imageDB.house},
  {name :WORKNAME.BUSINESSCLEAN, img:imageDB.business},
  {name :WORKNAME.MOVECLEAN, img:imageDB.move},
  {name :WORKNAME.FOODPREPARE, img:imageDB.cook},
  {name :WORKNAME.ERRAND, img:imageDB.help},
  {name :WORKNAME.GOOUTSCHOOL, img:imageDB.gooutschool},
  {name :WORKNAME.BABYCARE, img:imageDB.babycare},
  {name :WORKNAME.LESSON, img:imageDB.lesson},
  {name :WORKNAME.PATIENTCARE, img:imageDB.patientcare},
  {name :WORKNAME.CARRYLOAD, img:imageDB.carry},
  {name :WORKNAME.GOHOSPITAL, img:imageDB.hospital},
  {name :WORKNAME.RECIPETRANSMIT, img:imageDB.recipe},
  {name :WORKNAME.GOSCHOOLEVENT, img:imageDB.schoolevent},
  {name :WORKNAME.SHOPPING, img:imageDB.shopping},
  {name :WORKNAME.GODOGHOSPITAL, img:imageDB.doghospital},
  {name :WORKNAME.GODOGWALK, img:imageDB.dog},
]


const RoomItems =[
  ROOMSIZE.SMALL,
  ROOMSIZE.MEDIUM,
  ROOMSIZE.LARGE,

]

const MoneyItems = [
  FILTERITEMMONEY.ONE,
  FILTERITEMMONEY.TWO,
  FILTERITEMMONEY.THREE,
  FILTERITEMMONEY.FOUR,
  FILTERITEMMONEY.FIVE,
  FILTERITEMMONEY.SIX,

]
const PeroidItems = [
  FILTERITEMPERIOD.ONE,
  FILTERITEMPERIOD.TWO,
  FILTERITEMPERIOD.THREE,
  FILTERITEMPERIOD.FOUR,
  FILTERITEMPERIOD.FIVE,
  FILTERITEMPERIOD.SIX,
]



export default function PcFilterPopup({type, callback, top, left, height, width }) {
  const [open, setOpen] = React.useState(true);
  const [filtertype, setFiltertype] = React.useState(FILTERITMETYPE.HONG);
  const [filterworkary, setFilterworkary] = React.useState([]);
  const [filtermoney, setFiltermoney] = React.useState(FILTERITEMMONEY.ONE);
  const [filterperiod, setFitlerperiod] = React.useState(PeroidItems.ONE);

  const handleClose = () => {
    setOpen(false);
    callback();
  };

  const [refresh, setRefresh] = React.useState(1);

  React.useEffect(() => {
    setFiltertype(filtertype);
    setFilterworkary(filterworkary);
    setFiltermoney(filtermoney);
    setFitlerperiod(filterperiod);
  }, [refresh]);

  /**
   * 타입 선택하기
   * fitertype를 바꾸면 기존에 설정되어 있던 filterworkary를 초기화 해준다
   */
  const _handleItemtype = (item)=>{
    setFiltertype(item);
    setFilterworkary([]);
    setRefresh((refresh) => refresh +1);
  }
  // 유형 선택하기(다중 체크 지원)
  const _handleItemwork = (item)=>{
    const FindIndex = filterworkary.findIndex(x=>x == item);
    if(FindIndex == -1){
      filterworkary.push(item);
    }else{
      filterworkary.splice(FindIndex, 1);
    }
    
    console.log("TCL: _handleItemwork -> ",filterworkary );
  
    setFilterworkary(filterworkary);
    setRefresh((refresh) => refresh +1);
  }
  //금액 선택하기
  const _handleItemmoney = (item)=>{
    setFiltermoney(item);
    setRefresh((refresh) => refresh +1);
  }

  const _handleItemperiod = (item) =>{
    setFitlerperiod(item);
    setRefresh((refresh) => refresh +1);
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
            <Column style={{height:650, width:1000}}>
              <Poptilt>
                <BetweenRow style={{width:"100%"}}>
                  <PopMainLabel>필터</PopMainLabel>
                  <IconCloseView onClick={handleClose}><IoCloseSharp size={30}/></IconCloseView>
                </BetweenRow>
              </Poptilt>
              <Popcontent>
                <FlexstartRow style={{width:"100%", borderBottom: '1px solid #ededed',height: 80}}>
                  <PopMainLabel>타입</PopMainLabel>
                  <FlexstartRow style={{marginLeft:20}}>
                    <CheckButton className="checkbtn" clickstatus={filtertype == FILTERITMETYPE.HONG} onClick={()=>{_handleItemtype(FILTERITMETYPE.HONG)}}>
                    <span style={{fontSize:16}}>{FILTERITMETYPE.HONG}</span></CheckButton>
                    <CheckButton className="checkbtn"  clickstatus={filtertype == FILTERITMETYPE.ROOM}  onClick={()=>{_handleItemtype(FILTERITMETYPE.ROOM)}}>
                    <span style={{fontSize:16}}>{FILTERITMETYPE.ROOM}</span></CheckButton>
                  </FlexstartRow>
                </FlexstartRow>

                <FlexstartRow style={{width:"100%", borderBottom: '1px solid #ededed',height: 160}}>
                  <PopMainLabel>종류</PopMainLabel>
                  {
                    filtertype == FILTERITMETYPE.HONG ? ( <FlexstartRow style={{marginLeft:20, flexWrap:"wrap", width:"80%"}}>
                    {
                      WorkItems.map((data, index)=>(
                        <CheckButton2 className="checkbtn" clickstatus={filterworkary.findIndex(x=>x == data.name) != -1} onClick={()=>{_handleItemwork(data.name)}}>
                          <img src={data.img} style={{width:22, height:22}}/> <span style={{fontSize:16, marginLeft:5}}>{data.name}</span>
                          </CheckButton2>
                      ))
                    }
                  </FlexstartRow>) :(
                      <FlexstartRow style={{marginLeft:20, flexWrap:"wrap", width:"80%"}}>
                      {
                        RoomItems.map((data, index)=>(
                          <CheckButton2 className="checkbtn" clickstatus={filterworkary.findIndex(x=>x == data) != -1} onClick={()=>{_handleItemwork(data)}}>
                             <span style={{fontSize:16}}>{data.name}</span>
                          </CheckButton2>
                        ))
                      }
                    </FlexstartRow>
                  )
                  }
                
                </FlexstartRow>

                <FlexstartRow style={{width:"100%", borderBottom: '1px solid #ededed',height: 160}}>
                  <PopMainLabel>금액</PopMainLabel>
                  <FlexstartRow style={{marginLeft:20, flexWrap:"wrap", width:"80%"}}>
                    {
                      MoneyItems.map((data, index)=>(
                        <CheckButton className="checkbtn" clickstatus={filtermoney == data}  onClick={()=>{_handleItemmoney(data)}}>
                          <img src={imageDB.sample35} style={{width:22, height:22}}/>
                          <span style={{fontSize:16, marginLeft:5}}>{data}</span></CheckButton>
                      ))
                    }
                  </FlexstartRow>
                </FlexstartRow>

                <FlexstartRow style={{width:"100%",height: 80}}>
                  <PopMainLabel>기간</PopMainLabel>
                  <FlexstartRow style={{marginLeft:20, flexWrap:"wrap", width:"80%"}}>
                    {
                      PeroidItems.map((data, index)=>(
                        <CheckButton className="checkbtn" clickstatus={filterperiod == data}  onClick={()=>{_handleItemperiod(data)}}>{data}</CheckButton>
                      ))
                    }
                  </FlexstartRow>
                </FlexstartRow>
              </Popcontent>
              <Popbottom>
                <BetweenRow style={{width:"100%", paddingLeft:20}}>
                  <PopMainLabel style={{width:"70%",display: 'flex',alignItems: 'center',paddingLeft: '20px'}}>
                    <MdLockReset size={30} color={'#000'}/>
                    <span style={{marginLeft:10}}>초기화</span>
                    </PopMainLabel>
                  <Button onPress={handleClose} height={'100%'} width={'30%'} radius={'5px'} bgcolor={'#ff4e19'} color={'#fff'} text={'5건 찾음'}
                  containerStyle={{bordeBottomRightRadius :15, fontSize:25}}/>
                </BetweenRow>

              </Popbottom>

            </Column>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
