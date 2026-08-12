

import React, { Fragment, useContext, useEffect, useState} from "react";
import './Footer.css';
import styled from 'styled-components';
import { imageDB } from '../../../utility/imageData';
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import { FiHome, FiUser, FiShare2,FiGrid } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { MOBILEMAINMENU } from "../../../utility/screen";

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
    navigation("/Mobilecommunity");
  }
  const _handleConfig=()=>{
    navigation("/Mobileconfig");
  }


  return (
    <Fragment>
      <footer>
        <div className="site-mobile-footer2">
            <div className="buttonview">
              <div className="button">
                {type == MOBILEMAINMENU.HONGMENU ? (
                  <>
                    <div className="imageicon" onClick={_handleMain}>
                    <img src={imageDB.home_e} width={22}/>
                    </div>
                    <div className="buttonEnableText">홈</div>
                  </>
                ) : (
                  <>
                    <div className="imageicon" onClick={_handleMain}>
                    <img src={imageDB.home_d} width={22}/>
                    </div>
                    <div className="buttonDisableText">홈</div>
                  </>
                )}
              </div>
              <div className="button">
                {type == MOBILEMAINMENU.ROOMMENU ? (
                  <>
                    <div className="imageicon" onClick={_handleRoom}>
               
                    <img src={imageDB.room_e} width={22}/>
                    </div>
                    <div className="buttonEnableText">공간대여</div>
                  </>
                ) : (
                  <>
                    <div className="imageicon" onClick={_handleRoom}>
           
                    <img src={imageDB.room_d} width={22}/>
                    </div>
                    <div className="buttonDisableText">공간대여</div>
                  </>
                )}
              </div>
  
              <div className="upbutton" >
                <div
                  style={{
                    backgroundColor: "#FFF",
                    height: 50,
                    width: 60,
                    display: "flex",
                    justifyContent: "center",
                    padding: 5,
                  }}

            
              
                >


                  <div
                    style={{
                      display: "flex",
                      paddingTop: "5px",
                      paddingBottom: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div >
                      <img onClick={_handleMap}
                        src={imageDB.movegpsex}
                        style={{ width: 42, height: 42 }}
                      />
                      
                  
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 10,
                      color: "#9b9b9b",
                      paddingTop: 3,
                      position: "absolute",
                      top: 40,
                    }}
                  >
                    내주변
                  </div>
                </div>
              </div>

              <div className="button">
                {type == MOBILEMAINMENU.COMMUNITYMENU ? (
                  <>
                    <div className="imageicon" onClick={_handleCommunity}>
                    <img src={imageDB.community_e} width={22}/>
                    </div>
                    <div className="buttonEnableText">커뮤니티</div>
                  </>
                ) : (
                  <>
                    <div className="imageicon" onClick={_handleCommunity}>
                    <img src={imageDB.community_d} width={22}/>
                    </div>
                    <div className="buttonDisableText">커뮤니티</div>
                  </>
                )}
              </div>

          

       

              <div className="button">
                {type == MOBILEMAINMENU.CONFIGMENU ? (
                  <>
                    {" "}
                    <div className="imageicon" onClick={_handleConfig}>
                    <img src={imageDB.myinfo_e} width={22}/>
                    </div>
                    <div className="buttonEnableText">내정보</div>
                  </>
                ) : (
                  <>
                    {" "}
                    <div className="imageicon" onClick={_handleConfig}>
                    <img src={imageDB.myinfo_d} width={22}/>
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
