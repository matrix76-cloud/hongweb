import React, {memo, useContext, useEffect, useLayoutEffect, useState } from "react";
import { Toaster, toast } from 'sonner';
import styled from 'styled-components';





const Container = styled.div`

`



const Alert =memo(({containerStyle, data, icon}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */

  useEffect(() => {
    console.log("ok");
    toast("ℹ️ 일반 알림입니다.", {
      duration: 5000,
      icon: "💡",
    })

  }, [])

 
  return (

    <Container style={containerStyle}>



    </Container>
  );

})

export default Alert;

