import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../common/Button";
import { Column } from "../common/Column";
import LottieAnimation from "../common/LottieAnimation";
import { Row } from "../common/Row";
import { UserContext } from "../context/User";
import { useSleep } from "../utility/common";
import { imageDB } from "../utility/imageData";




const Container = styled.div`
    width:100%;

`
const style = {
  display: "flex"
};

const LocationText  = styled.div`
  color : #131313;
  font-size:13px;
`
const SearchText = styled.div`
color : #131313;
font-family:'Pretendard-Light';
font-size:10px;
`  

const Inputstyle={
  width: '40%',
  margin :"10px auto",
  border: '3px solid #ff7e10',
  background: '#fff',
  height: '30px',

}
const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "400px",
  position:"absolute"
}

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


const LifeTourPicture =({containerStyle, items}) =>  {
console.log("TCL: LifeTourPicture -> items", items)

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
  const [overlays, setOverlays] = useState([]);
  const [item, setItem] = useState(null);
  const [currentloading, setCurrentloading] = useState(true);
  const [search, setSearch] = useState('');
  const [displayitems, setDisplayitems] = useState([]);
  const [searching, setSearching] = useState(false);

    useLayoutEffect(() => {
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        return () => {};
    }, []);

    useEffect(()=>{
      setSearch(search);
      setDisplayitems(displayitems);
    }, [refresh])

    useEffect(()=>{
        async function FetchData(){
          setDisplayitems(items);
          await useSleep(1500);
          setCurrentloading(false);

        }
        FetchData();
    }, [])

    const handleKeyDown = (event)=>{
      if (event.key === 'Enter') {
        Searchfunc();
      }
  
    }

 
    const _handleSubmit = async(event) => {
      event.preventDefault();
  
      Searchfunc();
  
    };

    async function Searchfunc(){
      setSearching(true);

    
      const mainitems = searchMain(search, items);

      const keyworditems = searchKeyword(search, items);

      let resultitems = [];
      mainitems.map((data)=>{resultitems.push(data)});
      keyworditems.map((data)=>{resultitems.push(data)});

      setDisplayitems(resultitems);

      setSearching(false);
      setRefresh((refresh) => refresh +1);
    }

    function searchMain(data, items){

      const foundItems = items.filter(item => item.galTitle.toLowerCase().includes(data.toLowerCase()));
  
      return foundItems;
  
    }
    function searchKeyword(data, items){
  
      const foundItems = items.filter(item => item.galSearchKeyword.toLowerCase().includes(data.toLowerCase()));
  
      return foundItems;
  
    }

    return (

    <Container style={containerStyle}>

      {
        currentloading == true  && <LottieAnimation containerStyle={{zIndex:11, marginTop:'10%'}} animationData={imageDB.loading}/>
      }


      {/* <Row style={{width:'100%', background:"#fff", position:"sticky", top:'170px'}}>
        <input className="custom-input" type="text" style={Inputstyle}
        onKeyDown={handleKeyDown} 
        value={search} onChange={(e)=>{
          setSearch(e.target.value);
          setRefresh((refresh) => refresh +1);
        
        }}
        placeholder="검색어를  넣어주세여" />
        <img className ="searchicon" src={imageDB.search} style={{width:30, height:30, position:"absolute", left:'68%'}} onClick={_handleSubmit}/>
      </Row> */}
          




      <Row style={{flexWrap:"wrap", width:"100%"}}>
      {
        
        displayitems.map((data, index)=>(
          <>
           
            {
                searching == true ? (<LottieAnimation containerStyle={LoadingStyle} animationData={imageDB.loadinglarge}/>)
                :( "")
            }


            {index < 1000 &&
                   <div style={{width:'15%', margin:"10px auto",}}>
                   <img src={data.galWebImageUrl} style={{width:"180px", height:"180px"}}/>
               
                   <LocationText>{data.galPhotographyLocation}</LocationText>
                     <SearchText>
                     {data.galSearchKeyword.slice(0, 25)}
                     {data.galSearchKeyword.length > 25 ? "..." : null}
                     </SearchText>
                 </div>
            }
          </>
   
        ))
      }

      </Row>

    </Container>
    );

}

export default LifeTourPicture;

