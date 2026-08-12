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
import { uploadImage } from "../../../service/UploadService";
import LottieAnimation from "../../../common/LottieAnimation";
import { LoadingCommunityStyle } from "../../../screen/css/common";
import ButtonEx from "../../../common/ButtonEx";
import { UserContext } from "../../../context/User";
import { sleep } from "../../../utility/common";

import { Toaster, toast } from 'sonner';
import { Update_userinfobyusersid } from "../../../service/UserService";

import { getFontSize } from "../../../utility/fontsize";
const Container = styled.ul`
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
  flex-direction: column;

`
const PictureBoxLayer = styled.div`
  height: 250px;
  border: 1px solid #ededed;
  margin-top: 20px;
  display:flex;
  justify-content:center;
  align-items:center;
  width:95%;

`
const LineScan = styled.div`
  position: relative;
  height: 70px;
  background: #ff004e40;
  width: 100%;
    &:after { 
      content: "스캔중입니다.";
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top:25px;
      color:#fff;
      font-size: ${() => getFontSize(18)}px;
  } 
`

const LineSuccessScan = styled.div`
  position: relative;
  height: 70px;
  background: #ff004e40;
  width: 100%;
    &:after { 
      content: "신분증이 정상임을 확인 하였습니다";
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top:25px;
      color:#fff;
      font-size: ${() => getFontSize(18)}px;
  } 
`

const LineFailScan = styled.div`
  position: relative;
  height: 70px;
  background: #ff004e40;
  width: 100%;
    &:after { 
      content: "신분증이 정상임을 확인 할수가 없습니다";
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top:25px;
      color:#fff;
      font-size: ${() => getFontSize(18)}px;
  } 
`
const BoxLayerContent = styled.div`
  font-size: ${() => getFontSize(12)}px;
  margin:10px;
`
const Bottom = styled.div`
  width:100%;
  margin-top:20px;
`


const MobileLadyAuth = ({ USER, USERJUMINF, USERJUMINL, Bankname, Bankuser, Banknum }) => {


    const navigate = useNavigate();
    const { dispatch, user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(1);
    const [licenseimg, setLicenseimg] = useState('');

    const [extractvalue, setExtractvalue] = useState('');
    const [state, setState] = useState(0);
    const fileInput = useRef();

    useEffect(() => {
        const handleTouchMove = (event) => {
            event.preventDefault(); // 다른 영역에서는 차단
        };

        document.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    const handleUploadClick = (e) => {
        fileInput.current.click();
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

            const base64 = uri.substring(pos + 1, uri.length);

            console.log("base64", base64);


            setRefresh((refresh) => refresh + 1);

            callGoogleVIsionApi(base64).then(() => {

            })

        });
    };


    useEffect(() => {
        window.scrollTo(0, 0);
        return () => { };
    }, []);

    useEffect(() => {
        setState(state);
        setLicenseimg(licenseimg);
        setExtractvalue(extractvalue);

    }, [refresh])


    const callGoogleVIsionApi = async (base64) => {
        let url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCLHECQRnVwQCq3HFj35OQxa5JXjBAs-8Q";


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
            .then(async (data) => {

                await sleep(3000);

                console.log("TCL: callGoogleVIsionApi -> data", data.responses[0]);

                if (data.responses[0].fullTextAnnotation.text == undefined) {
                    console.log("out");
                    setState(2);
                    setRefresh((refresh) => refresh + 1);
                    return;
                }
                setExtractvalue(data.responses[0].fullTextAnnotation.text);

                let licencepage1 = "운전";
                let licencepage2 = "주민";


                if ((data.responses[0].fullTextAnnotation.text.indexOf(licencepage1) > 0 ||
                    data.responses[0].fullTextAnnotation.text.indexOf(licencepage2) > 0
                )
                    && (data.responses[0].fullTextAnnotation.text.indexOf(USERJUMINF) > 0)
                    && (data.responses[0].fullTextAnnotation.text.indexOf(USER) > 0)) {
                    setState(1);
                    console.log("TCL: && -> 포함");
                    setRefresh((refresh) => refresh + 1);

                } else {
                    setState(2);
                    console.log("TCL: && -> 비포함");
                    setRefresh((refresh) => refresh + 1);
                }


                // this.setState({
                //   fullTextAnnotation: data.responses[0].fullTextAnnotation.text,
                // });
            })
            .catch((err) => {
                setState(2);
                setRefresh((refresh) => refresh + 1);
                console.log('error : ', err)
            })
    };


    const _handleauthcomplete = async () => {
        // 홍여사 일꾼 등록

        const USERINFO = user.USERINFO;
        const USERS_ID = user.USERS_ID;

        console.log("LadyAuth", USER, USERJUMINF, USERJUMINL, Bankname, Bankuser, Banknum);

        USERINFO.worker = true;
        USERINFO.bankname = Bankname;
        USERINFO.banknum = Banknum;
        USERINFO.bankuser = Bankuser;
        USERINFO.juminf = USERJUMINF;
        USERINFO.juminl = USERJUMINL;

        // user.bankname = Bankname;
        // user.banknum = Banknum;
        // user.bankuser = Bankuser;
        // user.worker = true;

        // dispatch(user);

        dispatch({
            USERINFO: {
                worker: true,
                bankname: Bankname,
                banknum: Banknum,
                bankuser: Bankuser,
                juminf: USERJUMINF,
                juminl:USERJUMINL

            },
        });


        // dispatch({ ...user,worker: true, bankname: Bankname, banknum: Banknum, bankuser: Bankuser});

        await Update_userinfobyusersid({ USERINFO, USERS_ID });


        toast.info("일꾼으로 등록되었습니다. 이제 일감에 자유롭게 지원할수 있습니다", {
            duration: 1000,
            style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
        })

        navigate("/Mobileconfig");


    }

    const _handleauthcancel = () => {

        setLicenseimg("");
        setExtractvalue("");
        setRefresh((refresh) => refresh + 1);
    }



    return (
        <>

            {loading == true ? (<LottieAnimation containerStyle={LoadingCommunityStyle} animationData={imageDB.loading}
                width={"50px"} height={'50px'} />) :

                <Container style={{ width: "90%", margin: "0 auto", paddingTop: "10px" }}>
               

                    <PictureBoxLayer onClick={handleUploadClick}>
                        {
                            (licenseimg != '' && state == 0) &&
                            <>
                                <img src={licenseimg} style={{ position: "absolute", width: "90%", height: 250 }} />
                                <LineScan className="mobilescan" />
                            </>

                        }

                        {
                            (licenseimg != '' && state == 1) &&
                            <>
                                <img src={licenseimg} style={{ position: "absolute", width: "90%", height: 250 }} />
                                <LineSuccessScan  />
                            </>

                        }

                        {
                            (licenseimg != '' && state == 2) &&
                            <>
                                <img src={licenseimg} style={{ position: "absolute", width: "90%", height: 250 }} />
                                <LineFailScan />
                            </>

                        }



                        {
                            licenseimg == '' &&
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "90%", height: 250 }}>
                                <FaCamera size={40} />
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


                    {
                        state == 0 && <Bottom>
                            <ButtonEx text={'일꾼으로 등록(4/4)'} width={'100'}
                                containerStyle={{ fontSize: () => getFontSize(16) }}
                                bgcolor={'#9f9b9a'} color={'#fff'} />
                        </Bottom>
                    }


                    {
                        state == 1 && <Bottom>
                            <ButtonEx text={'일꾼으로 등록(4/4)'} width={'100'}
                                containerStyle={{ fontSize: () => getFontSize(16) }}
                                onPress={_handleauthcomplete} bgcolor={'#FF7125'} color={'#fff'} />
                        </Bottom>
                    }
                    {
                        state == 2 && <Bottom>
                            <ButtonEx text={'신분증 유효증 검사가 실패 되었습니다'} width={'100'}
                                containerStyle={{ fontSize: () => getFontSize(16) }}
                                onPress={_handleauthcancel} bgcolor={'#FF7125'} color={'#fff'} />
                        </Bottom>
                    }

                    <Toaster position="bottom-right" richColors />
                </Container>


            }
        </>
    );
};

export default React.memo(MobileLadyAuth);
