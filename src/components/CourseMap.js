import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Row } from "../common/Row";
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
};

const FilterEx = styled.div`
    position: absolute;
    width: 300px;
    height: 100%;
    z-index: 10;
    padding:0px 10px;
    bottom: 10px;
    overflow-y:auto;
    display:flex;
    flex-direction:row;
    right : 0px;

`

const API_KEY = 'aaec66da069fbfc375695166114e2ff5'; // 카카오 REST API 키를 여기에 입력하세요.
const url = 'https://apis-navi.kakaomobility.com/v1/directions';

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;



const InfoPopup = styled.div`
  position: fixed;
  top: 58%;
  left: 50%;
  transform: translate(-50%, -40%);
  background-color: rgba(255,255,255,0.95);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  width: 60%;
  max-height: 50vh; /* 높이를 화면 높이의 50%까지만 차지하게 설정 */
  overflow-y: auto; /* 내용이 길면 내부 스크롤 허용 */
  z-index: 100;
  margin-bottom:30px;
`;


const PopupHeader = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-family : Pretendard-Bold;
`;

const PopupBody = styled.div`
  font-size: ${() => getFontSize(14)}px;
  line-height :1.5;
  padding: 5px 10px; /* 좌우 여백 추가 */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: ${() => getFontSize(14)}px;
  padding: 4px 8px;
`;



const CourseMap =({containerStyle, items}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [map, setMap] = useState(null);

  const [pathCoordinates, setPathCoordinates] = useState([]);

  const [polyline, setPolyline] = useState(null);
  const [linePath, setLinePath] = useState([]);
  const [courseitems, setCourseitems] = useState(items);
  const [markerindexitems, setMarkerindexitems] = useState([]);
  const [courseMarkers, setCourseMarkers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

   // 애니메이션 함수
  const animatePolyline = (polylineInstance, marker, map, courseMarkers) => {
    let index = 0;
    let animationFrameId; // 이걸 맨 위에 선언해주고
    let isAnimationStopped = false; // 중지 플래그 추가!


    const moveMarker = () => {
      if (index >= pathCoordinates.length || isAnimationStopped){
        // 이동 종료 시 명확히 리턴 추가
        console.log('마지막 지점 도착. 이동 끝!');
        return;
      }




      const nextPosition = pathCoordinates[index];
      marker.setPosition(nextPosition);

      const currentPath = polylineInstance.getPath();
      currentPath.push(nextPosition);
      polylineInstance.setPath(currentPath);

      map.panTo(nextPosition);


      const calculateDistance = (latlng1, latlng2) => {
        return Math.sqrt(
          Math.pow(latlng1.getLat() - latlng2.getLat(), 2) +
          Math.pow(latlng1.getLng() - latlng2.getLng(), 2)
        );
      };


      // ✅ 여기서부터 추가되는 부분!
      courseMarkers.forEach((courseMarker, i) => {
        // 마커 위치와 자동차의 위치를 비교
        const markerPos = courseMarker.getPosition();
        const distance = calculateDistance(markerPos, nextPosition);
        // 대략 100미터 이내로 가까워지면 도착했다고 판단 (적절한 거리 설정)
        if (distance < 0.001) {
          const newContent = `
            <div class="mapcourseoverlay3 arrived">
               <div class="title"><span class="flag-icon">&#9873;</span>${i}번 경유지 도착</div>
               <div class="title">${courseitems[i].관광지명}</div>
               <div class="title">이동시간: ${courseitems[i].이동시간}분</div>
            </div>
          `;
          courseMarker.setContent(newContent);

          if (i === courseMarkers.length - 1) { // 마지막 지점일 때 중지
            isAnimationStopped = true; // 중지 플래그를 true로 설정
            cancelAnimationFrame(animationFrameId);
            console.log('마지막 지점 도착! 애니메이션 중지.');
            return;
          }

        }
      });

      index++;
      animationFrameId = requestAnimationFrame(() => setTimeout(moveMarker, 50));
    };

    moveMarker();
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
    animatePolyline(polylineInstance, marker, map, courseMarkers);
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
  }, [refresh])
  


  const handleMarkerClick = (data) => {

    console.log("selected item", data);
    setSelectedItem(data);
  }

  async function FetchData(){

    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng( courseitems[0]["위도(도)"],courseitems[0]["경도(도)"]), // 지도의 중심좌표
        level: 6 // 지도의 확대 레벨
    };


    var map = new kakao.maps.Map(mapContainer, mapOption);

    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT); //

    let tempMarkers = [];
    courseitems.map((data, index =1) =>{
      
        var content = document.createElement('div');

        // 레벨이 7보다 크면 오버레이 숨기기
        content.className = 'mapcourseoverlay2';
        content.innerHTML =
        '  <div>' +
        '    <div class="title">'+(index +1 )+'번' + data["관광지명"] +'</div>' +
        '    <div class="price">' + data["실내구분"] + '/' + data["테마명"] + '</div>' +
        '    <div class="click-info">클릭시 정보보기</div>' +
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
      
        tempMarkers.push(customOverlay);
      
        content.onclick = () => handleMarkerClick(data);

        setMap(map);

  
    })

    setCourseMarkers(tempMarkers);


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
      console.log("MATRIX LOG : FetchData : sortedResults:", sortedResults)


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
      {selectedItem && (
        <InfoPopup>
          <PopupHeader>
            {selectedItem.관광지명}
            <CloseButton onClick={() => setSelectedItem(null)}>닫기</CloseButton>
          </PopupHeader>
          <PopupBody>
            <div>{selectedItem.상세설명}</div>
          </PopupBody>
        </InfoPopup>
      )}
   
      <Column>
      <div style={{display:"flex", width:'100%'}}>
          <div id="map" className="CourseMap" style={mapstyle}></div>
      </div>
      <FilterEx style ={{height:'50px'}}>
          <IconButton onPress={_handleSimulator} icon={'car'} iconcolor={'#fff'} width={'40%'} radius={'5px'} text={'경로 따라가보기'} containerStyle={{
            fontSize: () => getFontSize(16),
            padding: "8px 10px", fontWeight: 500,
            background: "#000000ab",
            borderRadius :"999px",
            color :"#fff",width: '60%',height: '30px'
        }}/>
        
      </FilterEx>
      </Column>

    </Container>
  );

}

export default CourseMap;

