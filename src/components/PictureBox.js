import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { FlexstartColumn } from "../common/Column";
import { FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";
import TimeAgo from 'react-timeago';
import { getFullTime } from "../utility/date";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import LazyImage from "../common/LasyImage";

const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`
color: #333;
font-family: "Pretendard-Regular";
width: 90%;
`
const style = {
  display: "flex"
};



const BoxItem = styled.div`





`
const BoxLabel = styled.div`
  font-family: "Pretendard-SemiBold";
  font-size: ${() => getFontSize(18)}px;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  width:100%;


`

const BoxContent = styled.div`
  font-family: "Pretendard-Regular";
  font-size: ${() => getFontSize(16)}px;

`
const BoxWrite = styled.div`
  display : flex;
  flex-direction : row;
  justify-content: flex-start;
  align-items: center;
  width : 100%;
  font-size :14px;
`

const BoxImage = styled.div`
  margin-top:5px;
`

const Taglabel = styled.div`
  font-family: "Pretendard";
  font-size: ${() => getFontSize(12)}px;
  margin-right:10px;
  min-width:50px;
  display : flex;
  align-items: center;
  justify-content: center;
  background-color:#FFF5F5;
  color :#FF2121;
  border-radius: 5px;

`

const TagData = styled.div`
  font-family: "Pretendard-Light";
  font-size: ${() => getFontSize(14)}px;

  color :#131313;
`
const LocationText  = styled.div`
  color : #131313;
  font-size: ${() => getFontSize(16)}px;
`
const SearchText = styled.div`
  color : #131313;
  font-family:'Pretendard-Light';
  font-size: ${() => getFontSize(14)}px;
  margin-left:10px;
`  


const PictureBox =({containerStyle, data}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const [imgheight, setImgheight] = useState(0);
  const [show, setShow] = useState(false);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setImgheight(imgheight);
    
    setShow(show);
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
       
      }
      FetchData();
  }, [])
  

  const _handleBoardView = (data) =>{
    navigate("/PCcommunityboard" ,{state :{ITEM :data}});
  }
  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.target;

    setImgheight(naturalHeight);
    setShow(true);
    setRefresh((refresh) => refresh +1);
  };


 
  return (

    <Container style={containerStyle}>
      <BoxItem onClick={()=>{_handleBoardView(data)}}>

      <LazyImage src={data.galWebImageUrl} containerStyle={{width:"100%",objectFit:"cover",
      backgroundColor: '#f0f0f0', minHeight:200 }}
      />

      <FlexstartRow style={{marginBottom:10}}>
        <LocationText>{data.galPhotographyLocation}</LocationText>
        <SearchText>
        {data.galSearchKeyword.slice(0, 16)}
        {data.galSearchKeyword.length > 16 ? "..." : null}
        </SearchText>
      </FlexstartRow>


      </BoxItem>
    </Container>
  );

}

export default PictureBox;

