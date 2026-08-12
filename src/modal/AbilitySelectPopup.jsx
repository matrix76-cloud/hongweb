import React, { useState } from "react";
import styled from "styled-components";
import HongButton from "../components/HongButton";
import { abilityOptions } from "../utility/abilityOptions";
import { getFontSize } from "../utility/fontsize";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: var(--surface);
  z-index: 9999;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: ${() => getFontSize(20)}px;
  color: #999;
  cursor: pointer;
  z-index: 10;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-family: Pretendard-SemiBold;
  color: #111;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: ${() => getFontSize(14)}px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const CategoryGroup = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: var(--surface);
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${() => getFontSize(15)}px;
  font-family: Pretendard-Bold;
  margin-bottom: 10px;
  cursor: pointer;
`;

const Card = styled.div`
  padding: 14px;
  border-radius: 12px;
  border: ${({ active }) => (active ? "2px solid #ff7e19" : "1px solid #ddd")};
  background: ${({ active }) => (active ? "#fff4e6" : "#fdfdfd")};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-bottom: 10px;

  &:hover {
    border-color: #ff7e19;
    background: ${({ active }) => (active ? "#fff4e6" : "#fff7ef")};
  }
`;

const CardTitle = styled.div`
  font-size: ${() => getFontSize(16)}px;
  font-family: Pretendard-SemiBold;
  color: #222;
  margin-bottom: 4px;
`;

const CardDesc = styled.div`
  font-size: ${() => getFontSize(13)}px;
  color: #555;
  line-height: 1.4;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 32px;
`;

const ConfirmButton = styled(HongButton)`
  flex: 1;
  background: ${({ disabled }) => (disabled ? "#ddd" : "#ff7e19")};
  color: ${({ disabled }) => (disabled ? "#888" : "#fff")};
  font-weight: 700;
  border-radius: 12px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const SkipButton = styled(HongButton)`
  flex: 1;
  background: #f1f3f6;
  color: #333;
  font-weight: 700;
  border-radius: 12px;
`;

const WhiteOutlineButton = styled.button`
  background-color: var(--surface);
  color: #333;
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(15)}px;
  border: 1px solid #ddd;
  padding: 14px;
  border-radius: 12px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-soft);
    border-color: #bbb;
  }

  &:active {
    background-color: #f1f1f1;
    box-shadow: none;
  }

  &:disabled {
    background-color: #f4f4f4;
    color: #aaa;
    border-color: #e0e0e0;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const AbilitySelectPopup = ({ onClose, onSave, initialSelected }) => {
  const [selected, setSelected] = useState(initialSelected);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleSelect = (item) => {
    setSelected((prev) =>
      prev.find((s) => s.title === item.title)
        ? prev.filter((s) => s.title !== item.title)
        : prev.length < 2 ? [...prev, item] : prev
    );
  };

  const selectedCount = selected.length;

  const categories = [
    "교육",
    "청소 / 정리",
    "도움 / 동행 / 서포트",
    "기타 생활 / 요리 / 집안일",
  ];

  return (
    <Overlay>
      <CloseButton onClick={onClose}>✕</CloseButton>

      <Title>우리 동네 능력자로 등록하시겠어요?</Title>
      <Subtitle>
        선택하신 능력은 <strong style={{ color: "#333", fontFamily: "Pretendard-SemiBold" }}>‘우리 동네 능력자 추천’</strong>에<br />
        노출됩니다! (최대 2개 선택)
      </Subtitle>

      {categories.map((cat) => (
        <CategoryGroup key={cat}>
          <CategoryHeader onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}>
            {cat}
            {expandedCategory === cat ? (
              <RiArrowUpSLine size={20} color="#444" />
            ) : (
              <RiArrowDownSLine size={20} color="#888" />
            )}
          </CategoryHeader>

          {expandedCategory === cat && (
            <div style={{marginTop:10}}>
              {abilityOptions
                .filter((item) => item.category === cat)
                .map((item, idx) => {
                  const isActive = selected.some((s) => s.title === item.title);
                  return (
                    <Card key={idx} active={isActive} onClick={() => toggleSelect(item)}>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDesc>{item.line}</CardDesc>
                    </Card>
                  );
                })}
            </div>
          )}
        </CategoryGroup>
      ))}

      <ButtonRow>
        <ConfirmButton
          disabled={selectedCount === 0}
          onClick={() => {
            if (selectedCount === 0) return;
            onSave(selected);
            onClose();
          }}
        >
          확인 ({selectedCount})
        </ConfirmButton>

        <SkipButton
          onClick={() => {
            setSelected([]);
            onSave([]);
            onClose();
          }}
        >
          건너뛰기
        </SkipButton>
      </ButtonRow>
    </Overlay>
  );
};

export default AbilitySelectPopup;
