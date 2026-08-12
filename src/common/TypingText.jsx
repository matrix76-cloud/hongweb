import React, { useState, useEffect, useRef } from 'react';

const ResultContent = {
  width: '730px',
  height: '400px',
  padding: '20px 20px 0px 20px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",
  backgroundColor:"#f9f9f9"
}
const MobileResultContent = {
  width: '90%',
  height: '560px',
  padding: '40px 20px 0px 20px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",
  backgroundColor:"#f9f9f9"
}

const TypingText = ({ text, speed, mobile }) => {
  console.log("TCL: TypingText -> text", text)
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);


  const textareaRef = useRef(null);

  /**
   * 
   * textarea 에 포커스를 자동 으로 이동 시키는 방법입니다
   */
  const handleChange = (event) => {

    // 자동 스크롤 기능
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };


  useEffect(() => {



    if(text != ''){
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + text[index]);
        handleChange();
        index++;
        if (index === text.length -1) {
          clearInterval(interval);
        }
      }, speed);
  
      return () => clearInterval(interval);
    }

  }, [text, speed]);

  if(mobile == true){
    return <textarea 
    ref={textareaRef}
    value ={displayedText} 
    style={MobileResultContent}
    onChange={handleChange}
    ></textarea>;
  }else{
    return <textarea 
    ref={textareaRef}
    value ={displayedText}
    style={ResultContent}
    onChange={handleChange}></textarea>;
  }

 
};

export default TypingText;