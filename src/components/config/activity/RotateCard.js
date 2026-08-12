import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';


import {motion} from 'framer-motion';




import { PiLockKeyLight } from "react-icons/pi"
import { sleep } from '../utility/common';
import { setRef } from '@mui/material';
import { DataContext } from '../context/Data';
import { Howl } from "howler";




function RotateCard({image, index, item, callback}) {
  
  const [enable, setEnable] = useState(false);
  const [flip, setFlip] = useState(false);
  const [refresh, setRefresh] = useState(-1);
  const { datadispatch, data } = useContext(DataContext);

  
  const playFailBellWithVibration = () => {
    const bellSound = new Audio("/sounds/fail.m4a");
    bellSound.play();
  
    if (navigator.vibrate) {
      navigator.vibrate(200); // 200ms 진동
    }
  };

  const playSuccessBellWithVibration = () => {
    const bellSound = new Audio("/sounds/success.m4a");
    bellSound.play();
  
    if (navigator.vibrate) {
      navigator.vibrate(200); // 200ms 진동
    }
  };
  

  const toggleFlip =async() => {
    if(enable == false){
      return;
    }
    setFlip(!flip);

    if(data.gameitems.length % 2 == 0 || data.gameitems.length ==0 ){
      data.gameitems.push(item);
      datadispatch(data);
    }else{
      const FindIndex = data.gameitems.findIndex(x=>x.index == item.index);

      if(FindIndex != -1){
        data.gameitems.push(item);
        datadispatch(data);

       await sleep(800);
        setFlip(true);
  

        playSuccessBellWithVibration();

        if(data.gameitems.length == 24){
          callback(true, true);
        }else{
          callback(true,false);
        }
      
      }else{
       await sleep(800);
        setFlip(false);
        callback(false, false);
        playFailBellWithVibration();
      }
    }
   
  };

  
  useEffect(()=>{
    setFlip(flip);
    setEnable(enable);
  },[refresh])

  useEffect(()=>{
    async function Open(){
      if(index % 3 != 1){
        setFlip(true);
        await sleep(2000);
        setFlip(false);
        setEnable(true);
      }else{
        await sleep(2000);
        setFlip(true);
        await sleep(1000);
        setFlip(false);
        setEnable(true);
      }
    }
    Open();
  }, [])

  return (
    <div style={{ perspective: '1000px', margin:"3px" }}>

      
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: flip ? 180 : 0 }}
        transition={{ duration: 1 }}
        style={{
          width: '75px',
          height: '75px',
          position: 'relative',
          transformStyle: 'preserve-3d', // 3D 회전 활성화
        }}
      
      >
        {/* Front Card */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            backfaceVisibility: 'hidden', // 뒷면을 숨김
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '12px',
            color: 'black',
            borderRadius: '10px',
          }}
          onClick={toggleFlip}
        >
          <PiLockKeyLight size={22}/>
         
        </motion.div>

        {/* Back Card */}
        <motion.div
          style={{
            position: 'absolute',
            width: '90%',
            height: '90%',
            backgroundColor: '#fff',
            border:"2px solid #ff7e19",
            backfaceVisibility: 'hidden', // 뒷면을 숨김
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '12px',
            color: 'black',
            borderRadius: '10px',
            transform: 'rotateY(180deg)', // 180도 회전하여 뒤집힘
          }}
        >
          <img src={image} style={{width:50}}/>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default RotateCard;

