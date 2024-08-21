
import React, { useState, useEffect } from "react";
import {
  HashRouter,
  Route,
  Switch,
  Redirect,
  BrowserRouter,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";
import { BetweenRow, Row } from "../common/Row";
import { COMMNUNITYOPTION, DAYOPTION, OPTIONTYPE } from "../utility/screen";

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;

`;

const LabelItem = styled.div`
  font-weight: 400;
  line-height: 1.5;
  font-size: 16px;
  text-decoration-line: none;
  color: rgb(120, 131, 145);
`;



const SelectBox = (props) => {
  
  const onSelectChange = (e) => {
      
    props.callback(e.target.value);
  };
  
    return (
      <select
        style={{
          fontSize: 16,
          outline: 0,
          outline: 0,
          padding: 10,
          border: "1px solid #ededed",
          color: "#788391",
          width : props.width,
        }}
        onChange={onSelectChange}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    );
};

const SelectItem = ({
    containerStyle,
    placeholder,
    callback,
    option,
    
}) => {


    const [data, setData] = useState("");
    const [refresh, setRefresh] = useState(1);
    const navigate = useNavigate();
    useEffect(() => {
    async function fetchData() {}
    fetchData();
    }, []);

    const [border, setBorder] = useState(false);
    const handleFocusBorder = () => {
      setBorder(true);
    };

    const selectcallback = (data) => {
      console.log("TCL: selectcallback -> data", data)
      callback(data, option);
    };

    return (
      <Container style={containerStyle}>
     
        <div style={{width:"100%"}}>
          {option == OPTIONTYPE.COMMNUNITYOPTION && (
            <BetweenRow style={{width:180}}>
              <LabelItem>{'카테고리'}</LabelItem>
              <SelectBox
                options={COMMNUNITYOPTION}
                callback={selectcallback}
                width={150}
              ></SelectBox>
            </BetweenRow>
  
          )}

          {option == OPTIONTYPE.DAYOPTION && (
            <div style={{width:"100%"}}>
              <SelectBox
                options={DAYOPTION}
                callback={selectcallback}
                width={'100%'}
              ></SelectBox>
            </div>
  
          )}

          <div className={border == true ? "inputFocus" : "inputNoFocus"}></div>
        </div>
      </Container>
    );
};

export default SelectItem;
