import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { FaPlus } from "react-icons/fa6";
import { uploadImage } from "../service/UploadService";
import moment from "moment";



const Container = styled.div`
    height: 300px;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    margin-top: 30px;
    margin: 30px auto;
`
const PictureBoxLayer = styled.div`
  height: 200px;
  background: #ededed;
  width: 90%;
  margin-top: 20px;
  display:flex;
  justify-content:center;
  align-items:center;

`
const PictureBoxEnableLayer = styled.div`
  height: 200px;
  background: #fff;
  width: 90%;
  margin-top: 20px;
  display:flex;
  justify-content:center;
  align-items:center;

`

const style = {
  display: "flex"
};





const ImageUploadComponent =({containerStyle, callback}) =>  {

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

  const [img, setImg] = useState('');


  const fileInput = useRef();

  const handleUploadClick = (e) => {
    fileInput.current.click();
  };
 
  const ALLOW_IMAGE_FILE_EXTENSION = "jpg,jpeg,png,bmp";
 
  const ImagefileExtensionValid = (name) => {
    const extention = removeFileName(name);
 
    if (
      ALLOW_IMAGE_FILE_EXTENSION.indexOf(extention) <= -1 ||
      extention == ""
    ) {
      return false;
    }
    return true;
  };
  const removeFileName = (originalFileName) => {
    const lastIndex = originalFileName.lastIndexOf(".");
 
    if (lastIndex < 0) {
      return "";
    }
    return originalFileName.substring(lastIndex + 1).toLowerCase();
  };
 
  const ImageUpload = async (data, data2) => {
    const uri = data;
    const random = data2;
    const URL = await uploadImage({ uri, random });
    return URL;
  };
  
  
  
  const handlefileuploadChange = async (e) => {
    let filename = "";
    const file = e.target.files[0];
    filename = file.name;
 
 
    if (!ImagefileExtensionValid(filename)) {
      window.alert(
        "업로드 대상 파일의 확장자는 bmp, jpg, jpeg, png 만 가능 합니다"
      );
      return;
    }
 
 
    var p1 = new Promise(function (resolve, reject) {
      const reader = new FileReader();

      resizeImage(file, 400, 300, (resizedBlob) => {
      reader.readAsDataURL(resizedBlob);
      reader.onload = () => {
        let img = reader.result;
        resolve(img);
      };
    });
    });
    const getRandom = () => Math.random();
    const now =  Date.now();
    console.log("TCL: handlefileuploadChange -> now", now)
 
    p1.then(async (result) => {
      const uri = result;
 
      let image_ = await ImageUpload(uri, now);
      const IMGTYPE = true;
      console.log("uri", image_);
 
      setImg(image_);
      callback(image_);

      setRefresh((refresh) => refresh +1);
 
 
    });
  };

  function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // 이미지 비율을 유지하면서 최대 크기 조정
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Canvas 데이터를 Blob으로 변환
            canvas.toBlob((blob) => {
                callback(blob);
            }, file.type);
        };
    };
  };

  useEffect(()=>{
    setImg(img);
  }, [refresh])

 
  return (

    <Container style={containerStyle}>
        {
            img != '' && 
            <PictureBoxEnableLayer onClick={handleUploadClick}>
                <div style={{position:"absolute",zIndex:2, background:"#000", borderRadius:"100px"}}>
                <FaPlus size={50} color={"#fff"}/>
                </div>
                <img src={img} style={{position:"absolute", width:"300px", height:230}}/>
            </PictureBoxEnableLayer>
        
        }
        {
            img == '' && 
            <PictureBoxLayer onClick={handleUploadClick}>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", width:"90%", height:230}}>
            <FaPlus size={24}/>
            </div>
            </PictureBoxLayer>
        }
        
        <input
            type="file"
            ref={fileInput}
            onChange={handlefileuploadChange}
            style={{ display: "none" }}
            />

    </Container>
  );

}

export default ImageUploadComponent;

