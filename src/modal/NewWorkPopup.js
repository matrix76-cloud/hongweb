import React from "react";
import styled from "styled-components";

const PopupWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const PopupBox = styled.div`
  background: white;
  padding: 0;
  border-radius: 16px;
  max-width: 90%;
  width: 320px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const PopupContent = styled.div`
  padding: 20px 16px 0 16px;
`;

const Title = styled.div`
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 12px;
  line-height: 1.5;
`;

const WorkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const WorkItem = styled.li`
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
`;

const Subtext = styled.div`
  font-size: 13px;
  color: #777;
  margin-top: 8px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  padding: 20px 16px 24px 16px;
  background-color: white;
  box-sizing: border-box;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 12px 0;
  background: #ddd;
  color: #333;
  border-radius: 8px;
  border: none;
  font-size: 14px;
`;

const ActionButtonFilled = styled.button`
  flex: 1;
  padding: 12px 0;
  background: #ff7125;
  color: white;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  font-size: 14px;
`;

const NewWorkPopup = ({ works = [], onClose, onGoToList }) => {
    const previewWorks = works.slice(0, 2); // ✅ 최대 2개
    const shorten = (text, max = 22) =>
        text && text.length > max ? text.slice(0, max) + "..." : text;

    const validWorks = works.filter(Boolean);

    console.log("WORKS", works);

    const getTodayKey = () => {
        const now = new Date();
        return now.toISOString().slice(0, 10); // e.g. "2025-05-23"
    };
    const handleCloseWithStorage = () => {
        localStorage.setItem("hideWorkPopup", getTodayKey()); // ✅ 저장
        onClose(); // ✅ 닫기 처리
    };

    return (
        <PopupWrapper>
            <PopupBox>
                <PopupContent>
                    <Title>
                        지금 바로 할 수 있는<br />
                        아르바이트가 근처에 있어요
                    </Title>

                    <WorkList>
                        {previewWorks.map((w, i) => (
                            <WorkItem key={i}>
                                {w.WORKTYPE ? `${w.WORKTYPE} • ` : ''}{shorten(w.LOCATION)} {w.DISTANCE_KM ? `(${w.DISTANCE_KM}km)` : ''}

                            </WorkItem>
                        ))}
                    </WorkList>
                    {validWorks.length > 2 && (
                        <Subtext>...외 {validWorks.length - 2}건의 일감도 더 있어요</Subtext>
                    )}
                </PopupContent>

                <ButtonRow>
                    <ActionButton onClick={handleCloseWithStorage}>
                        오늘은 그만 볼게요
                    </ActionButton>
                    <ActionButtonFilled onClick={onGoToList}>일감 보러가기</ActionButtonFilled>
                </ButtonRow>
            </PopupBox>
        </PopupWrapper>
    );
};

export default NewWorkPopup;
