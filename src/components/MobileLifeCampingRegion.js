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
import { ReadCampingRegion } from "../service/LifeService";
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
  height: calc(-100px + 100vh);
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


const MobileLifeCampingRegion =({containerStyle}) =>  {


/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [overlays, setOverlays] = useState([]);
  const [item, setItem] = useState();
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

            let items = [];
            if(data.campingregionitem.length == 0){
              const campingitem = await ReadCampingRegion();
              campingitem.map((data, index)=>{
  
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.campingitem, "text/xml");
            
                // 데이터 추출
                const xmlitems = xmlDoc.getElementsByTagName("item");
          
                
                const data2 = [];
  
                for (let i = 0; i < xmlitems.length; i++) {
                  const contentId = xmlitems[i].getElementsByTagName("contentId")[0].textContent; 
                  const facltNm = xmlitems[i].getElementsByTagName("facltNm")[0].textContent;
                  const lineIntro = xmlitems[i].getElementsByTagName("lineIntro")[0].textContent;
                  const intro = xmlitems[i].getElementsByTagName("intro")[0].textContent;
                  const facltDivNm = xmlitems[i].getElementsByTagName("facltDivNm")[0].textContent;
                  const induty = xmlitems[i].getElementsByTagName("induty")[0].textContent;
                  const addr1 = xmlitems[i].getElementsByTagName("addr1")[0].textContent;
                  const resveCl = xmlitems[i].getElementsByTagName("resveCl")[0].textContent;
                  const tooltipme = xmlitems[i].getElementsByTagName("tooltip")[0].textContent;
  
                  const caravInnerFclty = xmlitems[i].getElementsByTagName("caravInnerFclty")[0].textContent;
                  const brazierCl = xmlitems[i].getElementsByTagName("brazierCl")[0].textContent;
                  const sbrsCl = xmlitems[i].getElementsByTagName("sbrsCl")[0].textContent;
                  const sbrsEtc = xmlitems[i].getElementsByTagName("sbrsEtc")[0].textContent;
                  const posblFcltyCl = xmlitems[i].getElementsByTagName("posblFcltyCl")[0].textContent;
                  const animalCmgCl = xmlitems[i].getElementsByTagName("animalCmgCl")[0].textContent;
                  const firstImageUrl = xmlitems[i].getElementsByTagName("firstImageUrl")[0].textContent;
  
                  const mapX = xmlitems[i].getElementsByTagName("mapX")[0].textContent;
                  const mapY = xmlitems[i].getElementsByTagName("mapY")[0].textContent;
                  const tel = xmlitems[i].getElementsByTagName("tel")[0].textContent;
                  const homepage = xmlitems[i].getElementsByTagName("homepage")[0].textContent;
  
                  
                  items.push({contentId,facltNm,lineIntro,intro,facltDivNm,induty,addr1, resveCl, tooltipme,caravInnerFclty,brazierCl,sbrsCl, sbrsEtc,
                    posblFcltyCl,animalCmgCl,firstImageUrl,mapX,mapY,tel,homepage})
                }
  
              
  
              })
  
              data.campingregionitem = items;
              datadispatch(data);
            }
    
            await useSleep(1000);
            ListmapDraw(data.campingregionitem)
        }
        FetchData();
    }, [])

 
    const _handleExmap = () =>{
      navigate("/Mobilemap" ,{state :{WORK_ID :"", TYPE : ""}});
    }


    function findMapIndex(id, items){
        console.log("TCL: findWorkIndex -> workitems", items)
    
       const FindIndex =  items.findIndex(x=>x.contentId  === id)
    
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
    console.log("TCL: ListmapDraw -> datas", datas)
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


  

        latitude = datas[i].mapY;
        longitude =  datas[i].mapX;


        overlay.POSITION = new kakao.maps.LatLng(latitude, longitude);
        overlay.id = datas[i].contentId;
        overlay.NAME = datas[i].facltNm;
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
        '    <img src="'+ imageDB.camping+'"style="width:32px;"/>' +
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
                  <td>캠핑장명</td>
                  <td>{item.facltNm }</td>
                </tr>   
                {
                   item.addr1 != ''&& 
                   <tr>
                   <td>주소지</td>
                   <td>{item.addr1 }</td>
                 </tr>  
                }
                {
                   item.animalCmgCl != ''&& 
                   <tr>
                   <td>애완동물</td>
                   <td>{item.animalCmgCl }</td>
                 </tr>  
                }
                {
                   item.brazierCl != ''&& 
                   <tr>
                   <td>개별여부</td>
                   <td>{item.brazierCl }</td>
                 </tr>  
                }
                {
                   item.caravInnerFclty != ''&& 
                   <tr>
                   <td>시설</td>
                   <td>{item.caravInnerFclty }</td>
                 </tr>  
                }
                {
                   item.facltDivNm != ''&& 
                   <tr>
                   <td>민간여부</td>
                   <td>{item.facltDivNm }</td>
                 </tr>  
                }
                {
                   item.firstImageUrl != ''&& 
                   <tr>
                   <td>캠핑장사진</td>
                   <td> <img src={item.firstImageUrl } style={{width:200, height:200}}/></td>
                 </tr>  
                }
                {
                   item.homepage != ''&& 
                   <tr>
                   <td>홈페이지</td>
                   <td>
                   {item.homepage.slice(0, 35)}
                   {item.homepage.length > 35 ? "..." : null}
                   </td>
                 </tr>  
                }
                {
                   item.lineIntro != ''&& 
                   <tr>
                   <td>요약</td>
                   <td>{item.lineIntro }</td>
                 </tr>  
                }
                {
                   item.intro != ''&& 
                   <tr>
                   <td>소개글</td>
                   <td>{item.intro }</td>
                 </tr>  
                }
                {
                   item.posblFcltyCl != ''&& 
                   <tr>
                   <td>수영장</td>
                   <td>{item.posblFcltyCl }</td>
                 </tr>  
                }
                {
                   item.sbrsEtc != ''&& 
                   <tr>
                   <td>기반시설</td>
                   <td>{item.sbrsEtc }</td>
                 </tr>  
                }
                {
                   item.tel != ''&& 
                   <tr>
                   <td>전화번호</td>
                   <td>{item.tel }</td>
                 </tr>  
                }
                {
                   item.tooltipme != ''&& 
                   <tr>
                   <td>주변</td>
                   <td>{item.tooltipme }</td>
                 </tr>  
                }
              </tbody>

              <tr>
          
                <td colSpan={2}> <Button text={"닫기"} onPress={_handleClose}
            containerStyle={{backgroundColor: "#FF7125",color :"#fff",borderRadius: "4px",
            fontSize: 16,height:44, margin:"10px auto 50px", width: "90%", height:"40px"}}/> </td>
              </tr>

            </Table>

            </TableLayout>
          </div>
        </PopupWorkEx>
      }
      {
        currentloading == true  && <LottieAnimation containerStyle={LoadingCommunityStyle} animationData={imageDB.loading}
        width={"50px"} height={'50px'}/>
      }

      <div style={{position:"absolute", width:"100%"}}>
        <div id="map" className="Map" style={mapstyle}></div>
    
      </div>

    </Container>
    );

}

export default MobileLifeCampingRegion;

