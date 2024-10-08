import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../common/Button";
import { Column } from "../common/Column";
import LottieAnimation from "../common/LottieAnimation";
import { DataContext } from "../context/Data";
import { UserContext } from "../context/User";
import { LoadingCommunityStyle } from "../screen/css/common";
import { ReadTourCountry } from "../service/LifeService";
import { useSleep } from "../utility/common";
import { imageDB } from "../utility/imageData";
import "./mobile.css";



const Container = styled.div`
    width:100%;

`
const style = {
  display: "flex"
};

const DetailLevel = 4;
const DetailMeter =300;
const BasicLevel =9;



const mapstyle = {
  position: "absolute",
  overflow: "hidden",
  top: '10%',
  width:'100%',
};

const PopupWorkEx = styled.div`
  height: 800px;
  position: absolute;
  top:50px;
  width: 100%;
  background: #fff;
  z-index: 5;
  overflow-y: auto;
`

const TableLayout = styled.div`
  overflow-y: scroll;
  scroll-behavior: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:100%;
`
const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "300px",
  position:"absolute"
}
  
const MapExbtn = styled.div`
  position: relative;
  top: 10px;
  left: 88%;
  z-index: 3;
  background: #f9f9f9;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`
/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


const MobileLifeTourCountry =({containerStyle}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [overlays, setOverlays] = useState([]);
  const [item, setItem] = useState(null);
  const [currentloading, setCurrentloading] = useState(true);
  const [show, setShow] = useState(true);

    useLayoutEffect(() => {
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        return () => {};
    }, []);

    useEffect(()=>{
        setOverlays(overlays);
        setCurrentloading(currentloading);
        setItem(item);
    }, [refresh])

    useEffect(()=>{
        async function FetchData(){

          if(data.tourcountryitem.length == 0){
            const tourcountryitem = await ReadTourCountry();
            const dataToSaveregion = JSON.parse(tourcountryitem);
            data.tourcountryitem = dataToSaveregion.response.body.items;
            datadispatch(data);
          }

          
            await useSleep(1000);
            ListmapDraw(data.tourcountryitem);
        }
        FetchData();
    }, [])

      /**
   * 페이지내에 스크롤을 막아 주는 코드입니다 
   */
   useEffect(() => {
    document.documentElement.style.scrollbarGutter = 'stable'; // 추가

    if (show) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

 
    function findMapIndex(id, items){
        console.log("TCL: findWorkIndex -> workitems", items)
    
       const FindIndex =  items.findIndex(x=>x.appnNo  === id)
    
       return FindIndex;
      }

    const _handleControlFromMap = (id, items) =>{
        let FindIndex = findMapIndex(id, items);
        setItem(items[FindIndex]);

        setRefresh((refresh) => refresh+1);
    }


    const _handleClose = ()=>{
        setItem(null);
        setRefresh((refresh) => refresh +1);
    } 


    const _handleExmap = () =>{
      navigate("/Mobilemap" ,{state :{WORK_ID :"", TYPE : ""}});
    }


    function ListmapDraw(datas){
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
            center: new kakao.maps.LatLng(user.latitude, user.longitude), // 지도의 중심좌표
            level: BasicLevel // 지도의 확대 레벨
    };



    var map = new kakao.maps.Map(mapContainer, mapOption);


    var overlaysTmp = [];
    var overlays = [];


    for (var i = 0; i < datas.length; i ++){
        let overlay = {
        POSITION : {},
        NAME : "",
        ITEMS :datas,
        id :"",
        }

   
        let latitude = "";
        let longitude = "";


  

        latitude = datas[i].latitude;
        longitude =  datas[i].longitude;


        overlay.POSITION = new kakao.maps.LatLng(latitude, longitude);
        overlay.id = datas[i].appnNo;
        overlay.NAME = datas[i].relicsNm;
        overlay.ITEMS = datas
        overlaysTmp.push(overlay);

    }



    // 오버레이를 지도에 추가하고 클릭 이벤트 처리
    overlaysTmp.forEach(function(overlayData, index) {


        // Custom Overlay 내용 생성
        var content = document.createElement('div');
        content.className = 'maptourregionlay';

        content.innerHTML =
        '  <a>' +
        '    <div>' +
        '    <img src="'+ imageDB.tourcountry+'"style="width:32px;"/>' +
        '    </div>' +
        '    <div class="title">'+overlayData.NAME +'</div>' +
        '  </a>' +
        '</div>';

        // Custom Overlay 생성
        var customOverlay = new kakao.maps.CustomOverlay({
            position: overlayData.POSITION,
            content: content,
            clickable: true // 클릭 가능하도록 설정
        });

        var customData = {
            id: overlayData.id,
            items : overlayData.ITEMS
        };
        customOverlay.customData = customData;
        // Custom Overlay 지도에 추가
        customOverlay.setMap(map);

        overlays.push(customOverlay);
        
        // 클릭 이벤트 등록 
        // 지도에서 클릭 햇을때는 리스트에서 클릭 했을때와 달리 별도로 circle을 표시할 필요는 없다
        content.addEventListener('click', function(event) {
           _handleControlFromMap(customOverlay.customData.id, customOverlay.customData.items);

        });



    });


    //오버레이를 변수에 담아둔다
    setOverlays(overlays);

    setCurrentloading(false);
    setRefresh((refresh) => refresh +1);


    // 확대/축소 레벨 제한 설정
    const minLevel = 1;
    const maxLevel = 9;
    }

    return (

    <Container style={containerStyle}>
      {
        item != null && <PopupWorkEx>
          
          <div style={{display:"flex", flexDirection:"column",width:"100%" }}>

            <TableLayout>
              <Table class="work-table" style={{marginTop:20, height:500}}>
                <tbody>
                  <tr>
                    <td className="fixed-size">유적지 번호</td>
                    <td>{item.appnNo }</td>
                  </tr>    
                  {
                    item.institutionNm != ''&& 
                    <tr>
                    <td className="fixed-size">유적지 관리</td>
                    <td>{item.institutionNm }</td>
                  </tr> 
                  }
                  {
                    item.lnmadr != ''&& 
                    <tr>
                    <td className="fixed-size">유적지 주소</td>
                    <td>{item.lnmadr }</td>
                  </tr> 
                  }
                {
                    item.phoneNumber != ''&& 
                    <tr>
                    <td className="fixed-size">전화번호</td>
                    <td>{item.phoneNumber }</td>
                  </tr> 
                  }

                  {
                    item.posesnSe != ''&& 
                    <tr>
                    <td className="fixed-size">사유지여부</td>
                    <td>{item.posesnSe }</td>
                  </tr> 
                  }


                  {
                    item.relicsIntrcn != ''&& 
                    <tr>
                    <td className="fixed-size">유적지 설명</td>
                    <td>{item.relicsIntrcn }</td>
                  </tr> 
                  }
                  {
                    item.relicsKnd != ''&& 
                    <tr>
                    <td className="fixed-size">유적지 종류</td>
                    <td>{item.relicsKnd }</td>
                  </tr> 
                  }
                  {
                    item.relicsNm != ''&& 
                    <tr>
                    <td className="fixed-size">유적지 이름</td>
                    <td>{item.relicsNm }</td>
                  </tr> 
                  }
                  {
                    item.relicsSe != ''&& 
                    <tr>
                    <td className="fixed-size">유적지 타입</td>
                    <td>{item.relicsSe }</td>
                  </tr> 
                  }
                    

                </tbody>
              </Table>
   
            </TableLayout>

            <div onClick={_handleClose}
            style={{backgroundColor: "#FF7125",color :"#fff",borderRadius: "4px",padding:"5px",
            display:"flex",justifyContent:"center",alignItems:"center",
            fontSize: 18,height:44, margin:"20px auto 160px", width: "90%", height:"40px"}}>
              닫기
            </div> 
       
          </div>
        </PopupWorkEx>
      }

      {
        currentloading == true  && <LottieAnimation containerStyle={LoadingCommunityStyle} animationData={imageDB.loading}
        width={"50px"} height={'50px'} />
      }
      <div style={{position:"absolute", width:"100%"}}>
        <div id="map" className="Map" style={mapstyle}></div>
      </div>
   
    </Container>
    );

}

export default MobileLifeTourCountry;

