import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
import {
  HashRouter,
  Route,
  Redirect,
  BrowserRouter,
  Routes,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import styled from "styled-components";




import { FaCamera } from "react-icons/fa";
import { uploadImage } from "../../service/UploadService";
import ButtonEx from "../../common/ButtonEx";
import LottieAnimation from "../../common/LottieAnimation";
import { LoadingCommunityStyle } from "../../screen/css/common";
import { imageDB } from "../../utility/imageData";



const Container = styled.ul`
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
  flex-direction: column;
  list-style-type :disc;
`
const PictureBoxLayer = styled.div`
  height: 250px;
  background: #ededed;
  margin-top: 20px;
  display:flex;
  justify-content:center;
  align-items:center;
  width:100%;

`
const LineScan = styled.div`
  position: relative;
  height: 100px;
  background: #ff004e40;
  width: 100%;
    &:after { 
      content: "스캔중입니다.";
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top:40px;
      color:#fff;
      font-size: 18px;
  } 
`
const BoxLayerContent = styled.li`
  font-size:12px;
  margin:10px;
`
const Bottom = styled.div`
position: fixed;
bottom: 20px;
width:100%;
`


const MobileLadyLicenseAuthcontainer = ({role}) => {
  const navigate = useNavigate();

  const [loading,setLoading] = useState(false);
  const [refresh, setRefresh] = useState(1);
  const [licenseimg, setLicenseimg] = useState('');

  const [extractvalue, setExtractvalue] = useState('');

  const fileInput = useRef();


  const handleUploadClick = (e) => {
    fileInput.current.click();
  };

  const ImageUpload = async (data, data2) => {
    const uri = data;
    const email = data2;
    const URL = await uploadImage({ uri, email });
    return URL;
  };

    
  const handlefileuploadChange = async (e) => {
    let filename = "";
    const file = e.target.files[0];
    filename = file.name;



    var p1 = new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let img = reader.result;
        resolve(img);
      };
    });
    const getRandom = () => Math.random();
    const email = getRandom();

    p1.then(async (result) => {
      const uri = result;
      setLicenseimg(uri);

      let pos = uri.indexOf(",")

      const base64 = uri.substring(pos+1, uri.length);

      console.log("base64", base64);

   
      setRefresh((refresh) => refresh +1);

      callGoogleVIsionApi(base64).then(()=>{

      })

    });
  };


  useEffect(()=>{
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{

    setLicenseimg(licenseimg);
    setExtractvalue(extractvalue);

  }, [refresh])



  const callGoogleVIsionApi = async(base64)=>{
    let url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDik5b11Cw3vqJewRGAKPN8jWs90Ye_pEU";

   
    console.log("base64", base64);


    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64,
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'TEXT_DETECTION', maxResults: 5 },
              { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
              { type: 'WEB_DETECTION', maxResults: 5 },
            ],
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((data) => {

        console.log("TCL: callGoogleVIsionApi -> data", data)
        setExtractvalue(data.responses[0].fullTextAnnotation.text);
        setRefresh((refresh) => refresh +1);
        // this.setState({
        //   fullTextAnnotation: data.responses[0].fullTextAnnotation.text,
        // });
      })
      .catch((err) => console.log('error : ', err));
  };


  const _handleauthcomplete = () =>{
    navigate("/config")
  }


  
  return (
    <>

    {loading == true ? (<LottieAnimation containerStyle={LoadingCommunityStyle} animationData={imageDB.loading}
      width={"50px"} height={'50px'} />) :

        <Container style={{width:"90%", margin:"0 auto", paddingTop:"70px"}}>
          <div>홍여사로 신원인증을 하기 위해서는 운전면허증이나 주민등록증을 첨부해주세요</div>

          <PictureBoxLayer onClick={handleUploadClick}>
            {
              licenseimg != '' && 
              <>
                  <img src={licenseimg} style={{position:"absolute", width:"90%", height:250}}/>
                  <LineScan className="scan"/>
              </>
          
            }
            {
              licenseimg == '' && 
              <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", width:"90%", height:250}}>
                  <FaCamera size={40}/>
              </div>
          
            }
        
          </PictureBoxLayer>
          <input
            type="file"
            ref={fileInput}
            onChange={handlefileuploadChange}
            style={{ display: "none" }}
            />

    
          <BoxLayerContent>개인정보 보호법에 의거 첨부된 신분증의 경우는 서버에 보관되지 않으며 자동으로 폐기 됩니다</BoxLayerContent>
          <Bottom>
          <ButtonEx text={'확인'} width={'85'}  
          onPress={_handleauthcomplete} bgcolor={'#FF7125'} color={'#fff'} />
        </Bottom>

        </Container>


    }
    </>
  );
};

export default React.memo(MobileLadyLicenseAuthcontainer);
