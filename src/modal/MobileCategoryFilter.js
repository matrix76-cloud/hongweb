import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSpring, animated } from '@react-spring/web';

import styled from 'styled-components';
import { imageDB } from '../utility/imageData';
import { BetweenRow, Row } from '../common/Row';
import { UserContext } from '../context/User';
import { ReadCATEGORY } from '../service/CategoryService';
import { useNavigate } from 'react-router-dom';


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
    height:'450px',
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


export default function MobileCategoryFilter({callback}) {
  const [open, setOpen] = React.useState(true);

  const [refresh, setRefresh] = React.useState(-1);
  const [categoryitems, setCategoryitems] = React.useState([]);
  const navigate = useNavigate();
  const { dispatch, user } = React.useContext(UserContext);

  const [selectcategory, setSelectcategory] = React.useState('');

  const handleClose = () =>{
    setOpen(false);
    callback([]);
  } 
  const _handlefilterapply = () =>{
   
    setOpen(false);
    callback(selectcategory);

  }


  const _handleData =(filtername)=>{


    setSelectcategory(filtername);

    setRefresh((refresh)=> refresh +1);
  }

  function filterexist(filtername){

    if(selectcategory == filtername){
      return true;
    }else{
      return false;
    }

  }

  React.useEffect(()=>{

    setSelectcategory(selectcategory);

  },[refresh])

  React.useEffect(()=>{
    async function FetchData(){
      const USERS_ID = user.USERS_ID;
      const items = await ReadCATEGORY({USERS_ID});

      if(items != -1){
        setCategoryitems(items);
      }
   
    }
    FetchData();
  }, [])

  const _handlecategorymove = () =>{
    navigate("/Mobileaicategorycreate")
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
          <Box sx={style}>
              <Row>
                <HeaderPopupline/>
              </Row>
       

              <BetweenRow style={{width:"70%", margin: "20px auto", }}>
                <div style={{fontSize:"18px", fontWeight:900, color:"#131313", fontFamily:'Pretendard-SemiBold'}}>검색결과 적용할 카테고리 선택</div>
                <IconCloseView onClick={handleClose} >
                <img src={imageDB.close} style={{width:"22px", height:"22px"}}/>
                </IconCloseView>
             </BetweenRow>

                {
                  categoryitems.length != 0 ? (<>
                <MainData>

{categoryitems.map((data)=>(
    <MainDataItem check={filterexist(data.CATEGORY)} onClick={()=>{_handleData(data.CATEGORY)}}>
      {
        filterexist(data.CATEGORY) == true ? <img src={imageDB.enablecheck} style={{width:'22px'}}/> :
        <img src={imageDB.disablecheck} style={{width:'22px'}}/>
      }
      
      <MainDataItemText  check={filterexist(data.CATEGORY)}>{data.CATEGORY}</MainDataItemText></MainDataItem>
))}
                </MainData>
                <ApplyItem >
                <div style={{dispaly:"flex", alignItems:"center", justifyContent:"center", width:"50%",
                  position: "absolute",
                  bottom: "150px"}}>   
                    <FilterApplyButton onClick ={_handlefilterapply}><FilterApplyButtonText>적용하기</FilterApplyButtonText></FilterApplyButton>
                </div>
                </ApplyItem>
                  </>):(
                <>
                <MainData style={{padding:30}}>
                   <div>{'카테고리가 만들어지지 않았습니다. 먼저 카테고리를 만들어주세요'}</div>
                </MainData>
                <ApplyItem>
                <div style={{dispaly:"flex", alignItems:"center", justifyContent:"center", width:"50%",
                  position: "absolute",
                  bottom: "150px"}}>   
                    <FilterApplyButton onClick ={_handlecategorymove}><FilterApplyButtonText>카테고리 만들기</FilterApplyButtonText></FilterApplyButton>
                </div>
                </ApplyItem>
                </>)
    
                }

   
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}