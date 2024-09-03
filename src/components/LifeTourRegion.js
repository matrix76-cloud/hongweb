import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../common/Button";
import { Column } from "../common/Column";
import LottieAnimation from "../common/LottieAnimation";
import { UserContext } from "../context/User";
import { useSleep } from "../utility/common";
import { imageDB } from "../utility/imageData";




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
  position: absolute;
  width: 400px;
  background: #fff;
  z-index: 5;
`

const TableLayout = styled.div`
  overflow-y: scroll;
  height: calc(-100px + 100vh);
  scroll-behavior: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:100%;
  z-index:5;
`
  
/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


const LifeTourRegion =({containerStyle, items}) =>  {

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
            await useSleep(1000);
            ListmapDraw(items)
        }
        FetchData();
    }, [])

 
    function findMapIndex(id, items){
        console.log("TCL: findWorkIndex -> workitems", items)
    
       const FindIndex =  items.findIndex(x=>x.lnmadr  === id)
    
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



    function ListmapDraw(datas){
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
            center: new kakao.maps.LatLng(37.625660993622, 127.14833958893), // 지도의 중심좌표
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
        overlay.id = datas[i].lnmadr;
        overlay.NAME = datas[i].trrsrtNm;
        overlay.ITEMS = datas
        overlaysTmp.push(overlay);

    }



    // 오버레이를 지도에 추가하고 클릭 이벤트 처리
    overlaysTmp.forEach(function(overlayData, index) {


        // Custom Overlay 내용 생성
        var content = document.createElement('div');
        content.className = 'mapcampingoverlay';

        content.innerHTML =
        '  <a>' +
        '    <div>' +
        '    <img src="'+ imageDB.movegps+'"style="width:32px;"/>' +
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
          
          <div style={{display:"flex", flexDirection:"row",width:"100%" }}>

            <TableLayout>
            <Table class="work-table" style={{marginTop:20, height:500}}>
              <tbody>
                <tr>
                  <td>관광지명</td>
                  <td>{item.trrsrtNm }</td>
                </tr>    
                {
                   item.trrsrtSe != ''&& 
                   <tr>
                   <td>관광지 구분</td>
                   <td>{item.trrsrtSe }</td>
                 </tr> 
                }
                {
                   item.trrsrtSe != ''&& 
                   <tr>
                   <td>관광지 구분</td>
                   <td>{item.trrsrtSe }</td>
                 </tr> 
                }
               {
                   item.cnvnncFclty != ''&& 
                   <tr>
                   <td>공공편익시설정보</td>
                   <td>{item.cnvnncFclty }</td>
                 </tr> 
                }

                {
                   item.stayngInfo != ''&& 
                   <tr>
                   <td>숙박시설정보</td>
                   <td>{item.stayngInfo }</td>
                 </tr> 
                }


                {
                   item.mvmAmsmtFclty != ''&& 
                   <tr>
                   <td>오락시설정보</td>
                   <td>{item.mvmAmsmtFclty }</td>
                 </tr> 
                }
                {
                   item.recrtClturFclty != ''&& 
                   <tr>
                   <td>문화시설정보</td>
                   <td>{item.recrtClturFclty }</td>
                 </tr> 
                }
                {
                   item.hospitalityFclty != ''&& 
                   <tr>
                   <td>접객시설정보</td>
                   <td>{item.hospitalityFclty }</td>
                 </tr> 
                }
                {
                   item.sportFclty != ''&& 
                   <tr>
                   <td>문화시설정보</td>
                   <td>{item.sportFclty }</td>
                 </tr> 
                }
                    {
                   item.aceptncCo != ''&& 
                   <tr>
                   <td>문화시설정보</td>
                   <td>{item.aceptncCo }</td>
                 </tr> 
                }
                    {
                   item.prkplceCo != ''&& 
                   <tr>
                   <td>주차가능수</td>
                   <td>{item.prkplceCo }</td>
                 </tr> 
                }
                    {
                   item.trrsrtIntrcn != ''&& 
                   <tr>
                   <td>관광지소개</td>
                   <td>{item.trrsrtIntrcn }</td>
                 </tr> 
                }
                    {
                   item.phoneNumber != ''&& 
                   <tr>
                   <td>전화번호</td>
                   <td>{item.phoneNumber }</td>
                 </tr> 
                }

                {
                   item.institutionNm != ''&& 
                   <tr>
                   <td>관리기관</td>
                   <td>{item.institutionNm }</td>
                 </tr> 
                }



              </tbody>
            </Table>



            <Button text={"닫기"} onPress={_handleClose}
            containerStyle={{backgroundColor: "#ff4e19",color :"#fff",border :"1px solid #C3C3C3",borderRadius: "4px",
            fontSize: 16,height:44, margin:"20px auto 10px", width: "350px", height:"40px"}}/> 
            </TableLayout>
       


          
          </div>
        </PopupWorkEx>
      }

      {
        currentloading == true  && <LottieAnimation containerStyle={{zIndex:11, marginTop:'10%'}} animationData={imageDB.loading}/>
      }

      <div id="map" className="Map" style={mapstyle}></div>
    </Container>
    );

}

export default LifeTourRegion;

