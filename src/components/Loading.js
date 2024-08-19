import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { useSleep } from "../utility/common";
import { imageDB } from "../utility/imageData";
import { LoadingType } from "../utility/screen";



const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 800px;
  position: absolute;
  margin: 0 auto;
  width: 100%;
  top: -150px;
  height:1000px;
  zIndex:11,
  position:absolute;
`
const style = {
  display: "flex"
};

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;



const Loading =({containerStyle,type, callback}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  /**
   * type 별로 동작 하는 비지니스 로직을 구현한다
   * ① LoadingType.CURRENTPOS이 type 일경우에는
   *  FetchLocation() 함수를 호출하여 지역정보을 userContext에 저장한다
   * callback 함수를 호출하게 되면 로딩 화면이 닫히도록 된다
   * TODO 테스트를 위해 2초 지연시간을 둔다
   */
  useEffect(()=>{

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
                    callback();
       
                }
              });

     
            }else{
          
            }
          });
   
        },
        (err) => {
          console.error(err);
        }
      );
    };

    async function FetchData(){
      await useSleep(2000);

      if(type == LoadingType.CURRENTPOS){
        FetchLocation();
   
      }
  
    }
    FetchData();
 
  },[refresh])

 
  return (

    <Container style={containerStyle}>
      {
        type == LoadingType.CURRENTPOS &&      
         <img src={imageDB.sample30} style={{width:100, height:100}} />
      }
      {/* {
        type == LoadingType.AI &&      
         <img src={imageDB.sample30} style={{width:100, height:100,
          zIndex:11,
          position:"absolute", top:'50%', left:'48%'}} />
      } */}
   
    </Container>
  );

}

export default Loading;

