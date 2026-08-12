

import React, { useContext, useState, cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import Mobileheader from "../Header/Mobileheader";
import MobileMapheader from "../Header/MobileMapheader";
import styled from "styled-components";

import MobileGpsPopup from "../../../modal/MobileGpsPopup/MobileGpsPopup";
import CommonHeaderWorker from "../../../components/CommonHeaderWorker";
import { MOBILEMAINMENU } from "../../../utility/screen";


const Container = styled.div`
  height: 100vh;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;

`
const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;

`;

const MobileWorkerMapLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();
  const [gpspopup, setGpspopup] = useState(false);
  const gpspopupcallback = () => setGpspopup(false);

  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  // ✅ 필터 상태 관리
  const [filters, setFilters] = useState({
    gender: null,
    age: null,
    category: [],
    time: null
  });

  const getFilterSummary = () => {
    let count = 0;
    if (filters.gender) count++;
    if (filters.age) count++;
    if (filters.time) count++;
    if (filters.category?.length > 0) count++;
    return count === 0 ? '전체' : String(count);
  };

  const handleResetFilter = () => {
    setFilters({
      gender: null,
      age: null,
      category: [],
      time: null
    });
  };

  // 🔁 children에 showFilter 전달
    const clonedChildren = React.Children.map(props.children, (child) =>
      React.isValidElement(child)
        ? cloneElement(child, {
          showFilter,
          setShowFilter,
        })
        : child
    );
  

  return (
    <Container> 
      <HeaderWrapper>
        <CommonHeaderWorker
          onLocationClick={() => setGpspopup(true)}
          onBackPressed={() => {
            let phone = user.USERINFO.phone;
            navigate("/mobilemain", { state: { phone } });
          }}
          filterSummary={getFilterSummary()}
          onFilterClick={() => setShowFilter(true)}  // ✅ 요게 빠져있으면 필터창 안 뜸
          onFilterReset={handleResetFilter}
        />
      {gpspopup && <MobileGpsPopup callback={gpspopupcallback} />}
      </HeaderWrapper>
      <main>
        {clonedChildren}
      </main>
      <MobileFooter type={MOBILEMAINMENU.HOMESEARCHMENU}/>

    </Container>
  );
};

export default MobileWorkerMapLayout;
