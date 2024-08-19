import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { DataContext } from "../../context/Data";
import { UserContext } from "../../context/User";
import { ReadCommunitySummary } from "../../service/CommunityService";
import { ReadRoom } from "../../service/RoomService";
import { ReadWork } from "../../service/WorkService";
import { useSleep } from "../../utility/common";
import { imageDB } from "../../utility/imageData";





const Container = styled.div`
  height: 100vh;
  display : flex;
  justify-content:center;
  alignItems:center;
  width :100%;


`
const style = {
  display: "flex"
};



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const PCSplashcontainer =({containerStyle}) =>  {

/** PC 웹 초기 구동시에 데이타를 로딩 하는 component
 * ① 상점정보를 불러온다
 * ② 상점정보를 불러오는 동안 로딩화면을 보여준다
 */

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const [switchscreen, setSwitchscreen]= useState(false);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  useEffect(()=>{
    setSwitchscreen(switchscreen);
  },[refresh])

  /**
   * 홍여사 웹페이지 초기 구동시에 필요한 데이타를 로딩해서 dataContext에 담아둔다
   * ! 중요
   * ! 함수 호출순서 FetchLocation => FetchData => StartProcess
   * ! FetchLocation 함수
   * ① 지역을 찾았을때 지역 이름을 dataContext 에 설정 해준다
   * ② 지역을 찾았을때 지역 위치을 dataContext 에 설정 해준다
   * TODO 지역을 찾지 못했을때 지역 범위를 설정 해야 한다는 도움말 주소지로 이동 시
   * TODO RoomItems 값을 임의로 설정해주자
 
   * ! FetchData 함수
   * ① 처음 게시판에 들어 갔을때 데이타 로드가 너무 느릴수 있기 때문에 미리 로딩한다 서비스 : ReadCommunitySummary
   * ② 등록된 일감정보를 미리 로딩한다 서비스 : ReadWork
   * 
   * ! StartProcess 함수
   * ① 메인함수로 이동한다
   */
  useEffect(()=>{



    async function StartProcess(){

      setRefresh((refresh) => refresh +1);

     navigate("/PCmain");
    } 

    async function FetchLocation(){

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
          // Geocoder를 사용하여 좌표를 주소로 변환
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const address = result[0].address;

              
              console.log("TCL: FetchLocation -> ", address);
            
              user.address_name = address.address_name;
              user.region_1depth_name = address.region_1depth_name;
              user.region_2depth_name = address.region_2depth_name;
              user.region_3depth_name = address.region_3depth_name;
              user.main_address_no = address.main_address_no;

              geocoder.addressSearch(address.address_name, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                    user.latitude = result[0].y;
                    user.longitude = result[0].x;
                    dispatch(user);
                    FetchData();
                }
              });

              dispatch(user);
              console.log("TCL: FetchLocation -> ", user );
              FetchData();

         
            }else{
              alert("허용 해야 합니다")
            }
          });
   
        },
        (err) => {
          console.error(err);
        }
      );
    };

    async function FetchData(){

      const latitude = "37.630013553801";
      const longitude = "127.15545777991";
      const communityitems = await ReadCommunitySummary();
      const workitems = await ReadWork();
      const roomitems = await ReadRoom();

      data.communityitems = communityitems;
      data.workitems = workitems;
      data.roomitems = roomitems;

      datadispatch(data);
      StartProcess();

    } 

    FetchLocation();

  }, [])




 
  return (

    <Container style={containerStyle}>
        <img src={imageDB.pcslpash} style={{ marginTop:50}} />

    </Container>
  );

}

export default PCSplashcontainer;

