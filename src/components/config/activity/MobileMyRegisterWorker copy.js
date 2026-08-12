// 📄 MobileWorkerEdit.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserContext } from "../../../context/User";
import { deleteWorkerByUserId, getWorkerByUserId } from "../../../service/WorkerService";
import styled, { keyframes, css } from 'styled-components';
import { getFontSize } from "../../../utility/fontsize";
import HongButton from "../../HongButton";
import { imageDB } from "../../../utility/imageData";
import { Column } from "../../../common/Column";
import { Row } from "../../../common/Row";
import useProfileScoreByUserId from "../../../hooks/useProfileScoreByUserId";
import EmptyState from "../../EmptyState";
import { FaCheckCircle } from "react-icons/fa";
import { COLORS } from "../../../utility/colors";


const Container = styled.div`
`



const Card = styled.div`
  background-color: #f9f9f9; // ← 여기만 바꾸면 됨!
  width: 80%;
  margin: 20px auto 12px;  /* 가운데 정렬 + 카드 간 간격 */
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserType = styled.div`
  font-size: ${() => `${getFontSize(12)}px !important`};
  color: #5284ff;
  background-color: #e6efff;
  padding: 4px 8px;
  border-radius: 8px;
`;



const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
`;

const Tag = styled.div`
  font-size: ${() => `${getFontSize(14)}px !important`};
  color: #4a6cd4;
  background-color: #eff4ff;
  padding: 4px 10px;
  border-radius: 12px;
`;

const Address = styled.div`
  font-size: ${() => `${getFontSize(14)}px !important`};
  color: #333;
  margin-bottom: 4px;
`;

const AvailableTime = styled.div`
  font-size: ${() => `${getFontSize(14)}px !important`};
  color: #333;

`;


const DetailButton = styled.button`
  background-color: #5284ff;
  color: white;
  padding: 8px 16px; /* ✅ 기존보다 세로/가로 padding 줄임 */
  border: none;
  border-radius: 6px;
  font-size: ${getFontSize(13)}px; /* ✅ 살짝 작게 */
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
`;

const DeleteText = styled.div`
  font-size: ${getFontSize(13)}px;
  color: #999;
  text-decoration: underline;
  cursor: pointer;
  padding: 8px 12px;
  flex-shrink: 0;
`;

const NoData = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: ${() => getFontSize(14)}px !important;
`;

const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
`;
const EmptySubTitle = styled.div`
  margin: 5px 0px;
  font-size: ${() => `${getFontSize(18)}px`} !important;
  color: #333;
  font-family : Pretendard-SemiBold;
`;
const WhiteButton = styled.div`
  background-color: #ffffff;
  border: 1px solid #ccc;
  color: #333;
  font-weight: 600;
  font-size: ${() => `${getFontSize(14)}px`} !important;
  padding: 3px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #999;
    background-color: #f9f9f9;
  }

  &:active {
    background-color: #f1f1f1;
    border-color: #888;
  }
`;

const RegistButton = styled.div`

  margin-top: 20px;
  padding: 10px 18px;
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 500;
  background-color: #fff6e0;
  color: #333;
  border: 1px solid #e0d3b8;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);

  &:hover {
    background-color: #ffeec0;
  }

  &:active {
    background-color: #ffdf96;
  }
`;



const progressAnim = keyframes`
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 20;
  }
`;


 const ProfileThumbnail = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
`;

// ✅ 전문가 전용 Badge 스타일
 const ExpertBadgeWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

 const ExpertBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  display: inline-block;
  padding: 4px 8px;

  background: linear-gradient(135deg, #ffd700, #ff9900);
  color: #fff;
  font-size: ${() => getFontSize(15)}px !important;
  font-weight: 800;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  position: relative;

  &::after {
    content: '★';
    position: absolute;
    top: -4px;
    right: -6px;
    background: #ff6347;
    color: #fff;
    width: 20px;
    height: 20px;
    font-size: 13px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
`;

const InfoBox = styled.div`
  background: #f7f8fa;
  border: 1px solid #ddd;
  padding: 12px;

  font-size: ${() => getFontSize(15)}px !important;
  color: #333;
  line-height: 1.6;
  width: 80%;
  margin: 0 auto;
`;

const IntroBadge = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  padding: 4px 10px;
  border-radius: 999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ImageBox = styled.div`
  width: 50%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  overflow: hidden;
  border: 1px solid #ededed;
  padding: 10px;
`;

const ProfileImage = styled.img`
  width: auto;
  height: 100%;
  object-fit: contain;
  border-radius: 7px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;




const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 12px;
  gap: 8px;
  flex-wrap: wrap;
  flex-direction : row;

`;


const ActionButton = styled.div`
  padding: 10px 18px;
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 500;
  background-color: #fff6e0;
  color: #333;
  border: 1px solid #e0d3b8;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);

  &:hover {
    background-color: #ffeec0;
  }

  &:active {
    background-color: #ffdf96;
  }
`;


// 알바 지원하기 (주황 배경, 흰 글씨)
const OrangeButton = styled(ActionButton)`
  background-color: #ff7e19;
  color: white;
  border: none;
  
  &:hover {
    background-color: #e55d00; // 좀 더 어두운 주황
  }

`;

// 알바 둘러보기 (흰 배경, 주황 테두리/글씨)
const WhiteOrangeButton = styled(ActionButton)`
  background-color: white;
  color: #ff6b00;
  border: 2px solid ${COLORS.primary};
  &:hover {
    background-color: #fff3eb; // 주황 느낌 나는 연한 배경
  }

`;

const AnimatedCircle = styled.circle`
  animation: ${progressAnim} 1s ease-out forwards;
`;


const StatusButton = styled.button`
  width: 100%;
  padding: 14px 16px;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 500;
  border-radius: 14px;
  border: 1px solid ${({ completed }) => (completed ? "#ff7e19" : "#e0e0e0")};
  background-color: ${({ completed }) => (completed ? "#fff" : "#f9f9f9")};
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: ${({ completed }) =>
    completed
      ? "0 3px 8px rgba(255, 126, 25, 0.2)"
      : "inset 0 0 0 1px #ddd"};

  &:hover {
    background-color: ${({ completed }) =>
    completed ? "#fffaf5" : "#f0f0f0"};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  &:active {
    background-color: #f6f6f6;
    transform: scale(0.98);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  }
`;

const EfficiencyBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EfficiencyScore = styled.span`
  color: #FF7E19;
  font-family: "Pretendard-Bold";
  font-size: ${() => getFontSize(16)}px;
`;

const GuideText = styled.div`
  font-size: ${() => getFontSize(13)}px;
  color: #555;
  line-height: 1.6;
  margin-top: 4px;
`;

const EfficiencyInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Chart = ({score}) => (
  <svg width="38" height="38" viewBox="0 0 38 38">
    <circle cx="18" cy="18" r="16" stroke="#ccc" strokeWidth="6" fill="none" />
    <AnimatedCircle
      cx="18"
      cy="18"
      r="16"
      stroke="#FF7E19"
      strokeWidth="6"
      fill="none"
      strokeDasharray="100"
      strokeDashoffset={100 - score}
      transform="rotate(-90 18 18)"
    />
  </svg>
);



const BoosterChecklist = ({ worker, checklist }) => {
  const navigate = useNavigate();




  const goToEdit = (mode) => {

    navigate("/Mobileworkeredit", { state: { worker: worker, promptMode : mode } });

  };

  const goToAI = () => {
    navigate("/Mobileaiedit", { state: { worker: worker, promptMode: "worker" } })
  };

  const ChecklistButton = ({ completed, label, onClick }) => (
    <StatusButton
      completed={completed}
      onClick={onClick}
      style={{
        backgroundColor: completed ? "#fff" : "#f0f0f0",
        color: completed ? "#444" : "#444",
        border: completed ? "1px solid #ff7e19" : "none",
        display: "flex",
        alignItems: "center",
        gap: "8px", // ✅ 이거 핵심
      }}
    >
      {completed ? <FaCheckCircle color="#ff7e19" size={16} /> : <FaCheckCircle color="#ccc" size={16} />}
      <span>{label} {completed ? "등록됨" : "미등록"}</span>
    </StatusButton>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
      <ChecklistButton completed={checklist.ability} label="능력자 항목" onClick={() => goToEdit("ability")} />
      {/* <ChecklistButton completed={checklist.video} label="소개 영상" onClick={() => goToEdit("video")} /> */}
      <ChecklistButton completed={checklist.photos} label="참고 이미지" onClick={() => goToEdit("photos")} />
      <ChecklistButton completed={checklist.career} label="활동 이력" onClick={() => goToEdit("career")} />
      <ChecklistButton completed={checklist.aiImage} label="AI 이미지" onClick={() => goToAI()} />
    </div>
  );
};

const MobileMyRegisterWorker = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [myWorks, setMyWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { score, checklist } = useProfileScoreByUserId(user.USERS_ID); // ✅ 핵심

  console.log("🔥 checklist", checklist);
  
  useEffect(() => {
    const fetchMyWorks = async () => {
      try {
        console.log("👤 현재 유저:", user);
        const works = await getWorkerByUserId(user.USERS_ID);
        console.log("🧹 등록한 아르바이트:", works);
        setMyWorks(works);
      } catch (e) {
        console.error("❌ 아르바이트 목록 로딩 실패:", e);
        toast.error("나의 아르바이트를 불러오는 데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchMyWorks();
  }, [user]);

  const handleDelete = async (id) => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    try {
      const success = await deleteWorkerByUserId(id);
      if (success) {
        toast.success("삭제되었습니다");
        setMyWorks((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error("삭제에 실패했습니다");
      }
    } catch (e) {
      console.error("❌ 삭제 중 예외 발생:", e);
      toast.error("삭제 중 오류가 발생했습니다");
    }
  };

  if (loading) return <div>불러오는 중...</div>;

  const handleViewDetail = (item) => {
    console.log("📦 이동할 item", item);
    navigate("/Mobileworkeredit", { state: { worker: item } });
  };

  return (
    <Container>
      {myWorks.length === 0 ? (
        <Column style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <EmptyState type={'myWorker'} />
        </Column>
      ) : (
        <>
            <InfoBox>
              
              <EfficiencyBox>
                <div style={{ fontWeight: 600 }}>광고 효율</div>
                <EfficiencyScore>{score}%</EfficiencyScore>
    
                <Chart score={score} />
              </EfficiencyBox>

              <EfficiencyInfo>
              
                <GuideText>
                  프로필을 더 등록하면 매칭 확률이 올라갑니다!<br />
                  👇 아래 미등록 항목을 눌러 추가 정보를 등록해보세요.
                </GuideText>
              </EfficiencyInfo>
          </InfoBox>

          {myWorks.map((item) => (
            <Card key={item.id}>

              <Row>
                <ImageBox>
                  <ProfileImage src={item.profileImg} />
                </ImageBox>


                <ButtonWrapper>
                  <OrangeButton onClick={() => handleViewDetail(item)}>기본정보 수정하기</OrangeButton>
                  <WhiteOrangeButton onClick={() => handleDelete(item.id)}>등록내용 삭제하기</WhiteOrangeButton>
                </ButtonWrapper>
              </Row>


              {/* ✅ 보완 등록 체크리스트 삽입 */}
              <BoosterChecklist worker={item} checklist={checklist} />
            </Card>
          ))}
        </>
      )}
    </Container>
  );
};

export default MobileMyRegisterWorker;
