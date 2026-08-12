import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column } from "../common/Column";
import { FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import { getFullTime } from "../utility/date";
import { SubKeywordAddress } from "../utility/region";

import TimeAgo from 'react-timeago';
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";


const formatter = buildFormatter(koreanStrings); 


const Container = styled.div`

  margin : 20px 0px;

`
const style = {
  display: "flex"
};





const ReviewItem =({containerStyle, item}) =>  {

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

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{

  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
       
      }
      FetchData();
  }, [])
  

 
  return (

    <Container style={containerStyle}>

        <FlexstartRow>
          <FlexstartRow>  <img src={item.USERINFO.userimg} style={{borderRadius:"20px", width:"20px"}}/></FlexstartRow>
          <Column>
            <Row style={{width:"100%",paddingLeft:5,fontSize: () => getFontSize(14)}}>
            <div> {item.username}</div>
            <div>{' / '}</div>
            <div>{SubKeywordAddress(item.address_name)}</div>
            <div>{' / '}</div>
            <TimeAgo date={getFullTime(item.reviewdate)}formatter={formatter} style={{fontSize: () => getFontSize(14)}} />
            </Row>

          </Column>
        </FlexstartRow>
    

        <Row style={{fontSize: () => getFontSize(16), marginTop:20, fontStyle:"italic"}}>{'"'}{item.reviewtext}{'"'}</Row>
                
    </Container>
  );

}

export default ReviewItem;

