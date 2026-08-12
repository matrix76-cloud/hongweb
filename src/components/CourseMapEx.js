import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import axios from 'axios';
import "../screen/css/common.css"
import { Column } from "../common/Column";
import IconButton from "../common/IconButton";
import { imageDB } from "../utility/imageData";
import { sleep } from "../utility/common";
import { getFontSize } from '../utility/fontsize';

const Container = styled.div`

`
const style = {
  display: "flex"
};

const mapstyle = {
  position: "absolute",
  overflow: "hidden",
  width:'100%',
  height:'700px'
};

const FilterEx = styled.div`
    position: absolute;
    width: 300px;
    height: 100%;
    z-index: 10;
    padding:0px 10px;
    bottom: 100px;
    overflow-y:auto;
    display:flex;
    flex-direction:row;

`

const maplayerstyle ={
  position: "absolute",
  width: "70%",
  left: "16%",
  top: "14%",
}

const PreviouisBtn = styled.div`

    margin: 20px auto 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(51, 51, 51);
    border: 1px solid rgb(195, 195, 195);
    height: 38px;
    font-size: ${() => getFontSize(16)}px;
    font-family: Pretendard-SemiBold;
    width: 100%;
    background:#f9f9f9;
    margin-left:15%;


`


const API_KEY = 'aaec66da069fbfc375695166114e2ff5'; // 카카오 REST API 키를 여기에 입력하세요.
const url = 'https://apis-navi.kakaomobility.com/v1/directions';

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;




const CourseMapEx =({containerStyle, items}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [map, setMap] = useState(null);

  const [pathCoordinates, setPathCoordinates] = useState([]);

  const [polyline, setPolyline] = useState(null);
  const [linePath, setLinePath] = useState([]);
  const [courseitems, setCourseitems] = useState(items);
  const [markerindexitems, setMarkerindexitems ] = useState([]);


  const _handlePrevious = () =>{
    navigate(-1);
  }

   // 애니메이션 함수
  const animatePolyline = (polylineInstance, marker) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= pathCoordinates.length) {
        clearInterval(interval); // 모든 좌표 추가 후 정지
        return;
      }
      // 기존 경로에 새로운 좌표 추가
      const currentPath = polylineInstance.getPath();
      currentPath.push(pathCoordinates[index]);
      polylineInstance.setPath(currentPath);

      marker.setPosition(pathCoordinates[index]);
      // 지도 중심을 현재 좌표로 설정
       map.setCenter(new kakao.maps.LatLng(pathCoordinates[index].Ma, pathCoordinates[index].La));


      index++;
    }, 50); // 각 좌표 간의 간격 (밀리초)

     
  };

  const _handleSimulator = async() =>{
  
    const polylineInstance = new kakao.maps.Polyline({
      map,
      path: [], // 빈 좌표로 시작
      strokeWeight: 5,
      strokeColor: '#ff0000',
      strokeOpacity: 0.8,
    });

        // 마커 생
    const markerImageSrc = imageDB.movecar; // 커스텀 이미지 URL
    const imageSize = new kakao.maps.Size(32, 32); // 이미지 크기 설정
    const imageOption = { offset: new kakao.maps.Point(27, 27) }; // 마커 좌표 기준 위치 설정

    // MarkerImage 객체 생성
    const markerImage = new kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOption);
    
    const marker = new kakao.maps.Marker({
      position: pathCoordinates[0], // 시작점에 마커 배치
      image: markerImage, //
      map,
    });

    setPolyline(polylineInstance);

    // 좌표를 하나씩 추가하며 그리기 시작
    animatePolyline(polylineInstance, marker);
    setRefresh((refresh) => refresh +1);

  }

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setPathCoordinates(pathCoordinates);
    setPolyline(polyline);
    setLinePath(linePath);
    setCourseitems(courseitems);
    setMarkerindexitems(markerindexitems);
  },[refresh])

  async function FetchData(){

    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng( courseitems[0]["위도(도)"],courseitems[0]["경도(도)"]), // 지도의 중심좌표
        level: 6 // 지도의 확대 레벨
    };


    var map = new kakao.maps.Map(mapContainer, mapOption);

    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT); //

    courseitems.map((data, index =1) =>{
      
        var content = document.createElement('div');

        // 레벨이 7보다 크면 오버레이 숨기기
        content.className = 'mapcourseoverlay2';
        content.innerHTML =
        '  <div>' +
        '    <div class="title">'+(index +1 )+'번' + data["관광지명"] +'</div>' +
        '    <div class="price">'+ data["실내구분"] +'/'+data["테마명"]+'</div>' +
        '  </div>' +
        '</div>';

        // Custom Overlay 생성
        var customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(data["위도(도)"], data["경도(도)"]),
            content: content,
            clickable: false // 클릭 가능하도록 설정
        });

        // Custom Overlay 지도에 추가
        customOverlay.setMap(map);

        setMap(map);

  
    })

    let urls = [];
    courseitems.map(async(data, index)=>{

      if(index < courseitems.length-1){
          let params = {
          origin: courseitems[index]["경도(도)"]+','+ courseitems[index]["위도(도)"],       // 출발지 좌표 (경도, 위도)
          destination: courseitems[index+1]["경도(도)"]+','+ courseitems[index+1]["위도(도)"],    // 도착지 좌표 (경도, 위도)
          priority: 'RECOMMEND'                   // 경로 우선순위: 추천(RECOMMEND), 최단거리(DISTANCE), 최단시간(TIME)
        };
        urls.push({id : index, params: params});
      
      }
    })


    try {
      // 모든 요청 병렬 실행
      const requests = urls.map(({ id, params }) =>
        axios.get(url,{
          params,
          headers: {
            Authorization: `KakaoAK ${API_KEY}`
          }
        }).then(response => ({ id, data: response.data }))

      );

      const responses = await Promise.all(requests);

      // id 기준으로 정렬
      const sortedResults = responses.sort((a, b) => a.id - b.id).map(item => item.data);
   


      sortedResults.map((item)=>{
        item.routes[0].sections[0].roads.map((data)=>{
          data.vertexes.map((sub, index)=>{
            if(index % 2 ==0){
              linePath.push(new kakao.maps.LatLng(data.vertexes[index+1], data.vertexes[index]));
            }

          })
         
        })
        // markerindexitems.push(item.routes[0].sections[0].roads[item.routes[0].sections[0].roads.length].vertexes);
        // setMarkerindexitems(markerindexitems);
        setPathCoordinates(linePath);
      })
 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  
 
    setRefresh((refrehs) => refresh +1);

  }

  useEffect(()=>{
    FetchData();
  }, [])

  return (

    <Container style={containerStyle}>
   
      <FlexstartRow style={{width:'15%', marginLeft:"14%"}}>
        <PreviouisBtn onClick={_handlePrevious}>이전 화면 돌아가기</PreviouisBtn> 
      </FlexstartRow>

      <Column>
      <div style={maplayerstyle}>
          <div id="map" className="CourseMap" style={mapstyle}></div>
      </div>
      <FilterEx style ={{height:'50px'}}>
        <IconButton 
          onPress={_handleSimulator} icon={'car'} iconcolor={'#fff'} width={'40%'} radius={'5px'} bgcolor={'#ff7e19'} color={'#131313'} text={'여행 경로 따라가보기'} containerStyle={{fontSize: () => getFontSize(16), padding:"8px 10px", fontWeight:500,
          background: "#fff",
          fontSize: "16px;",width: '60%',height: '30px'
        }}/>
        
      </FilterEx>
      </Column>

    </Container>
  );

}

export default CourseMapEx;

