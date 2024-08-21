

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

const MobileFooter = ({type}) => {
  const navigation = useNavigate();
  const {user, dispatch} = useContext(UserContext);
  const [foottype, setFoottype] = useState(0);
  const [refresh, setRefresh] = useState(1);
  const location = useLocation();

  useEffect(()=>{

  },[refresh])

  const _handleMain=()=>{
    navigation("/Mobilemain");
  }
  const _handleRoom=()=>{
    navigation("/Mobileroom");  
  }
  const _handleMap=()=>{
    navigation("/Mobilemap" ,{state :{WORK_ID :"", TYPE : ""}});
  }
  const _handleCommunity=()=>{
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
  
              <div className="upbutton" onClick={_handleMap}>
                <div
                  style={{
                    backgroundColor: "#FFF",
                    borderRadius: "100px",
                    border: "2px solid rgb(242 240 240)",
                    height: 50,
                    width: 50,
                    display: "flex",
                    justifyContent: "center",
                    padding: 5,
                  }}
                  className="spotlight-animation"
                >


                  <div
                    style={{
                      display: "flex",
                      marginTop: -45,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div className="moving">
                      <img
                        src={imageDB.movegps}
                        style={{ width: 30, height: 30 }}
                      />
                      
                  
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 10,
                      color: "#9b9b9b",
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
                    <div className="imageicon" onClick={_handleCommunity}>
                    <FiUser size={25}/>
                    </div>
                    <div className="buttonEnableText">커뮤니티</div>
                  </>
                ) : (
                  <>
                    <div className="imageicon" onClick={_handleCommunity}>
                    <FiUser size={25}/>

                    </div>
                    <div className="buttonDisableText">커뮤니티</div>
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

export default MobileFooter;
