import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Column, FlexstartColumn } from "../../common/Column";
import { BetweenRow } from "../../common/Row";
import { createuser } from "../../service/UserService";
import { PROFILEIMAGE } from "../../utility/screen";
import { getFontSize } from "../../utility/fontsize";
import { Toaster, toast } from "sonner";
import HongButton from "../../components/HongButton";
import { v4 as uuidv4 } from "uuid";
import localforage from "localforage";
import { useMediaQuery } from "react-responsive";


const HEADER_HEIGHT = 64;
const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  background-color: #fff;
  padding: 0 16px;
`;

const Label = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(28)}px !important;
`;

const SubText = styled.div`
  margin-top: 10px;
  font-family: 'Pretendard';
  color: #96989C;
  font-size: ${() => getFontSize(16)}px !important;
  line-height: 1.7;
`;

const InputStyle = {
  border: '1px solid #E8E9EA',
  background: '#fff',
  borderRadius: '10px',
  fontSize: getFontSize(14), // ✅ 함수 호출해서 적용
  padding: '10px 8px',
  width: "100%",
  margin: "0px auto"
};

const MobileNamecontainer = ({ containerStyle }) => {
  const navigate = useNavigate();
  const location = useLocation();


  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const isGalaxyFlipUnfolded = useMediaQuery({ minWidth: 500, maxWidth: 767 });

  const inputRef = useRef(null);


  const [phone, setPhone] = useState("");

  useEffect(() => {
    const initPhone = async () => {
      const statePhone = location.state?.phone;
      if (statePhone) {
        setPhone(statePhone);
      } else {
        const storedPhone = await localforage.getItem("user_phone");
        if (storedPhone) setPhone(storedPhone);
      }
    };

    initPhone();
  }, []);


  const handleCreate = async () => {
    if (!phone || !nickname.trim()) {
      toast.error("전화번호와 닉네임을 모두 입력해주세요.");
      return;
    }

    

    setLoading(true);

    try {
      let deviceid;
      const existingConfig = await localforage.getItem("userconfig");

      if (existingConfig?.deviceid) {
        deviceid = existingConfig.deviceid;
      } else {
        deviceid = uuidv4();
        await localforage.setItem("userconfig", { deviceid });
      }

      const INFO = {
        phone,
        nickname: nickname.trim(),
        userimg: PROFILEIMAGE,
      };

      await createuser({
        INFO,
        DEVICEID: deviceid,
      });

      if (window.ReactNativeWebView && !window.__alreadySentSignUp) {
        window.ReactNativeWebView.postMessage(JSON.stringify({type:"sign_up"}));
        window.__alreadySentSignUp = true;
      }


      navigate('/mobilemain', { state: { phone } });
    } catch (error) {
      console.error("회원 생성 실패:", error);
      toast.error("회원가입 실패. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Container style={containerStyle}>
        <Column style={{ width: "100%", background: "transparent", justifyContent: "flex-start" }}>
          <FlexstartColumn style={{ width: "95%", margin: "0 auto" }}>
            <Label>구해줘 알바에서 사용될 닉네임을 입력해주세요.</Label>
            <SubText>
              구해줘 알바에서 사용되는 닉네임은 언제든지 변경하실 수 있습니다.
            </SubText>
            <BetweenRow style={{ width: "100%", marginTop: 20 }}>
              <input
                ref={inputRef}
                style={InputStyle}
                type="text"
                placeholder="닉네임을 입력해주세요"
                value={nickname}
                maxLength={8}
                onFocus={() =>
                  inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && nickname.trim()) {
                    handleCreate();
                  }
                }}
                onChange={(e) => setNickname(e.target.value)}
              />
            </BetweenRow>
          </FlexstartColumn>
        </Column>

        <Column style={{ marginTop: '40px', paddingBottom: '100px' }}>
          <HongButton
            variant="primary"
            fullWidth
            disabled={loading || !nickname.trim()}
            onClick={handleCreate}
          >
            {loading ? "처리 중..." : "닉네임 설정"}
          </HongButton> 
        </Column>

        <Toaster position="bottom-right" richColors />
      </Container>
    </>
  );
};

export default MobileNamecontainer;
