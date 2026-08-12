import styled from 'styled-components';
import { imageDB } from '../utility/imageData';
import { Row } from '../common/Row';
import { useNavigate } from 'react-router-dom';
import { LIFEMENU } from '../utility/life';
import { getFontSize } from '../utility/fontsize';

const MemoIntroWrapper = styled.div`
  width: 100%;
  margin: 54px auto 10px;
  padding-top: 10px;
  text-align: left;

  @media (max-width: 480px) {
    text-align: center;
  }
`;

const MemoIntroTitle = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(17)}px;
  color: #2C2C2C;
  line-height: 1.8;
  text-align: center;
  white-space: pre-line;
  letter-spacing: -0.5px;
`;

const MemoCard = styled.div`
  background-color: #fff7ec;
  border-radius: 16px;
  padding: 32px 20px; // ✅ 기존 24px → 32px 정도로 상단/하단 여백 늘려줘
  width: 85%;
  margin: 24px auto;   // ✅ margin도 20 → 24로 살짝 키우면 더 안정감 생겨
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const MemoTitle = styled.div`
  font-size: ${() => getFontSize(20)}px;
  font-weight: 700;
  color: #131313;
  margin-top: 12px;
  font-family: Pretendard-Bold;
`;

const CTAButton = styled.button`
  margin-top: 16px;
  width: 70%;
  background: #f38d13;
  color: #fff;
  font-size: ${() => getFontSize(16)}px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 14px 0;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #d97706;
  }
`;

const MemoGuide = styled.div`
  text-align: left;
  padding-left: 14px;
  flex: 1;

  @media (max-width: 480px) {
    padding-left: 0;
    text-align: center;
  
  }
`;

const GuideTitle = styled.div`
  font-size: ${() => getFontSize(16)}px;
  font-weight: 600;
  font-family : Pretendard-SemiBold;
  color: #222;
  margin-bottom: 4px;
`;

const GuideDesc = styled.div`
  font-size: ${() => getFontSize(13)}px;
  color: #666;
  line-height: 1.4;
`;

const MemoEntryWrapper = styled.div`
  width: 100%;
  padding: 0px 20px 40px;
  background: #FFF4EB;
  position: relative;
  border-radius :10px;
  height:150px;



  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  z-index: 1;
`;


const MemoContentBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 768px;
  padding-right: 20px; // ✅ 살짝 여유 공간 줘서 아이폰 기준으로도 우측 여백 확보
`;

const LeftImageColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RightCharacterBox = styled.div`
  position: relative;
  width: 150px;
  display: flex;
  justify-content: flex-end; // ✅ 우측 정렬
`;

const SpeechBubble = styled.div`
  position: absolute;
  top: 20px;
  left: 90px;
  padding: 8px 12px;
  font-size: 13px;

`;

const TitleText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding-top: 20px;
`;

const AddMemoButton = styled.button`
  background: #F97316;
  color: #fff;
  font-family: Pretendard-SemiBold;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  z-index:3;
`;


const MobileMemoCard = () => {
  const navigate = useNavigate();

  const _handlemenu = (menu) => {
    navigate("/Mobilecommunitycontent", { state: { name: menu, search: "" } });
  };

  return (
    <>
      <MemoIntroWrapper>
        <MemoIntroTitle>
          필요한 물건이나
          기억하고 싶은 날을.<br />
          똑똑한 메모에 남겨보세요
        </MemoIntroTitle>
      </MemoIntroWrapper>


      
      <MemoEntryWrapper>
        <TitleText>

          <ul>
            <li>오늘 장볼 물건들</li>
            <li>소중한 사람의 기념일들</li>
          </ul>


        </TitleText>

        <AddMemoButton onClick={() => _handlemenu(LIFEMENU.MEMO)}>새 메모 추가하기</AddMemoButton>
        {/* <MemoContentBox>


          <LeftImageColumn>
            <img src={imageDB.memo_heart} width={60} />
            <img src={imageDB.memo_basket} width={80} />
          </LeftImageColumn>
          <RightCharacterBox>
            <img src={imageDB.memo_woman} width={130} />
            <SpeechBubble>아 맞다</SpeechBubble> 
          </RightCharacterBox>
        </MemoContentBox> */}
     
      </MemoEntryWrapper>
    
    
    </>


 


  );
};

export default MobileMemoCard;
