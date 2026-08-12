import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import LazyImage from "../common/LasyImage";
import { FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import { ensureHttps } from "../utility/common";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getFontSize } from "../utility/fontsize";



const Container = styled.div`
    width:90%;
    margin : 20px auto;
`
const style = {
  display: "flex"
};

const LableIconLayer = styled.div`
  width: 60px;
  border-radius: 5px;
  height: 30px;
  display:flex;
  justify-content:flex-start;
  align-items:center;
  color :#FE6625;
  font-size: ${() => getFontSize(14)}px;
  font-family:Pretendard-SemiBold;
`
const RecipeContent = styled.div`
  font-size: ${() => getFontSize(14)}px;
  margin-top:10px;
  width:90%;
  color :#66686F
`



const Recipe =({containerStyle, item}) =>  {

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

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{

  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
       
      }
      FetchData();
  }, [])
  
  function EraseName1(recipecontent){
    let oneposition = recipecontent.indexOf('1.');
  

    
    if(oneposition != -1){
      return recipecontent.substring(oneposition +2 ,recipecontent.length);

    }else{
      return recipecontent;
    }
  }
 
  function EraseName2(recipecontent){
    let oneposition = recipecontent.indexOf('2.');


    
    if(oneposition != -1){
      return recipecontent.substring(oneposition +2 ,recipecontent.length);

    }else{
      return recipecontent;
    }
  }
  function EraseName3(recipecontent){
    let oneposition = recipecontent.indexOf('3.');


    
    if(oneposition != -1){
      return recipecontent.substring(oneposition +2 ,recipecontent.length);

    }else{
      return recipecontent;
    }
  }
  function EraseName4(recipecontent){
    let oneposition = recipecontent.indexOf('4.');


    
    if(oneposition != -1){
      return recipecontent.substring(oneposition +2 ,recipecontent.length);

    }else{
      return recipecontent;
    }
  }
  function EraseName5(recipecontent){
    let oneposition = recipecontent.indexOf('5.');


    
    if(oneposition != -1){
      return recipecontent.substring(oneposition +2 ,recipecontent.length);

    }else{
      return recipecontent;
    }
  }
  function EraseName6(recipecontent){
    let oneposition = recipecontent.indexOf('6.');


    
    if(oneposition != -1){
      return recipecontent.substring(oneposition +2 ,recipecontent.length);

    }else{
      return recipecontent;
    }
  }

  function EraseName7(recipecontent){
    let oneposition = recipecontent.indexOf('7.');


    
    if(oneposition != -1){
      return recipecontent.substring(oneposition +2 ,recipecontent.length);

    }else{
      return recipecontent;
    }
  }

  function EraseName8(recipecontent){
    let oneposition = recipecontent.indexOf('8.');


    
    if(oneposition != -1){
      return recipecontent.substring(oneposition +2 ,recipecontent.length);

    }else{
      return recipecontent;
    }
  }

  function EraseName9(recipecontent){
    let oneposition = recipecontent.indexOf('9.');


    
    if(oneposition != -1){
      return recipecontent.substring(oneposition +2 ,recipecontent.length);

    }else{
      return recipecontent;
    }
  }


  function EraseName10(recipecontent){
    let oneposition = recipecontent.indexOf('10.');
  

    
    if(oneposition != -1){
      return recipecontent.substring(oneposition +2 ,recipecontent.length);

    }else{
      return recipecontent;
    }
  }
  return (

    <Container style={containerStyle}>
        {
          item.MANUAL01 != '' &&  <FlexstartRow style={{margin:"10px 0px"}}>
            <LableIconLayer>
                <div>STEP 1</div>
            </LableIconLayer>

            </FlexstartRow>
        }
        {
        item.MANUAL_IMG01 != '' &&
        <>
          {/* <LazyImage src={ensureHttps(item.MANUAL_IMG01)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} /> */}
          

          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG01)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />

          <RecipeContent>{EraseName1(item.MANUAL01)}</RecipeContent>
        </>
    

        }

        {
          item.MANUAL02 != '' &&  <FlexstartRow style={{margin:"20px 0px"}}>
          <LableIconLayer>
              <div>STEP 2</div>
          </LableIconLayer>

          </FlexstartRow>
        }
      {
    
        item.MANUAL_IMG02 != '' && 
        <>
          {/* <LazyImage src={ensureHttps(item.MANUAL_IMG02)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} /> */}

          
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG02)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />

          <RecipeContent>{EraseName2(item.MANUAL02)}</RecipeContent>
        </>

        }
      
        {
          item.MANUAL03 != '' &&   <FlexstartRow style={{margin:"20px 0px"}}>
          <LableIconLayer>
              <div>STEP 3</div>
          </LableIconLayer>
      
          </FlexstartRow>
        }
        {
        item.MANUAL_IMG03 != '' &&
        <>
          {/* <LazyImage src={ensureHttps(item.MANUAL_IMG03)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} /> */}
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG03)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />
          <RecipeContent>{EraseName3(item.MANUAL03)}</RecipeContent>
        </>


        }  

        {
          item.MANUAL04 != '' &&  <FlexstartRow style={{margin:"20px 0px"}}>
          <LableIconLayer>
              <div>STEP 4</div>
          </LableIconLayer>

          </FlexstartRow>
        }

        {
        item.MANUAL_IMG04 != '' &&
        <>
          {/* <LazyImage src={ensureHttps(item.MANUAL_IMG04)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} /> */}
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG04)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />
          <RecipeContent>{EraseName4(item.MANUAL04)}</RecipeContent>
        </>

        }

        {
          item.MANUAL05 != '' &&  <FlexstartRow style={{margin:"20px 0px"}}>
          <LableIconLayer>
              <div>STEP 5</div>
          </LableIconLayer>

          </FlexstartRow>
        }
        {
        item.MANUAL_IMG05 != '' &&
        <>
          {/* <LazyImage src={ensureHttps(item.MANUAL_IMG05)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} /> */}
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG05)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />
          <RecipeContent>{EraseName5(item.MANUAL05)}</RecipeContent>
        </>

        }        
        {
          item.MANUAL06 != '' &&  <FlexstartRow style={{margin:"20px 0px"}}>
          <LableIconLayer>
              <div>STEP 6</div>
          </LableIconLayer>

          </FlexstartRow>
        }
        {
        item.MANUAL_IMG06 != '' &&
        <>
          {/* <LazyImage src={ensureHttps(item.MANUAL_IMG06)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} /> */}
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG06)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />
          <RecipeContent>{EraseName6(item.MANUAL06)}</RecipeContent>
        </>

        } 
        {
          item.MANUAL07 != '' &&  <FlexstartRow style={{margin:"20px 0px"}}>
          <LableIconLayer>
              <div>STEP 7</div>
          </LableIconLayer>

          </FlexstartRow>
        }
        {
        item.MANUAL_IMG07 != '' &&
        <>
          {/* <LazyImage src={ensureHttps(item.MANUAL_IMG07)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} /> */}
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG07)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />
          <RecipeContent>{EraseName7(item.MANUAL07)}</RecipeContent>
        </>

        } 

        {
          item.MANUAL08 != '' &&  <FlexstartRow style={{margin:"20px 0px"}}>
          <LableIconLayer>
              <div>STEP 8</div>
          </LableIconLayer>

          </FlexstartRow>
        }
        {
        item.MANUAL_IMG08 != '' &&
        <>
          {/* <LazyImage src={ensureHttps(item.MANUAL_IMG08)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} /> */}
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG08)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />
          <RecipeContent>{EraseName8(item.MANUAL08)}</RecipeContent>
        </>

        } 
        {
          item.MANUAL09 != '' &&  <FlexstartRow style={{margin:"20px 0px"}}>
          <LableIconLayer>
              <div>STEP 9</div>
          </LableIconLayer>

          </FlexstartRow>
        }
        {
        item.MANUAL_IMG09 != '' &&
        <>
          {/* <LazyImage src={ensureHttps(item.MANUAL_IMG09)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} /> */}
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG09)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />
          <RecipeContent>{EraseName9(item.MANUAL09)}</RecipeContent>
        </>

        } 
        {
          item.MANUAL10 != '' && <FlexstartRow style={{margin:"20px 0px"}}>
          <LableIconLayer>
              <div>STEP 10</div>
          </LableIconLayer>

          </FlexstartRow>
        }
        {
        item.MANUAL_IMG10 != '' &&
        <>
          {/* <LazyImage src={ensureHttps(item.MANUAL_IMG10)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} /> */}
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG10)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />
          <RecipeContent>{EraseName10(item.MANUAL10)}</RecipeContent>
        </>

        } 
        {
          item.MANUAL11 != '' &&  <div>{item.MANUAL11}</div>
        }
        {
        item.MANUAL_IMG11 != '' &&
        // <LazyImage src={ensureHttps(item.MANUAL_IMG11)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} />
           <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG11)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />

        }

        {
          item.MANUAL12 != '' &&  <div>{item.MANUAL12}</div>
        }
        {
        item.MANUAL_IMG12 != '' &&
        // <LazyImage src={ensureHttps(item.MANUAL_IMG12)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} />
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG12)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />

        }
      
        {
          item.MANUAL13 != '' &&  <div>{item.MANUAL13}</div>
        }
        {
        item.MANUAL_IMG13 != '' &&
        // <LazyImage src={ensureHttps(item.MANUAL_IMG13)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} />
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG13)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />

        }  

        {
          item.MANUAL14 != '' &&  <div>{item.MANUAL14}</div>
        }
        {
        item.MANUAL_IMG14 != '' &&
        // <LazyImage src={ensureHttps(item.MANUAL_IMG14)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} />
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG14)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />

        }

        {
          item.MANUAL15 != '' &&  <div>{item.MANUAL15}</div>
        }
        {
        item.MANUAL_IMG15 != '' &&
        //  <LazyImage src={ensureHttps(item.MANUAL_IMG15)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} />

          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG15)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />
        }        
        {
          item.MANUAL16 != '' &&  <div>{item.MANUAL16}</div>
        }
        {
        item.MANUAL_IMG16 != '' &&
        // <LazyImage src={ensureHttps(item.MANUAL_IMG16)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} />
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG16)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />

        } 
        {
          item.MANUAL17 != '' &&  <div>{item.MANUAL17}</div>
        }
        {
        item.MANUAL_IMG17 != '' &&
        // <LazyImage src={ensureHttps(item.MANUAL_IMG17)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} />
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG17)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />

        } 

        {
          item.MANUAL18 != '' &&  <div>{item.MANUAL18}</div>
        }
        {
        item.MANUAL_IMG18 != '' &&
        // <LazyImage src={ensureHttps(item.MANUAL_IMG18)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} />
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG18)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />

        } 

        {
          item.MANUAL19 != '' &&  <div>{item.MANUAL19}</div>
        }
        {
        item.MANUAL_IMG19 != '' &&
        // <LazyImage src={ensureHttps(item.MANUAL_IMG19)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} />
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG19)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />

        } 
        {
          item.MANUAL20 != '' &&  <div>{item.MANUAL20}</div>
        }
        {
        item.MANUAL_IMG20 != '' &&
        // <LazyImage src={ensureHttps(item.MANUAL_IMG20)} containerStyle={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }} />
          <LazyLoadImage
            style={{ borderRadius: 10, background: "#ededed" }}
            src={ensureHttps(item.MANUAL_IMG20)}
            alt="Lazy Loaded Example"
            effect="blur"
            offset={100} // 이미지가 보이기 100px 전 미리 로드
            width={'100%'}
          />

        } 

      
    </Container>
  );

}

export default Recipe;

