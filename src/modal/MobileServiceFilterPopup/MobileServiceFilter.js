import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSpring, animated } from '@react-spring/web';


import styled from 'styled-components';
import { imageDB } from '../../utility/imageData';
import { BetweenRow, Row } from '../../common/Row';
import { WORKNAME } from '../../utility/work';


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
const style = {
    position: 'absolute',
    top: '80%',
    left: '50%',
    height:'650px',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: '14px 34px',
    zIndex:100,
};
const IconCloseView = styled.div`

`
const MainData = styled.div`
  display :flex;
  flex-direction:row;
  background-color : #fff;
  flex-wrap : wrap;
  margin: 0 auto;
  width:80%;
  padding-right: 30px;
`
// background-color :  ${({check}) => check == 1 ? "#ff4e193b" : "#EDEDED" }; 
const MainDataItem = styled.div`
    padding: 5px 10px;
    justify-content: space-evenly;
    align-items: center;
    display: flex;
    border-radius: 5px;
    width: 40%;
    background-color: #fff;
    margin-left: 10px;
    margin-bottom: 10px;
`
const MainDataItemText = styled.span`
  font-size :16px;
  font-weight:500;
  font-family : ${({theme}) =>theme.REGULAR};
  color :  ${({check}) => check == 1 ? "#FF4E19" : "#000" };  

`
const ApplyItem = styled.div`
  display :flex;
  flex-direction : row;
  justify-content : center;
  align-items : center;
  background-color : #fff;
  margin-bottom : 20px;
`
const FilterApplyButton = styled.div`
    background-color :#FF7125;
    padding :0px 24px;
    border-radius :100px;
    height:46px;
    display:flex;
    justify-content:center;
    align-items:center;

`
const FilterApplyButtonText = styled.span`
  color :#fff;
  font-size :18px;
  font-family : ${({theme}) =>theme.REGULAR};
  font-weight:700;
`

const HeaderPopupline = styled.div`

  width:20%;
  background:#E3E3E3;
  height:4px;
`

export const FILTERITEMMONEY ={
  ONE : "3만원 이하",
  TWO : "3만원 이상 ~ 4만원 이하",
  THREE : "4만원 이상 ~ 5만원 이하",
  FOUR : "5만원 이상 ~ 6만원 이하",
  FIVE : "6만원 이상 ~ 8만원 이하",
  SIX : "8만원 이상",
}

const WorkItems=[
    {name : WORKNAME.HOMECLEAN, img:imageDB.house, img2:imageDB.housegray},
    {name :WORKNAME.BUSINESSCLEAN, img:imageDB.business, img2:imageDB.businessgray},
    {name :WORKNAME.MOVECLEAN, img:imageDB.move, img2:imageDB.movegray},
    {name :WORKNAME.FOODPREPARE, img:imageDB.cook, img2:imageDB.cookgray},
    {name :WORKNAME.ERRAND, img:imageDB.help, img2:imageDB.helpgray},
    {name :WORKNAME.GOOUTSCHOOL, img:imageDB.gooutschool, img2:imageDB.gooutschoolgray},
    {name :WORKNAME.BABYCARE, img:imageDB.babycare, img2:imageDB.babycaregray},
    {name :WORKNAME.LESSON, img:imageDB.lesson, img2:imageDB.lessongray},
    {name :WORKNAME.PATIENTCARE, img:imageDB.patientcare, img2:imageDB.patientcaregray},
    {name :WORKNAME.CARRYLOAD, img:imageDB.carry, img2:imageDB.carrygray},
    {name :WORKNAME.GOHOSPITAL, img:imageDB.hospital, img2:imageDB.hospitalgray},
    {name :WORKNAME.RECIPETRANSMIT, img:imageDB.recipe, img2:imageDB.recipegray},
    {name :WORKNAME.GOSCHOOLEVENT, img:imageDB.schoolevent, img2:imageDB.schooleventgray},
    {name :WORKNAME.SHOPPING, img:imageDB.shopping, img2:imageDB.shoppinggray},
    {name :WORKNAME.GODOGHOSPITAL, img:imageDB.doghospital, img2:imageDB.doghospitalgray},
    {name :WORKNAME.GODOGWALK, img:imageDB.dog, img2:imageDB.doggray},
  ]

export default function MobileServiceFilter({filterhistory, callback}) {
  const [open, setOpen] = React.useState(true);
  const [filterary, setFilterary] = React.useState(filterhistory);
  const [refresh, setRefresh] = React.useState(-1);


  const handleClose = () =>{
    setOpen(false);
    callback([]);
  } 
  const _handlefilterapply = () =>{
   
    setOpen(false);
    callback(filterary);

  }


  const _handleData =(filtername)=>{

    const FindIndex = filterary.findIndex(x=> x == filtername);
    if(FindIndex == -1){
        filterary.push(filtername);
    }else{
      filterary.splice(FindIndex, 1);
    }
    setFilterary(filterary);
    console.log("TCL: _handleData -> filterary", filterary, filtername)
    setRefresh((refresh)=> refresh +1);
  }

  function filteraryexist(filtername){
    const FindIndex = filterary.findIndex(x=> x == filtername);

    return FindIndex == -1 ? false : true;
  }

  React.useEffect(()=>{

    setFilterary(filterary);

  },[refresh])

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
          <Box sx={style}>
              <Row>
                <HeaderPopupline/>
              </Row>
       

              <BetweenRow style={{width:"70%", margin: "20px auto", }}>
                <div style={{fontSize:"18px", fontWeight:900, color:"#131313", fontFamily:'Pretendard-SemiBold'}}>홍여사 서비스 선택</div>
                <IconCloseView onClick={handleClose} >
                <img src={imageDB.close} style={{width:"22px", height:"22px"}}/>
                </IconCloseView>
             </BetweenRow>


            <MainData>
                {WorkItems.map((data)=>(
                    <MainDataItem check={filteraryexist(data.name)} onClick={()=>{_handleData(data.name)}}>
                      {
                        filteraryexist(data.name) == true ? <img src={imageDB.enablecheck} style={{width:'22px'}}/> :
                        <img src={imageDB.disablecheck} style={{width:'22px'}}/>
                      }
                      
                      <MainDataItemText  check={filteraryexist(data.name)}>{data.name}</MainDataItemText></MainDataItem>
                ))}
            </MainData>
      
            <ApplyItem >
                <div style={{dispaly:"flex", alignItems:"center", justifyContent:"center", width:"70%"}}>   
                    <FilterApplyButton onClick ={_handlefilterapply}><FilterApplyButtonText>적용하기</FilterApplyButtonText></FilterApplyButton>
                </div>
            </ApplyItem>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}