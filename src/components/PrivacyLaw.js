import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../context/User";


import { CiHeart } from "react-icons/ci";
import { PRIVACYLAW, USELAW } from "../utility/law";
import { BetweenRow, Row } from "../common/Row";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp  } from "react-icons/io";
import { ref } from "firebase/storage";

const Container = styled.div`
    width: 70%;
    margin: 50px auto;
    font-size: 18px;
`
const RowItem = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    border-bottom: 1px solid #ededed; 
    padding-bottom:20px;
    padding-top:20px;
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
    font-weight: 600;
`
const Label  = styled.div`
    margin-left:20px;
`


const style = {
  display: "flex"
};

const PrivacyLaw =({containerStyle}) =>  {

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

    if(PRIVACYLAW[index].OPEN == true){
        PRIVACYLAW[index].OPEN = false;
    }else{
        PRIVACYLAW[index].OPEN = true;
    }

    setRefresh((refresh) => refresh +1);

  }
 
  return (

    <Container>
        <RowItem>
            <div style={{fontSize:25, fontWeight:700}}>개인정보 처리 방침</div>
            <div>2025년 8월 5일</div>
        </RowItem>
        <div style={{marginTop:20}}>
        {
            PRIVACYLAW.map((data, index)=>(
                <div onClick={()=>{_handleView(index)}}>
                    <RowItem>
                        <Row style={{fontSize:20, fontWeight:700}}>
                            <Indexno>{data.INDEX}</Indexno>
                            <Label>{data.LABEL}</Label>
                        </Row>
                        <div>
                            {
                                data.OPEN == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                            }
                        </div>
                    </RowItem>       
                    {
                        data.OPEN == true &&      
                        <ul style={{lineHeight:2, padding:20, background:'#f0f0f0',  paddingLeft: 40}}>
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

    </Container>
  );

}

export default PrivacyLaw;

