import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../context/User";


import { CiHeart } from "react-icons/ci";
import { REFUND, USELAW } from "../utility/law";
import { BetweenRow, Row } from "../common/Row";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp  } from "react-icons/io";
import { ref } from "firebase/storage";
import { getFontSize } from "../utility/fontsize";

const Container = styled.div`
    font-size: ${() => getFontSize(14)}px;
    background:#fff;
    scrollbar-width: none; // 스크롤바 안보이게 하기
    overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
    overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
    height: calc(100vh -50px);
    touch-action: pan-y;
    
`
const RowItem = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    border-bottom: 1px solid #ededed; 
    padding:10px 20px;
`
const ColumnItem = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
    border-bottom: 1px solid #ededed; 
    padding-bottom:20px;
    padding-top:20px;
`
const Indexno = styled.div`
    color: #849dd2;

`
const Label  = styled.div`
    margin-left:20px;
`


const style = {
  display: "flex"
};

const BottomSafeSpace = styled.div`
      height: calc(env(safe-area-inset-bottom, 0px) + 40px); // ✅ 최소 여백 + safe-area
`;


const MobileRefund =({containerStyle}) =>  {

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
    async function FetchData(){
    } 
    FetchData();
  }, [])
  useEffect(()=>{

  },[refresh])


  const _handleView = (index)=>{

    if(USELAW[index].OPEN == true){
        USELAW[index].OPEN = false;
    }else{
        USELAW[index].OPEN = true;
    }

    setRefresh((refresh) => refresh +1);

  }
 
  return (

    <Container>
        <RowItem>
            <div style={{fontSize: getFontSize(18),  fontFamily:"Pretendard-SemiBold"}}></div>
              <div>2025년 2월 15일</div>
        </RowItem>
        <div>
        {
            REFUND.map((data, index)=>(
                <div onClick={()=>{_handleView(index)}}>
                    <RowItem>
                        <Row style={{fontSize: getFontSize(14),  fontFamily:"Pretendard-SemiBold"}}>
                            <Indexno>{data.INDEX}</Indexno>
                            <Label>{data.LABEL}</Label>
                        </Row>
                        {/* <div>
                            {
                                data.OPEN == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                            }
                        </div> */}
                    </RowItem>       
                    {

                        data.OPEN == true &&      
                            <ul style={{ lineHeight: 2, padding: "10px 20px 10px 40px"}}>
                            {
                                data.CONTENT.map((subdata, index)=>(
                                    <li style={{margin:"10px 0px",listStyleType: "decimal", whiteSpace:'pre-line'}}
                                    dangerouslySetInnerHTML={{ __html: subdata }}
                                    />
                                    
                                ))
                            }
                        </ul>   
                    }
                </div>
  
            ))
        }
        </div>
          <BottomSafeSpace/>
          
    </Container>
  );

}

export default MobileRefund;

