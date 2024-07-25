

import React, { Fragment, useContext, useEffect, useState} from "react";
import './Footer.css';
import styled from 'styled-components';
import { imageDB } from '../../../utility/imageData';
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import { FiHome, FiUser, FiShare2,FiGrid } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";

const FooterContent = styled.div`
  padding: 20px;
  justify-content: flex-start;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`

const HomeFooter = ({type}) => {
  const navigation = useNavigate();
  const {user, dispatch} = useContext(UserContext);
  const [foottype, setFoottype] = useState(0);
  const [refresh, setRefresh] = useState(1);
  const location = useLocation();

  useEffect(()=>{

  },[refresh])

  const _handleMain=()=>{
    navigation("/main");
  }
  const _handleWork=()=>{
    navigation("/work");  
  }
  const _handleMap=()=>{
    navigation("/map");
  }
  const _handleRoom=()=>{
    navigation("/room");
  }
  const _handleConfig=()=>{
    navigation("/config");
  }


  return (
    <Fragment>
      <footer>
        <div className="site-mobile-footer2">
            <div className="buttonview">
              <div className="button">
                {type == "home" ? (
                  <>
                    <div className="imageicon" onClick={_handleMain}>
                    <FiHome size={25}/>
                    </div>
                    <div className="buttonEnableText">홈</div>
                  </>
                ) : (
                  <>
                    <div className="imageicon" onClick={_handleMain}>
                    <FiHome size={25}/>
                    </div>
                    <div className="buttonDisableText">홈</div>
                  </>
                )}
              </div>
              <div className="button">
                {type == "hong" ? (
                  <>
                    <div className="imageicon" onClick={_handleWork}>
                    <FiUser size={25}/>
                    </div>
                    <div className="buttonEnableText">홍여사구함</div>
                  </>
                ) : (
                  <>
                    <div className="imageicon" onClick={_handleWork}>
                    <FiUser size={25}/>
                    </div>
                    <div className="buttonDisableText">홍여사구함</div>
                  </>
                )}
              </div>
  
              <div className="upbutton" onClick={_handleMap}>
                <div
                  style={{
                    backgroundColor: "#FF4E19",
                    borderRadius: "100px",
                    border: "1px solid #fff",
                    height: 50,
                    width: 50,
                    display: "flex",
                    justifyContent: "center",
                    padding: 5,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      marginTop: -55,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div className="moving">
                      <img
                        src={imageDB.hongmoveicon}
                        style={{ width: 25, height: 25 }}
                      />
                      
                  
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 10,
                      color: "white",
                      paddingTop: 5,
                      position: "absolute",
                      top: 10,
                    }}
                  >
                    내주변
                  </div>
                </div>
              </div>

              <div className="button">
                {type == "room" ? (
                  <>
                    <div className="imageicon" onClick={_handleRoom}>
                    <FiGrid size={25}/>
                    </div>
                    <div className="buttonEnableText">공간대여</div>
                  </>
                ) : (
                  <>
                    <div className="imageicon" onClick={_handleRoom}>
                    <FiGrid size={25}/>

                    </div>
                    <div className="buttonDisableText">공간대여</div>
                  </>
                )}
              </div>

          

       

              <div className="button">
                {type == "config" ? (
                  <>
                    {" "}
                    <div className="imageicon" onClick={_handleConfig}>
                    <IoSettingsOutline size={25}/>
                    </div>
                    <div className="buttonEnableText">내정보</div>
                  </>
                ) : (
                  <>
                    {" "}
                    <div className="imageicon" onClick={_handleConfig}>
                    <IoSettingsOutline size={25}/>
                    </div>
                    <div className="buttonDisableText">내정보	</div>
                  </>
                )}
              </div>
            </div>
        </div>
      </footer>
    </Fragment>
  );
};

export default HomeFooter;
