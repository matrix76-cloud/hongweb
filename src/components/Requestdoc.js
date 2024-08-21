import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column } from "../common/Column";
import { UserContext } from "../context/User";
import { REQUESTINFO } from "../utility/work";




const Container = styled.div`

`
const style = {
  display: "flex"
};


const ItemLayer = styled.div`
  display:flex;
  flex-direction :row;
  justify-content: center;
  align-items:center;
  width:100%; 
  flex-wrap:wrap;
`

const Item = styled.div`
  display:flex;
  flex-direction :column;
  justify-content: center;
  align-items:flex-start;
  width:${({width}) => width}; 
  height:46px;
  margin-top:10px;

`
const FullItem = styled.div`
  display:flex;
  flex-direction :column;
  justify-content: center;
  align-items:flex-start;
  width:100%; 
  height:46px;

  margin-top:10px;

`

const ItemLabel = styled.div`

  color :#131313;
  font-weight : 700;
  font-size :14px;
  line-height:18.2px;
`
const ItemContent = styled.div`
  color :#636363;
  font-weight: 400;
  font-size:15px;
  line-height: 21.8px;
`


const Requestdoc =({containerStyle,INFO, TYPE}) =>  {

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


 
  return (

    <Container style={containerStyle}>

        <Column>
        
        <ItemLayer>
            <FullItem>
            <ItemLabel>구분</ItemLabel>  
            <ItemContent>{TYPE}</ItemContent> 
            </FullItem>

            <Item>
            </Item>
        </ItemLayer>


        <ItemLayer>

            {
            INFO.map((data, index)=>( 
                <>
                {
                (data.type =='response' && data.requesttype != '지역' && data.requesttype !='요구사항'
                &&  data.requesttype != REQUESTINFO.ROOM
                )  &&
                <Item width={ ((index == INFO.length-3 )&& (INFO.length % 2 != 0))  ? ('100%') : ('50%')}>
                <ItemLabel>{data.requesttype}</ItemLabel>  
                <ItemContent>
                {data.result.slice(0, 20)}
                {data.result.length > 20 ? "..." : null}
                </ItemContent> 
                </Item>
                }
                </>     
            ))}

        </ItemLayer>

        <ItemLayer>
        {
                
            INFO.map((data)=>( 
            <>
            {
            (data.type =='response' && data.requesttype == '지역') &&
            <FullItem>
                <ItemLabel>{data.requesttype}</ItemLabel>  
                <ItemContent>{data.result}</ItemContent> 
            </FullItem>
            }
            </>
        ))}
        </ItemLayer>

        <ItemLayer>
        {
                
            INFO.map((data)=>( 
            <>
            {
            (data.type =='response' && data.requesttype == '요구사항') &&
            <FullItem>
                <ItemLabel>{data.requesttype}</ItemLabel>  
                <ItemContent>{data.result}</ItemContent> 
            </FullItem>
            }
            </>
        ))}
        </ItemLayer>

        <ItemLayer>
        {
                
            INFO.map((data)=>( 
            <>
            {
            (data.type =='response' && data.requesttype == REQUESTINFO.ROOM) &&
            <>
            <FullItem>
                <ItemLabel>{data.requesttype}</ItemLabel>  
                <ItemContent>     
                </ItemContent> 
            </FullItem>

            <img src= {data.result} style={{width:"250px", height:"180px"}}/>
            </>
            }
            </>
        ))}
        </ItemLayer>


        </Column>

    </Container>
  );

}

export default Requestdoc;

