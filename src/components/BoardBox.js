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
import { getFontSize } from '../utility/fontsize';

const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`
color: #333;
line-height: 1.8;
font-family: "Pretendard-Regular";
width: 90%;
margin : 0 auto;
`
const style = {
  display: "flex"
};



const BoxItem = styled.div`

  color: #333;
  line-height: 1.8;
  width:100%;
  font-family: "Pretendard-Regular";



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
  min-width:80px;
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

const BoardBox =({containerStyle, item}) =>  {

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
      <BoxItem onClick={()=>{_handleBoardView(item)}}>
        <FlexstartColumn style={{alignItems:"unset"}}>
          <BoxLabel>
            <div>
            {item.LABEL.slice(0, 20)}
            {item.LABEL.length > 20 ? "..." : null}
            </div>
            <Taglabel>
              {item.COMMUNITYCATEGORY}
            </Taglabel>
                
          </BoxLabel>

          <>
            {
              item.REPRESENTIMG == '' ? (<BoxContent>        
                {item.CONTENTSUMMARY.slice(0, 600)}
                {item.CONTENTSUMMARY.length > 600 ? "..." : null}
              </BoxContent>):(<BoxContent>  

            
                </BoxContent>)
            }
          </>
        

      
          <BoxWrite>
              <FlexstartRow style={{width:'50%', margin:"5px 0px"}}>
                <Row><img src={imageDB.logo}  style={{width:20}}/></Row>
                <div>관리자</div>
                <div style={{marginLeft:5}}>
                <TimeAgo date={getFullTime(item.CREATEDT)}formatter={formatter}style={{fontWeight:400, fontSize: () => getFontSize(14), color :"#A3A3A3", marginLeft:5}} />
                </div>
              </FlexstartRow>
              <FlexEndRow style={{width:'40%', fontSize: () => getFontSize(14)}}>
                <img src={imageDB.heartoff} style={{width:16}}/>
                <div style={{marginLeft:5}}>0</div>
              </FlexEndRow>
          </BoxWrite>
          <BoxImage>
            {/* <img src={item.REPRESENTIMG}
            onLoad={handleImageLoad}
            style={{width:"100%", borderRadius:"10px"}}/> */}

            <LazyImage src={item.REPRESENTIMG} containerStyle={{width:'100%', backgroundColor: '#f9f9f9', borderRadius:"10px" }}/>

          </BoxImage>
        </FlexstartColumn>
      </BoxItem>
    </Container>
  );

}

export default BoardBox;

