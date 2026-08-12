import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useSpring, animated } from '@react-spring/web';

import styled from 'styled-components';
import { imageDB } from '../utility/imageData';
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from '../common/Row';
import { UserContext } from '../context/User';
import { ReadCATEGORY } from '../service/CategoryService';
import { useNavigate } from 'react-router-dom';

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { ko, se } from 'date-fns/locale';
import { FaRegCalendarCheck } from "react-icons/fa6";

import MobileRecipeDetail from '../components/MobileRecipeDetail';
import MobileLifeTourDetailPicture from '../components/MobileLifeTourDetailPicture';
import KakaoShare from '../components/KakaoShare';
import { KnowMenu } from '../utility/screen';
import { getFontSize } from '../utility/fontsize';
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
    top: '0%',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    width: 400,
    bgcolor: '#fff',
    boxShadow: 24,
    padding: '0px 34px',
    zIndex: 100,
    marginLeft:'20px'
};


const MainTitle = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-family : Pretendard-SemiBold;
  margin-top:50px;
  padding-left:15px;

`
const WEBTOONIMAGEITEMS1 = [
  imageDB.guide1,
  imageDB.guide2,
  imageDB.guide3,
  imageDB.guide4,
  imageDB.guide5,
  imageDB.guide6,
  imageDB.guide7,
  imageDB.guide8,
  imageDB.guide9,
  imageDB.guide10,
  imageDB.guide11,
  imageDB.guide12,
  imageDB.guide13,

]

const WEBTOONIMAGEITEMS2 = [
  imageDB.transaction1,
  imageDB.transaction2,
  imageDB.transaction3,
  imageDB.transaction4,
  imageDB.transaction5,
  imageDB.transaction6,
  imageDB.transaction7,
  imageDB.transaction8,
  imageDB.transaction9,
  imageDB.transaction10,
  imageDB.transaction11,
  imageDB.transaction12,


]


const WEBTOONIMAGEITEMS3 = [
    imageDB.fridge1,
    imageDB.fridge2,
    imageDB.fridge3,
    imageDB.fridge4,
    imageDB.fridge5,
    imageDB.fridge6,
    imageDB.fridge7,
    imageDB.fridge8,
]

const WEBTOONIMAGEITEMS4 = [
  imageDB.homework1,
  imageDB.homework2,
  imageDB.homework3,
  imageDB.homework4,
  imageDB.homework5,
  imageDB.homework6,
  imageDB.homework7,
  imageDB.homework8,


]

const WEBTOONIMAGEITEMS5 = [
  imageDB.smartmemo1,
  imageDB.smartmemo2,
  imageDB.smartmemo3,
  imageDB.smartmemo4,
  imageDB.smartmemo5,
  imageDB.smartmemo6,
  imageDB.smartmemo7,
  imageDB.smartmemo8,


]

const WEBTOONIMAGEITEMS6 = [
  imageDB.arbeit1,
  imageDB.arbeit2,
  imageDB.arbeit3,
  imageDB.arbeit4,
  imageDB.arbeit5,
  imageDB.arbeit6,
  imageDB.arbeit7,
  imageDB.arbeit8,


]



export default function MobileWebtoonPopup({callback, name}) {
  const [open, setOpen] = React.useState(true);
  const [refresh, setRefresh] = React.useState(-1);
  const navigation = useNavigate();

  const handleClose = () =>{
    setOpen(false);
    callback('');
  } 


  const _handleprev = () =>{
    navigation(-1);
  }



  return (
    <div>


      <MainTitle >{name}</MainTitle>
      {
        name === KnowMenu.Check1 && <div style={{width:"90%", margin:"20px auto"}}>
        {
          WEBTOONIMAGEITEMS1.map((data)=>(
            <img src={data} style={{
              width: '100%',
              padding: '0 16px',
              margin: '12px 0',
              boxSizing: 'border-box',
              borderRadius: '10px',
            }}
 />
          ))
        }
        </div>
      }

      {
        name === KnowMenu.Check2 && <div style={{width:"90%", margin:"20px auto"}}>
        {
          WEBTOONIMAGEITEMS2.map((data)=>(
            <img src={data} style={{
              width: '100%',
              padding: '0 16px',
              margin: '12px 0',
              boxSizing: 'border-box',
              borderRadius: '10px',
            }}
/>
          ))
        }
        </div>
      }

      {
        name === KnowMenu.Check3 && <div style={{width:"90%", margin:"20px auto"}}>
            {
              WEBTOONIMAGEITEMS3.map((data)=>(
                <img src={data} style={{
                  width: '100%',
                  padding: '0 16px',
                  margin: '12px 0',
                  boxSizing: 'border-box',
                  borderRadius: '10px',
                }}
/>
              ))
            }
        </div>
      }
      {
        name === KnowMenu.Check4 && <div style={{ width: "90%", margin: "20px auto" }}>
          {
            WEBTOONIMAGEITEMS4.map((data) => (
              <img src={data} style={{
                width: '100%',
                padding: '0 16px',
                margin: '12px 0',
                boxSizing: 'border-box',
                borderRadius: '10px',
              }}
 />
            ))
          }
        </div>
      }
      
      {
        name === KnowMenu.Check5 && <div style={{ width: "90%", margin: "20px auto" }}>
          {
            WEBTOONIMAGEITEMS5.map((data) => (
              <img src={data} style={{
                width: '100%',
                padding: '0 16px',
                margin: '12px 0',
                boxSizing: 'border-box',
                borderRadius: '10px',
              }}
              />
            ))
          }
        </div>
      }

      {
        name === KnowMenu.Check6 && <div style={{ width: "90%", margin: "20px auto" }}>
          {
            WEBTOONIMAGEITEMS6.map((data) => (
              <img src={data} style={{
                width: '100%',
                padding: '0 16px',
                margin: '12px 0',
                boxSizing: 'border-box',
                borderRadius: '10px',
              }}
              />
            ))
          }
        </div>
      }   

    </div>
  );
}