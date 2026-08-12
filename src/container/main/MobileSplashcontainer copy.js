import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { UserContext } from "../../context/User";
import { Row } from "../../common/Row";
import { Column } from "../../common/Column";
import { getFontSize } from "../../utility/fontsize";
import { imageDB } from "../../utility/imageData";
import localforage from "localforage";
import { readuserbydeviceid } from "../../service/UserService";
import HongButton from "../../components/HongButton";
import { COLORS } from "../../utility/screen";

const Container = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: #FFF;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  padding: 0;
  margin: 0;
  box-sizing: border-box;
  overscroll-behavior: none;
`;


const MainLogoText = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: ${() => `${getFontSize(32)}px`} !important;
  color: #1A1E28;
`;

const SubText = styled.div`
  font-family: 'Pretendard-Regular';
  font-size: ${() => `${getFontSize(14)}px`} !important;
  color: #96989C;
`;
const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const LoadingText = styled.div`
  font-size: ${() => `${getFontSize(14)}px`} !important;
  color: #888;
  margin-bottom: 8px;
  font-family: 'Pretendard-Regular';
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 4px solid ${COLORS.primary}; // ✅ primary 컬러로 교체
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: ${spin} 0.7s linear infinite;
`;

const MobileSplashcontainer = ({ containerStyle }) => {
  const { dispatch, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);

    try {
      const userConfig = await localforage.getItem('userconfig');

      console.log("userConfig", userConfig);

      if (userConfig?.deviceid) {
        const existingUser = await readuserbydeviceid({ DEVICEID: userConfig.deviceid });
        if (existingUser) {

          console.log("existingUser", existingUser);
          navigate('/mobilemain', { state: { phone: existingUser.USERINFO.phone } });
          return;
        }
      } else {
        navigate('/mobilephone');
      }

    } catch (error) {
      console.error('Error during splash start:', error);
      navigate('/mobilephone');
    }
  }

  return (
    <Container style={containerStyle}>
      <Row>
        <img
          src={imageDB.startlogo}
          style={{ marginTop: 80, width: "250px", height: "250px" }}
          alt="로고"
        />
      </Row>
      <Row>
        <MainLogoText>우리 동네의 홍여사</MainLogoText>
      </Row>
      <Column style={{ justifyContent: "flex-start" }}>
        <SubText style={{ marginTop: 12 }}>
          일잘하는 동네 일꾼 홍여사를 만나고
        </SubText>
        <SubText>집안일 도움 받으세요!</SubText>
      </Column>
      <Column style={{ margin: "130px auto", justifyContent: "center", width: "80%" }}>
        {loading ? (<LoadingWrapper>
          <LoadingText>홍여사가 준비 중이에요...</LoadingText>
             <Spinner
                   size={32}
                   dotSize={4}         // 점 크기 작게
                   color="rgba(0,0,0,.6)" // 연한 블랙톤
                   dotCount={12}       // 점 더 많게 (부드러움 ↑)
                   duration={1.2}      // 조금 느리게 회전
                 />
        </LoadingWrapper>) : (
          <HongButton
            style={{ marginTop: 28 }}
            variant="primary"
            fullWidth
            onClick={handleStart}
          >
            시작하기
          </HongButton>
        )}
      </Column>
    </Container>
  );
};

export default MobileSplashcontainer;
