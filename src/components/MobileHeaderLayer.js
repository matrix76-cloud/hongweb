
import { Table } from "@mui/material";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { imageDB } from "../utility/imageData";
import { getFontSize } from "../utility/fontsize";


const Container = styled.div`
    display: flex;
    flex-direction : row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height:50px;
    border-bottom : 1px solid #ededed;
    background : #fff;
    z-index: 10;
    position : fixed;
    top: env(safe-area-inset-top);
    font-family : Pretendard-SemiBold;


`


const MobileHeaderLayer = ({ containerStyle, name, callback }) => {


    const _handleprev = () => {
        callback();
    }

    return (
        <Container onClick={_handleprev} >
            <div style={{ display: "flex", fontSize:getFontSize(20), color: "#131313", alignItems: "center", paddingLeft: 15 }}>
            <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} />
                <div style={{ paddingLeft: 25 }}>
                    {name.slice(0, 17)}
                    {name > 17 ? "..." : null}

                </div>
            </div>

        </Container>

    );

}

export default MobileHeaderLayer;

