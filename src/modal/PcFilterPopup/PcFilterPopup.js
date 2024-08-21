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
import { setRef } from "@mui/material";

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
  margin-right:30px;
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
    width:100%;
    background:#fff;
`
const Popbottom = styled.div`
    height:68px;
    width:100%;
    background:#fafafa;
    display:flex;
`
const PopMainLabel = styled.div`
  font-size: 20px;
  font-weight: 700;
  padding-left: 20px;
  line-height: 26px;
  color :#fff;
`
const PopMainSubLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  padding-left: 20px;
  line-height: 26px;
  color :#131313;
`

const BoxItem = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction:column;
  height: 128px;
  width: 9%;
  margin-right: 10px;
  border-radius: 15px;

`
const BoxImg = styled.div`
  background: #f9f9f9;
  border-radius: 100px;
  border: ${({clickstatus}) => clickstatus == true ? ('3px solid #FF7125') :('') };
  padding: 10px;
`
const BoxText = styled.div`
  color: ${({clickstatus}) => clickstatus == true ? ('#FF7125') :('#000') };
  font-size:14px;
  margin-top:10px;

`

const CheckButton = styled.div`
  color: #131313;
  border: ${({clickstatus}) => clickstatus == true ? ('1px solid #F75100') :('1px solid #C3C3C3') };
  font-weight: 600;
  border-radius: 4px;
  margin-left: 10px;
  font-size: 16px;
  height: 44px;
  line-height: 20px;
  padding : 0px 10px;
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
  {name :ROOMSIZE.SMALL, img:imageDB.roomsize1},
  {name :ROOMSIZE.MEDIUM, img:imageDB.roomsize2},
  {name :ROOMSIZE.LARGE, img:imageDB.roomsize3},

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

  const [menu, setMenu] = React.useState('');
  const [refresh, setRefresh] = React.useState(1);

  const _handlemenuclick =(menu) =>{
    setMenu(menu);
    setRefresh((refresh) => refresh +1);

  }
  const handleClose = () => {
    setOpen(false);
    callback();
  };



  React.useEffect(() => {
    setFiltertype(filtertype);
    setFilterworkary(filterworkary);
    setFiltermoney(filtermoney);
    setFitlerperiod(filterperiod);
    setMenu(menu);
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
            <Column style={{height:630, width:'100%'}}>
              <Poptilt>
                <BetweenRow style={{width:"100%"}}>
                  <PopMainLabel>필터</PopMainLabel>
                  <IconCloseView onClick={handleClose}><IoCloseSharp size={25} color={'#fff'}/></IconCloseView>
                </BetweenRow>
              </Poptilt>
              <Popcontent>
                <FlexstartRow style={{width:"100%", borderBottom: '1px solid #ededed',height: 80}}>
                  <PopMainSubLabel>타입</PopMainSubLabel>
                  <FlexstartRow style={{marginLeft:20}}>
                    <CheckButton clickstatus={filtertype == FILTERITMETYPE.HONG} onClick={()=>{_handleItemtype(FILTERITMETYPE.HONG)}}>
                    <span style={{fontSize:16}}>{FILTERITMETYPE.HONG}</span>
                    {
                      filtertype == FILTERITMETYPE.HONG ? (<img src={imageDB.enablecheck} style={{width:16, height:16,marginLeft:5}}/>):(<img src={imageDB.check} style={{width:16, height:16,marginLeft:5}}/>)
                    }
                    </CheckButton>
                    <CheckButton  clickstatus={filtertype == FILTERITMETYPE.ROOM}  onClick={()=>{_handleItemtype(FILTERITMETYPE.ROOM)}}>
                    <span style={{fontSize:16}}>{FILTERITMETYPE.ROOM}</span>
                    
                    {
                      filtertype == FILTERITMETYPE.ROOM ? (<img src={imageDB.enablecheck} style={{width:16, height:16,marginLeft:5}}/>):(<img src={imageDB.check} style={{width:16, height:16,marginLeft:5}}/>)
                    }
                    </CheckButton>
                  </FlexstartRow>
                </FlexstartRow>

                <FlexstartRow style={{width:"100%", borderBottom: '1px solid #ededed',height: 160}}>
                  <PopMainSubLabel>종류</PopMainSubLabel>
                  {
                    filtertype == FILTERITMETYPE.HONG ? ( 
                    <FlexstartRow style={{marginLeft:20, flexWrap:"nowrap", width:"90%",
                    overflowX: "auto",
                    scrollbarWidth: "none",  /* Firefox */
                    marginTop: 10}}>
                    {
                      WorkItems.map((data, index)=>(
                        <BoxItem onClick={()=>{_handlemenuclick(data.name)}} >
                            <BoxImg clickstatus={menu == data.name}><img src={data.img} style={{width:64, height:64}}/></BoxImg>
                            <BoxText clickstatus={menu == data.name}>{data.name}</BoxText>
                          </BoxItem>
                      ))
                    }
                    </FlexstartRow>) :(
                      <FlexstartRow style={{marginLeft:20, flexWrap:"wrap", width:"80%"}}>
                      {
                        RoomItems.map((data, index)=>(
                          <BoxItem onClick={()=>{_handlemenuclick(data.name)}} >
                          <BoxImg clickstatus={menu == data.name}><img src={data.img} style={{width:64, height:64}}/></BoxImg>
                          <BoxText clickstatus={menu == data.name}>{data.name}</BoxText>
                        </BoxItem>
                        ))
                      }
                    </FlexstartRow>
                  )
                  }
                
                </FlexstartRow>

                <FlexstartRow style={{width:"100%", borderBottom: '1px solid #ededed',height: 160}}>
                  <PopMainSubLabel>금액</PopMainSubLabel>
                  <FlexstartRow style={{marginLeft:20, flexWrap:"wrap", width:"80%"}}>
                    {
                      MoneyItems.map((data, index)=>(
                        <CheckButton  clickstatus={filtermoney == data}  onClick={()=>{_handleItemmoney(data)}}>
                          <span style={{fontSize:16, marginLeft:5}}>{data}</span>
                          
                          {
                            filtermoney == data ? (<img src={imageDB.enablecheck} style={{width:16, height:16,marginLeft:5}}/>):(<img src={imageDB.check} style={{width:16, height:16,marginLeft:5}}/>)
                          }
                          
                          </CheckButton>
                      ))
                    }
                  </FlexstartRow>
                </FlexstartRow>

                <FlexstartRow style={{width:"100%",height: 80}}>
                  <PopMainSubLabel>기간</PopMainSubLabel>
                  <FlexstartRow style={{marginLeft:20, flexWrap:"wrap", width:"80%"}}>
                    {
                      PeroidItems.map((data, index)=>(
                        <CheckButton  clickstatus={filterperiod == data}  onClick={()=>{_handleItemperiod(data)}}>{data}
                        
                        {
                          filterperiod == data ? (<img src={imageDB.enablecheck} style={{width:16, height:16,marginLeft:5}}/>):(<img src={imageDB.check} style={{width:16, height:16,marginLeft:5}}/>)
                        }
                        </CheckButton>
                      ))
                    }
                  </FlexstartRow>
                </FlexstartRow>
              </Popcontent>
              <Popbottom>
                <FlexEndRow style={{width:"100%", marginRight:5}}>
    
                  <CheckButton  onClick={()=>{}} style={{height:44, width:96, borderRadius:5}}>
                    <img src={imageDB.reset} style={{width:16, height:16,marginRight:5}}/> 초기화
                  </CheckButton>

                  <CheckButton  onClick={()=>{}} style={{height:44, width:96, borderRadius:5,
                     background:"#FF7125", color :"#fff"}}>
                     5건 찾음
                  </CheckButton>

        
                </FlexEndRow>

              </Popbottom>

            </Column>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
