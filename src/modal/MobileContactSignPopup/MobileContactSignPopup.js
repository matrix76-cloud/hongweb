import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSpring, animated } from '@react-spring/web';


import styled from 'styled-components';
import { imageDB, Seekimage } from '../../utility/imageData';
import { BetweenRow, Row } from '../../common/Row';
import { REQUESTINFO, WORKNAME } from '../../utility/work';
import Button from '../../common/Button';
import { ButtonGroupContext } from '@mui/material';
import MobileWorkMapPopup from '../MobileMapPopup/MobileWorkMapPopup';

import moment from "moment";
import { getDateFullTime, getTime, getDate } from "../../utility/date";
import { Column } from '../../common/Column';
import MobileSignPopup from '../MobileSignPopup/MobileSignPopup';
import MobileSuccessPopup from '../MobileSuccessPopup/MobileSuccessPopup';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import MobileFailPopup from '../MobileFailPopup/MobileFailPopup';
import { CreateContact, ReadContactByIndividually, UpdateContactByContactID, UpdateContactByLeftSign } from '../../service/ContactService';
import { CONTACTTYPE } from '../../utility/screen';


const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};
//   transform: 'translate(-50%, -50%)',
const style = {
    position: 'absolute',
    top: '55%',
    left: '50%',
    height:'650px',
    overflowY:"auto",
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: '14px 34px',
    zIndex:100,
};
const IconCloseView = styled.div`

`
const MainData = styled.div`
  display :flex;
  flex-direction:column;
  background-color : #fff;
  flex-wrap : wrap;
  margin: 0 auto;
  width:100%;
`
const ContactMain = styled.div`
  display: flex;
  justify-content: center;
  font-size: 25px;
  margin-bottom: 10px;
`
const ContactContent = styled.div`
  display: flex;
  justify-content: center;
  font-size: 14px;
  margin-bottom: 10px;
`

const HeaderPopupline = styled.div`

  width:20%;
  background:#E3E3E3;
  height:4px;
`

const InfoBox = styled.div`
  font-size: 14px;
  margin: 15px 0px 5px;
  background: #f9f9f9;
  margin: 10px auto;
  width: 85%;
  padding: 10px;
  text-align: left;
  line-height: 2;
  border-radius: 10px;
  color: #131313;

`
const ResultContent = {
  width: '250px',
  fontSize: '14px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border :'1px solid #dadada',
  borderRadius:'5px',
  marginLeft:10

}

const SignLine = styled.div`
  width: 100px;
  height: 70px;
  border-bottom: 1px solid #ededed;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:10px;
  font-style: italic;
`

const InputContent = {
  width:'90%',
  margin:'0px auto',
  border :'1px solid #dadada',
  borderRadius: '5px',
  backgroundColor :'#fff',
  fontFamily: 'Pretendard-Light',
  flex: '0 0 auto',
}

export default function MobileContactSign({callback, messages, WORKTYPE, OWNER, WORK_ID, OWNER_ID,SUPPORTER_ID }) {
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);

  const [popupstatus, setPopupstatus] = React.useState(false);
  const [signstatus, setSignstatus] = React.useState(false);
  const [signsuccess, setSignsuccess] = React.useState(false);
  const [signfail, setFailsuccess] = React.useState(false);
  const [latitude, setLatitude] = React.useState('');
  const [longitudie, setLongitude] = React.useState('');
  const [worktype, setWorktype] = React.useState(WORKTYPE);

  const [leftsign, setLeftsign] = React.useState('');
  const [rightsign, setRightsign] = React.useState('');
  const [messageitems, setMessageitems] = React.useState(messages);
  const [contactitem, setContactitem] = React.useState({});

  const [left, setLeft] = React.useState(true);

  const printRef = React.useRef();

  const handleClose = async() =>{
 

    if(OWNER && contactitem.CONTACT_ID && leftsign == ''){
      const CONTACT_INFO = messageitems;
      const CONTACT_ID = contactitem.CONTACT_ID;
      const updatecontact = await UpdateContactByContactID({CONTACT_ID,CONTACT_INFO});
    }
    setOpen(false);
    setPopupstatus(false)
    callback([]);

   // handleDownloadPdf();
  } 

  const handleDownloadPdf = async () => {
    // 지정된 요소를 캔버스로 변환
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');

    // PDF 인스턴스 생성
    const pdf = new jsPDF();

    // PDF에 캔버스 데이터를 이미지로 추가
    pdf.addImage(data, 'PNG', 50, 0, 100, 297); // A4 크기에 맞게 추가 (단위: mm)
    pdf.save('홍여사계약서.pdf'); // PDF 다운로드
  };

  const popupcallback = async () => {
    setPopupstatus(false);
    setRefresh((refresh) => refresh +1);
  };

  const signcallback = async (data) => {
    setSignstatus(false);
    setSignsuccess(true);

    if(left){
      setLeftsign(data);
      const CONTACT_STATUS = CONTACTTYPE.SUPPROTER;
      const LEFT_SIGN = data;

      const CONTACT_ID =contactitem.CONTACT_ID;
      await UpdateContactByLeftSign({CONTACT_ID, LEFT_SIGN});

    }else{
      setRightsign(data);
      const CONTACT_STATUS =CONTACTTYPE.OWNER;
      const CONTACT_INFO = messageitems;

      const RIGHT_SIGN = data;
  
      const createcontact =
      await CreateContact({OWNER_ID, CONTACT_STATUS, SUPPORTER_ID,CONTACT_INFO,WORK_ID, RIGHT_SIGN});
    }

    setRefresh((refresh) => refresh +1);
  };
  const signsuccesscallback = async () =>{
    setSignsuccess(false);
    setRefresh((refresh) => refresh +1);
  }
  const signfailcallback = async () =>{
    setFailsuccess(false);
    setRefresh((refresh) => refresh +1);
  }


  

  // LEFT_SIGN이 있는 경우는 수정 할수가 없다 

  React.useEffect(()=>{
    async function FetchData(){

      // CONTACT에 저장된 글이 있는지 
      const CONTACTITEM = await ReadContactByIndividually({WORK_ID, OWNER_ID, SUPPORTER_ID});

      if(CONTACTITEM != -1){
        setMessageitems(CONTACTITEM.CONTACT_INFO);
        setContactitem(CONTACTITEM);
      }

      console.log("TCL: FetchData -> RIGHT_SIGN", CONTACTITEM)
      // SIGN 여부 
      if(CONTACTITEM.RIGHT_SIGN != undefined){
        setRightsign(CONTACTITEM.RIGHT_SIGN);
        console.log("TCL: FetchData -> RIGHT_SIGN", CONTACTITEM.RIGHT_SIGN, OWNER)
      }

      if(CONTACTITEM.LEFT_SIGN != undefined){
        setLeftsign(CONTACTITEM.LEFT_SIGN);
      }

      setRefresh((refresh) => refresh+1);

    }

    FetchData();
  },[])

  React.useEffect(()=>{
    setOpen(open);
    setPopupstatus(popupstatus);  
    setSignstatus(signstatus);
    setSignsuccess(signsuccess);
    setLeftsign(leftsign);
    setRightsign(rightsign);
    setLeft(left);
    setMessageitems(messageitems);
    setContactitem(contactitem);
  },[refresh])


  const _handleMapview= (lat, long, worktype)=>{

    setPopupstatus(true);
    setLatitude(lat);
    setLongitude(long);
    setWorktype(worktype);

    setRefresh((refresh) => refresh +1);

  }

  const _handleleftSign = async() =>{

    if(OWNER){
      return;
    }

    if(rightsign ==''){
      setFailsuccess(true);
      return;
    }
    setSignstatus(true);
    setLeft(true);
    setRefresh((refresh) => refresh +1);
  }
  const _handlerightSign = async() =>{

    if(!OWNER){
      return;
    }

    setSignstatus(true);
    setLeft(false);
    setRefresh((refresh) => refresh +1);
  }


  return (
    <div>

      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>

            {
              popupstatus == true && <MobileWorkMapPopup callback={popupcallback} latitude={latitude} longitude={longitudie}
              top={'30%'}  left={'10%'} height={'280px'} width={'280px'} name={worktype} markerimg={Seekimage(worktype)}
              />
            }

            {
              signstatus == true && <MobileSignPopup callback={signcallback} 
              top={'30%'}  left={'10%'} height={'130px'} width={'280px'} 
              />
            }

            {
              signsuccess == true && <MobileSuccessPopup callback={signsuccesscallback} content={'정상적으로 서명되었습니다'} />
            }

            {
              signfail == true && <MobileFailPopup callback={signfailcallback} content={'의뢰자가 먼저서명 한후에 서명하실수 있습니다. 의뢰자에게 서명 하도록 요청해주세요'} />
            }

            <Row>
              <HeaderPopupline/>
            </Row>
            <BetweenRow style={{width:"80%", margin: "20px auto", }}>
                <div style={{fontSize:"18px", fontWeight:900, color:"#131313", fontFamily:'Pretendard-SemiBold'}}>홍여사 계약서 작성</div>
                <IconCloseView onClick={handleClose} >
                <img src={imageDB.close} style={{width:"22px", height:"22px"}}/>
                </IconCloseView>
            </BetweenRow>

            <div ref={printRef} style={{width:"85%", margin:"0 auto"}}>
            <ContactMain>용역 계약서</ContactMain> 
            <ContactContent>
              본 계약서(이하 "계약서")는 [계약 체결일]에 [용역 수요자] (이하 "수요자")와 [용역 제공자] (이하 "제공자") 간에 체결되었습니다.
            </ContactContent>
            <ContactContent>
              1. 계약 목적
              본 계약은 제공자가 수요자에게 다음의 용역을 제공함에 있어 필요한 사항을 규정함을 목적으로 합니다.
                - [용역 내용 아래의 표에 기재]
            </ContactContent>
            <ContactContent>
              2. 용역 수행 및 기간
              제공자는 [용역 시작일]부터 [용역 종료일]까지 본 계약에 명시된 용역을 성실히 수행해야 합니다.
            </ContactContent>
            <ContactContent>
              3. 비밀 유지
              제공자는 용역 수행 중 수요자로부터 제공받은 모든 기밀 정보를 계약 종료 후에도 비밀로 유지해야 합니다.
            </ContactContent>

            <ContactContent>
            4. 분쟁 해결
              계약과 관련된 모든 분쟁은 [관할 법원]에서 해결합니다.
              본 계약의 효력을 확정하기 위해, 당사자 양측은 아래에 서명합니다.
            </ContactContent>
  

            <MainData>
       
              <table class="workcontact-table" style={{  margin: '10px auto', borderTop: "1px solid #434343"}}>      
              <tbody>
                {
                  messageitems.map((data, index)=>(
                    <>
                    {
                    (data.type =='response' && data.requesttype !='고객님성별'
                    && data.requesttype !='요청성별'
                    && data.requesttype !='요청연령대')
                     &&
                    <>
                    <tr>
                    <td>{data.requesttype}</td>
                    <td>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-start", alignItems:"center",width:"100%"}}>
                    {
                      (data.requesttype == REQUESTINFO.COMMENT)  ? (<textarea style={ResultContent} value={data.result}
                        disabled ={OWNER == false || leftsign != '' }
                        onChange={(e) => {
                          messageitems[index].result =e.target.value;; 
                          setMessageitems(messageitems);
                          setRefresh((refresh) => refresh +1);
                      }}
                      />):(
                        <>
                        {
                          
                          data.requesttype != REQUESTINFO.CUSTOMERREGION &&  <input type={'text'} style={InputContent} value={data.result}
                          class="input"
                          disabled ={OWNER == false || leftsign != '' }
                          onChange={(e) => {
                            messageitems[index].result =e.target.value;; 
                            setMessageitems(messageitems);
                            setRefresh((refresh) => refresh +1);
                        }}/>
                   
                        }
                        </> 
                    )
                    }  

                    {
                      data.requesttype == REQUESTINFO.CUSTOMERREGION &&
                      <Row style={{justifyContent:"flex-start", paddingLeft:10}}>
                      <div>{data.result}</div>
                      <div  onClick={()=>{_handleMapview(data.latitude,data.longitude, messages.WORKTYPE)}}><img src={imageDB.map} style={{width:20}}/> </div>
                      </Row>

                    }
                    </div>
                    </td>
                    </tr>
                    </>
                   
                    }
                    </>                  
                  ))
                }
              </tbody>
              </table>

              <Row>
                계약 체결일 : {getDateFullTime(moment())}
              </Row>

              <BetweenRow style={{width:"70%", margin:"20px auto"}}>
                <Column>
                <div>홍여사 서명</div>
                <SignLine>
                  {
                    leftsign == '' ?( <div onClick={_handleleftSign}>
                      {
                        OWNER == false && <span>서명해주세요</span>
                      }
                    
                      
                      </div>):(
                      <div onClick={_handleleftSign}>
                        <img src={leftsign} style={{width:80}}/>
                      </div>
                    )
                  }
                 
                </SignLine>
                </Column>
                <Column>
                <div>의뢰자 서명</div>
                <SignLine>
                {
                    rightsign == '' ?( <div onClick={_handlerightSign}>

                    {
                        OWNER == true && <span>서명해주세요</span>
                    }

                    </div>):(
                      <div onClick={_handlerightSign}>
                        <img src={rightsign} style={{width:80}}/>
                      </div>
                    )
                  }
                </SignLine>
                </Column>
              </BetweenRow>
          
            </MainData>
            </div>

          </Box>
        </Fade>
      </Modal>
    </div>
  );
}