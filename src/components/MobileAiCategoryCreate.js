import React, { Fragment, useContext, useEffect, useRef, useState,Suspense, useMemo, memo } from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";
import styled from "styled-components";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";

import "../screen/css/common.css";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { Column, FlexstartColumn } from "../common/Column";
import { IoCloseSharp } from "react-icons/io5";
import Button from "../common/Button";
import { AICATEGORY, FILTERITEMMONEY, FILTERITEMPERIOD, FILTERITMETYPE, LoadingType } from "../utility/screen";

import { WORKNAME } from "../utility/work";


import { MdLockReset } from "react-icons/md";
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
import { CreateCategory, DeleteCATEGORYByid, DeleteCATEGORYCONENTByCATEGORY, ReadALLCATEGORYCONTENT, ReadCATEGORY, ReadCATEGORYCONTENT } from "../service/CategoryService";
import { useNavigate } from "react-router-dom";
import { setRef } from "@mui/material";
import { RiDeleteBin5Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";

import { OrbitControls, TransformControls } from "@react-three/drei";



import { useGLTF } from "@react-three/drei";
import { Environment } from '@react-three/drei';

import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { MdDeleteForever } from "react-icons/md";
import Box from '@mui/material/Box';
import { GrPrevious } from "react-icons/gr";
import { LIFEMENU } from "../utility/life";
import MobileCategoryDeleteSuccessPopup from "../modal/MobileCategoryDeleteSuccessPopup";
import { getFontSize } from '../utility/fontsize';


const Container = styled.div`
  background-color : #fff;
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh);
  touch-action: pan-y;
`

const formatter = buildFormatter(koreanStrings); 


const LabelView = styled.div`
  width: 100%;
  padding: 25px 15px;


`
const Label = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 85%;
  height: 50px;
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(18)}px;
  margin: 0 auto;
`
const InputContent = {
  width:'95%',
  margin:'0px auto 0px',
  borderRadius: '5px',
  fontFamily: 'Pretendard-Regular',
  flex: '0 0 auto',
  height: '30px',
  border: 'none',
  borderRadius: '10px',
  paddingLeft : "10px"
}

const BoxLayer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction:column;
  width: 48%;
  border-radius: 15px;
  padding : 5px 0px;
  margin-bottom:10px;


`
const BoxContent = styled.div`
  font-size: ${() => getFontSize(18)}px;

  font-weight: 500;
  padding: 15px 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  font-family: 'Pretendard';
  height: 70px;
  margin-bottom: 20px;
  flex-direction: column;
  border-radius:10px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
`
const AddBoxDisplay = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top:15px;
`

const BoxDisplay = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 35%;
    padding-left: 10px;
    margin-top:20px;
`

const PlusButton = styled.div`
  color :#66686F;
  font-size :34px;
`
const CategoryAdd = styled.div`
  color :#96989C;
  font-size :14px;
  margin-top:5px;

`
const Categoryname = styled.div`
  color :#1A1E28;
  font-size :14px;
  font-family : Pretendard-SemiBold;

`
const CountItem= styled.div`
color: #66686F;
padding-top: 10px;
font-size: ${() => getFontSize(14)}px;
`

const ControlButton = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    width: 95%;
`

const IconCloseView = styled.div`
`
const CheckText = styled.div``





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



const MobileAiCategoryCreate = memo(({}) =>{
  const { dispatch, user } = useContext(UserContext);
  const navigate = useNavigate();

  const [refresh, setRefresh] = useState(-1);
  const [categoryname, setCategoryname] = useState('');
  const [categoryitems, setCategoryitems] = useState([]);
  const [selectcategory, setSelectcategory] = useState('');
  const [loading, setLoading] = useState(false);

  const [addpopup, setAddpopup] = useState(false);
  const [categoryid, setCategoryid] = useState('');
  const [category, setCategory] = useState('');
  const [deletepopup, setDeletepopup] = React.useState(false);



  useEffect(() => {
    const handleTouchMove = (event) => {
      event.preventDefault(); // 다른 영역에서는 차단
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {

        if(loading == false){
          setLoading(true);
          setRefresh((refresh) => refresh +1);
          Category_Create();
        }

    }
  };



  useEffect(() => {
    setCategoryname(categoryname);
    setCategoryitems(categoryitems);
    setSelectcategory(selectcategory);
    setAddpopup(addpopup);
    setLoading(loading);
    setCategoryid(categoryid);
    setCategory(category);
    setDeletepopup(deletepopup);

  }, [refresh]);

  async function FetchData(){

    setLoading(true);
    setRefresh((refresh) => refresh +1);
    const USERS_ID = user.USERS_ID;
    const ReadItems = await ReadCATEGORY({USERS_ID});

    const SearchItems = await ReadALLCATEGORYCONTENT({USERS_ID});

    let items = [];


    if(ReadItems != -1){
      ReadItems.map((data)=>{
        data["COUNT"] = 0;

        if(SearchItems != -1){
          SearchItems.map((subdata)=>{
            if(subdata.CATEGORY == data.CATEGORY){
              data["COUNT"] += 1;
            }
          })
        }
        items.push(data);
      })
    }


    setCategoryitems(items);
    setLoading(false);

    setRefresh((refresh) => refresh +1);
  
  }
  /**
   * 데이타를 가져온다
   * 1) 무조건 데이타를 가져 와서 저장 해둔다
   * 2) 검색어가 있다면 zemini에 요청한다
   * 3) 검색 결과를 searchresult 에 저장 해두고 데이타 베이스에 입력한다
   * 4) 검색어가 없다면 처음에 가져온 데이타에서 첫번째 인덱스 값을 보여준다 
   */
  useEffect(() =>{
    FetchData();

  }, [])

  const _handlecategorydelete = async (id, name) => {
    
    setCategoryid(id);
    setCategory(name);
    setDeletepopup(true);
    setRefresh((refresh) => refresh + 1);

  }
  const deletecallback = async (data) => {

    if (data === 'ok') {
      const CATEGORY_ID = categoryid;
      const Delete = await DeleteCATEGORYByid({ CATEGORY_ID });

      const CATEGORY = category;
      const DeleteContent = await DeleteCATEGORYCONENTByCATEGORY({ CATEGORY });
      FetchData(); 
    }
    setDeletepopup(false);
    setCategory('');
    setCategoryid('');
    setRefresh((refresh) => refresh + 1);
  }

  const _handlecategoryclick = (data) => {

    if (data.COUNT == 0) {
      return;
    }

   navigate("/Mobileaicategorylist" ,{state :{category :data}});
  }

  const _handlemain = () => {
    navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.AI, search: "" } });
  }

  const _handleCreateCategory = () => {
    setAddpopup(true);

    setRefresh((refresh) => refresh + 1);
  }

  const addpopupclose = () => {
    setAddpopup(false);
    FetchData();
    setRefresh((refresh) => refresh + 1);
  }



  //   transform: 'translate(-50%, -50%)',
  const modalstyle = {
    position: 'absolute',
    top: '90%',
    left: '50%',
    height: '300px',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: '14px 34px',
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    zIndex: 100,
  };


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

  const AddPopup = ({ callback }) => {
    const [open, setOpen] = React.useState(true);
    const [categoryname, setCategoryname] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const { dispatch, user } = React.useContext(UserContext);
    const [saving, setSaving] = React.useState(false);


    const Category_Create = async () => {

      setLoading(true);
      setSaving(true);
      setRefresh((refresh) => refresh + 1);

      const USERS_ID = user.USERS_ID;
      const CATEGORY = categoryname;

      const category = await CreateCategory({ USERS_ID, CATEGORY });

      const ReadItems = await ReadCATEGORY({ USERS_ID });

    
      const SearchItems = await ReadCATEGORYCONTENT({ USERS_ID, CATEGORY });

      let items = [];



      if (ReadItems != -1) {

        ReadItems.map((data) => {
          data["COUNT"] = 0;
          if (SearchItems != -1) {
            SearchItems.map((subdata) => {
              if (subdata.CATEGORY == data.CATEGORY) {
                data["COUNT"] += 1;
              }
            })
          }

          items.push(data);
        })
      }
      setCategoryname("");

      callback();
      setSaving(false);
      setLoading(false);
      setRefresh((refresh) => refresh + 1);

      // navigate("/Mobileaicategorycreate");

    }



    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        if (loading == false) {
          Category_Create();
        }
      }
    };

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




    useEffect(() => {
      setOpen(open);
      setLoading(loading);
      setSaving(saving);
   
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
                <div style={{ fontFamily: "Pretendard-SemiBold", fontSize: () => getFontSize(20) }}>카테고리 관리</div>
                <IconCloseView onClick={_handleAddPopupClose}>
                  <img src={imageDB.ic_common_close_bottomsheet_24} style={{ width: 24 }} />
                </IconCloseView>
              </BetweenRow>

       
              <FlexstartColumn style={{ marginTop: 30 }}>
                <div style={{ fontSize: () => getFontSize(12) }}>카테고리 이름</div>
                <style>{InputPlaceholder}</style>
                <input type="text"
                  className="custom-placeholder"
                  placeholder="추가할 카테고리 이름을 입력해주세요"
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setCategoryname(e.target.value);

                  }}

                ></input>

              </FlexstartColumn>

              <Row style={{
                width: "100%", background: "#FE6625", height: '45px', borderRadius: "10px", marginTop: 20, color: "#fff"
              }}>
                <CheckText onClick={Category_Create}>
                  확인
                </CheckText>
              </Row>
            </Box>
          </Fade>
        </Modal>
      </Container>
    );
  }


  
  return (
    <Column style={{ width: '100%', margin: '0 auto' }}>
      

      {deletepopup == true && <MobileCategoryDeleteSuccessPopup callback={deletecallback} content={'카테고리를 삭제하시겠습니까? 카테고리를 삭제하시면 모든 정보가 삭제 됩니다'} />}

      
      <BetweenRow style={{ width: "100%" }}>
        <div style={{ display: "flex", fontSize: '18px', color: "#131313", alignItems: "center", paddingLeft: 15 }}>
          <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} onClick={_handlemain} />
          <div style={{ paddingLeft: 5, fontSize: () => getFontSize(20), color: "#1A1E28", fontFamily:"Pretendard-SemiBold" }}>{'지식창고'}</div>
        </div>
      </BetweenRow> 

      <LabelView>
          <Label>
          {'카테고리를 생성하고 AI로 검색 한 결과를 정리해보세요'}
          </Label>
      </LabelView>

      <Column style={{width:"100%", margin: "10px auto 30px"}}> 
        <BetweenRow style={{ flexWrap: "wrap", width: "90%", margin: "0 auto" }}>
          
          <BoxLayer>
            <BoxContent>
              <img src={imageDB.foldercreate} style={{ width: "145px" }} />
              <AddBoxDisplay onClick={_handleCreateCategory}>
                <div>
                  <img src={imageDB.ic_common_etc_folder_add_l} style={{width:24}} />
                </div>
                <CategoryAdd>카테고리 추가</CategoryAdd>
              </AddBoxDisplay>
            </BoxContent>
          </BoxLayer>

          {
              categoryitems.map((data, index)=>(
                <BoxLayer clickstatus={AICATEGORY.SCHEDULE == data.CATEGORY} >  

                  <BoxContent clickstatus={AICATEGORY.SCHEDULE == data.CATEGORY}   >

                    <img onClick={() => { _handlecategoryclick(data) }}  src={imageDB.foldercreate2} style={{ width: "145px" }} />

                    <BoxDisplay>
                 
                      <Categoryname onClick={() => { _handlecategoryclick(data) }} >{data.CATEGORY}</Categoryname>
                      <CountItem onClick={() => { _handlecategoryclick(data) }}>{data.COUNT}개 등록</CountItem>
                      <ControlButton>
                        <img src={imageDB.folderdelete} style={{ width: 32 }} onClick={() => _handlecategorydelete(data.CATEGORY_ID, data.CATEGORY)} />
                      </ControlButton>
                    </BoxDisplay>
                    
                  </BoxContent>
         
              
                </BoxLayer>
              ))
            }
          
        </BetweenRow>
        

        {
          addpopup === true && <AddPopup callback={addpopupclose} />
        }


      </Column> 
    </Column>
  );
});

export default MobileAiCategoryCreate;