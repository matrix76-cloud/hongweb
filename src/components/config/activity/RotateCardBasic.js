import React, { useEffect, useState } from 'react';


import {motion} from 'framer-motion';




import { PiLockKeyLight } from "react-icons/pi"
import { sleep } from '../utility/common';

function RotateCardBasic({image, open, index}) {
  const [flip, setFlip] = useState(open);



  useEffect(()=>{
  }, [])

  return (
    <div style={{ perspective: '1000px', margin:"3px" }}>
      <motion.div
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
        >
          <PiLockKeyLight size={22}/>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default RotateCardBasic;


