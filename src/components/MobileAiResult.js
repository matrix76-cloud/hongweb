import React, { Fragment, useContext, useEffect, useRef, useState,Suspense, useMemo, memo } from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';
import { useSpring, animated } from "@react-spring/web";
import styled from "styled-components";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";

import "../screen/css/common.css";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { Column, FlexstartColumn } from "../common/Column";



import { useNavigate } from "react-router-dom";
import IconButton from "../common/IconButton";
import { imageDB } from "../utility/imageData";
import ButtonEx from "../common/ButtonEx";



import { MdSettingsInputComponent } from "react-icons/md";
import { CreateCategory, CreateCategoryContent, ReadCATEGORY, ReadCATEGORYCONTENT } from "../service/CategoryService";
import { UserContext } from "../context/User";

import { GrPrevious } from "react-icons/gr";
import { Toaster, toast } from 'sonner';
import { getFontSize } from '../utility/fontsize';

const Container = styled.div`
  background-color : #fff;
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh - 50px);
  touch-action: pan-y;
`

const MobileResultContent = {
  width: '95%',
  height: '480px',
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
  height: '700px',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  padding: '14px 34px',
  borderTopLeftRadius: "20px",
  borderTopRightRadius: "20px",
  zIndex: 100,
};

const InputContent = {

}

const InputPlaceholder = `

 .custom-placeholder{
    width: 95%;
    margin: 15px auto 5px;
    border: 1px solid #dadada;
    border-radius: 5px;
    background-color: #fff;
    font-family: Pretendard-Regular;
    padding-left:10px;
 }
 .custom-placeholder::placeholder {
    font-size: 14px !important; 
    color: gray;
    padding-left:5px;
  }

`

const CategoryList = styled.div`
  height: 30px;
  border-bottom: 1px solid #ededed;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom:10px;
  `

const MainData = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #fff;
  flex-wrap: wrap;
  width: 95%;
  margin: 20px auto;
`



const MainDataItem = styled.div`
    padding: 5px 0px;
    justify-content: flex-start;
    align-items: center;
    display: flex;
    border-radius: 5px;
    width: 100%;
    background-color: #fff;
    margin-left: 10px;
    margin-bottom: 10px;
`
const MainDataItemText = styled.span`
  font-size :16px;
  font-weight:500;
  font-family : ${({ theme }) => theme.REGULAR};
  color :  ${({ check }) => check == 1 ? "#FF4E19" : "#000"};  

`

const AITag = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px;

`

const MobileAiResult = memo(({ result, research }) => {
  
  console.log("research", research);

  const { dispatch, user } = useContext(UserContext);

  const navigate = useNavigate();

  const [refresh, setRefresh] = useState(-1);
  const [selectpopup, setSelectpopup] = useState(false);

  useEffect(() => {
    setSelectpopup(selectpopup);
  }, [refresh]);


  useEffect(() =>{
  }, [])

  const _handleResearch = () => {
    navigate(-1); 
  }


  const _handleprev = () => {
    navigate(-1);
  }
  const _handleStore = async() => {


    const USERS_ID = user.USERS_ID;
    const ReadItems = await ReadCATEGORY({ USERS_ID });



    if (ReadItems == -1) {
      toast.error("생성하신 카테고리가 없습니다. 지식창고에서 카테고리를 생성한후 보관해주세요", {
        duration: 1000,
        style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
      })
      return;
    } else {
      setSelectpopup(true);
      setRefresh((refresh) => refresh + 1);
    }
  }

  const selectpopupclose = () => {
    setSelectpopup(false);
    setRefresh((refresh) => refresh + 1);
  }



  const SelectPopup = ({ callback, result, keyword }) => {
    const [open, setOpen] = React.useState(true);
    const [categoryname, setCategoryname] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const { dispatch, user } = React.useContext(UserContext);
    const [readitems, setReaditems] = React.useState([]);
    const [checkcategory, setCheckcategory] = React.useState('');


    async function FetchData() {
      const USERS_ID = user.USERS_ID;

      const ReadItems = await ReadCATEGORY({ USERS_ID }); 
      setReaditems(ReadItems);
    }
    useEffect(() => {
      FetchData();
    },[])

    const Category_Select = async () => {

      setLoading(true);
      setRefresh((refresh) => refresh + 1);

      const USERS_ID = user.USERS_ID;
      const CATEGORY = checkcategory;
      const CONTENT = result;
      const KEYWORD = research;
      
      await CreateCategoryContent({USERS_ID, CONTENT, KEYWORD, CATEGORY });
      
      setCategoryname("");
      setLoading(false);

      navigate("/Mobileaicategorycreate");

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


    function filteraryexist(filtername) {
      
      if (filtername == checkcategory) {
        return true;
      } else {
        return false;
      }
    }
    const _handleData = (category) => {
      setCheckcategory(category);

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
            <Box sx={modalstyle}>
     
              <BetweenRow>
                <div style={{fontFamily:"Pretendard-SemiBold", fontSize: () => getFontSize(20)}}>카테고리 선택</div>
                <IconCloseView onClick={_handleAddPopupClose}>
                  <img src={imageDB.ic_common_close_bottomsheet_24} style={{width:24}}/>
                </IconCloseView>
              </BetweenRow>

      
                <MainData>
                  {readitems.map((data) => (
                    <MainDataItem check={filteraryexist(data.CATEGORY)} onClick={() => { _handleData(data.CATEGORY) }}>
                      <MainDataItemText check={filteraryexist(data.CATEGORY)}>{data.CATEGORY}</MainDataItemText>
                      {
                        filteraryexist(data.CATEGORY) == false ? (<img src={imageDB.check_d} style={{ width: 16, paddingLeft: 5 }} />) : (
                          <img src={imageDB.check_e} style={{ width: 16, paddingLeft: 5 }} />
                        )
                      }
                    </MainDataItem>
                  ))}
                </MainData>

            

              <Row style={{
                width: "100%", background: "#FFA95E", height: '45px', borderRadius: "10px", marginTop:20, color :"#fff"}}>
                <CheckText onClick={Category_Select}>
                  확인
                </CheckText>
              </Row>
            </Box>
          </Fade>
        </Modal>
      </div>
    );
  }

  
  
  return (
    <Container>
      <Column style={{ width: '100%', margin: '0 auto' }}>
        <BetweenRow style={{ width: "100%" }}>
          <div style={{ display: "flex", fontSize: '18px', color: "#131313", alignItems: "center", paddingLeft: 15 }} onClick={_handleprev} >
            <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} />
            <div style={{ paddingLeft: 5, fontSize: () => getFontSize(20), color: "#1A1E28", fontFamily: "Pretendard-SemiBold" }}>{'AI 검색결과'}</div>
          </div>

        </BetweenRow>

        <BetweenRow style={{ width: "90%", alignItems: "flex-start", marginTop: 30 }}>
          {/* <FlexstartRow style={{ width: '10%' }}><img src={imageDB.teachericon} style={{ width: "32px" }} /></FlexstartRow> */}
          <FlexstartColumn style={{ width: '100%', border: "1px solid #ededed", borderRadius: 10 }}>
            <AITag>
              <img src={imageDB.teachericon} style={{ width: "32px" }} />
              <div style={{ color: "#1A1E28", fontFamily: "Pretendard-SemiBold", paddingLeft: '10px', }}>AI 도우미</div>
            </AITag>

            <textarea
              value={result}
              style={MobileResultContent}></textarea>
          </FlexstartColumn>
        </BetweenRow>


        {
          selectpopup === true && <SelectPopup callback={selectpopupclose} result={result} reseach={research} />
        }

        <BetweenRow style={{ width: "90%", margin: "10px 0px 0px 10px", justifyContent: "space-around" }}>
          <ButtonEx text={'다시 검색해보기'} width={'50'}
            onPress={() => { _handleResearch() }} bgcolor={'#FFF0E9'} color={'#FFA95E'} containerStyle={{
              fontFamily: "Pretendard-Regular", height: 46, fontSize: () => getFontSize(16),
              boxShadow: "none", marginLeft: 0
            }} />
          <ButtonEx text={'보관하기'} width={'50'}
            onPress={_handleStore} bgcolor={'#FFA95E'} color={'#FFF'} containerStyle={{
              fontFamily: "Pretendard-Regular", height: 46, fontSize: () => getFontSize(16),
              boxShadow: "none", marginLeft: 10
            }} />
        </BetweenRow>
        <div style={{height:150}}></div>

        <Toaster position="bottom-right" richColors />

      </Column>
    </Container>

  );
});

export default MobileAiResult;