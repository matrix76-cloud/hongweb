// 📄 MobileMyRegisterWorker 리팩토링 버전

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { toast } from "sonner";
import { getFontSize } from "../../../utility/fontsize";
import { UserContext } from "../../../context/User";
import { getWorkerByUserId, deleteWorkerByUserId } from "../../../service/WorkerService";
import useProfileScoreByUserId from "../../../hooks/useProfileScoreByUserId";
import EmptyState from "../../EmptyState";
import { Column } from "../../../common/Column";
import { Row } from "../../../common/Row";
import { FaCheckCircle } from "react-icons/fa";
import { COLORS } from "../../../utility/colors";

const Container = styled.div``;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 16px;
  margin: 20px auto;
  width: 80%;
`;

const ImageBox = styled.div`
  width: 50%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  border: 1px solid #ededed;
  padding: 10px;
`;

const ProfileImage = styled.img`
  width: auto;
  height: 100%;
  object-fit: contain;
  border-radius: 7px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionButton = styled.div`
  padding: 10px 12px;
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 500;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: 0.2s ease;
`;

const OrangeButton = styled(ActionButton)`
  background: ${COLORS.primary};
  color: #fff;
`;

const WhiteOrangeButton = styled(ActionButton)`
  background: #fff;
  color: ${COLORS.primary};
  border: 2px solid ${COLORS.primary};
`;

const InfoBox = styled.div`
  background: #f7f8fa;
  border: 1px solid #ddd;
  padding: 12px;
  width: 80%;
  margin: 0 auto 20px auto;
`;

const EfficiencyBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EfficiencyScore = styled.span`
  color: ${COLORS.primary};
  font-family: "Pretendard-Bold";
  font-size: ${() => getFontSize(16)}px;
`;

const GuideText = styled.div`
  font-size: ${() => getFontSize(13)}px;
  color: #555;
  line-height: 1.6;
  margin-top: 4px;
`;

const AnimatedCircle = styled.circle`
  animation: dashAnim 1s ease-out forwards;
  @keyframes dashAnim {
    from { stroke-dashoffset: 100; }
    to { stroke-dashoffset: 20; }
  }
`;

const StatusButton = styled.button`
  width: 100%;
  padding: 14px;
  font-size: ${() => getFontSize(14)}px;
  font-weight: 500;
  border-radius: 14px;
  border: 1px solid ${({ completed }) => (completed ? COLORS.primary : "#e0e0e0")};
  background: ${({ completed }) => (completed ? "#fff" : "#f9f9f9")};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Chart = ({ score }) => (
  <svg width="38" height="38" viewBox="0 0 38 38">
    <circle cx="18" cy="18" r="16" stroke="#ccc" strokeWidth="6" fill="none" />
    <AnimatedCircle
      cx="18"
      cy="18"
      r="16"
      stroke={COLORS.primary}
      strokeWidth="6"
      fill="none"
      strokeDasharray="100"
      strokeDashoffset={100 - score}
      transform="rotate(-90 18 18)"
    />
  </svg>
);

const BoosterChecklist = ({ worker, checklist, onEdit }) => {
  const navigate = useNavigate();
  const go = (key) => navigate("/Mobileworkeredit", { state: { worker, promptMode: key } });
  const goAI = () => navigate("/Mobileaiedit", { state: { worker, promptMode: "worker" } });

  const ChecklistButton = ({ completed, label, onClick }) => (
    <StatusButton completed={completed} onClick={onClick}>
      <FaCheckCircle color={completed ? COLORS.primary : "#ccc"} size={16} />
      <span>{label} {completed ? "등록됨" : "미등록"}</span>
    </StatusButton>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
      <ChecklistButton completed={checklist.ability} label="능력자 항목" onClick={() => go("ability")} />
      <ChecklistButton completed={checklist.photos} label="참고 이미지" onClick={() => go("photos")} />
      <ChecklistButton completed={checklist.career} label="활동 이력" onClick={() => go("career")} />
      <ChecklistButton completed={checklist.aiImage} label="AI 이미지" onClick={goAI} />
    </div>
  );
};

const MobileMyRegisterWorker = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [myWorks, setMyWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { score, checklist } = useProfileScoreByUserId(user.USERS_ID);

  useEffect(() => {
    const fetch = async () => {
      try {
        const works = await getWorkerByUserId(user.USERS_ID);
        setMyWorks(works);
      } catch {
        toast.error("나의 아르바이트를 불러오는 데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const success = await deleteWorkerByUserId(id);
      if (success) {
        toast.success("삭제되었습니다");
        setMyWorks((prev) => prev.filter((item) => item.id !== id));
      } else toast.error("삭제에 실패했습니다");
    } catch {
      toast.error("삭제 중 오류가 발생했습니다");
    }
  };

  const handleViewDetail = (item) => {
    navigate("/Mobileworkeredit", { state: { worker: item } });
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <Container>
      {myWorks.length === 0 ? (
        <Column style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <EmptyState type="myWorker" />
        </Column>
      ) : (
        <>
          <InfoBox>
            <EfficiencyBox>
              <div style={{ fontWeight: 600 }}>광고 효율</div>
              <EfficiencyScore>{score}%</EfficiencyScore>
              <Chart score={score} />
            </EfficiencyBox>
            <GuideText>
              프로필을 더 등록하면 매칭 확률이 올라갑니다!<br />👇 아래 미등록 항목을 눌러 추가 정보를 등록해보세요.
            </GuideText>
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
              <BoosterChecklist worker={item} checklist={checklist} />
            </Card>
          ))}
        </>
      )}
    </Container>
  );
};

export default MobileMyRegisterWorker;