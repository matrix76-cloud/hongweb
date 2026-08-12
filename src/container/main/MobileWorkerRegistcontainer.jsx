import React, {useState, useRef, useContext, useEffect, useId} from "react";
import styled from "styled-components";
import {WORKNAME} from "../../utility/work";
import MobileWorkMapPopup from "../../modal/MobileWorkMapPopup/MobileWorkMapPopup";
import MobileProfileImageUploader from "../../components/MobileProfileImageUploader";
import HongButton from "../../components/HongButton";
import {Toaster, toast} from 'sonner';
import {CreateWorker, getWorkerByUserId, updateWorkerByUserId} from "../../service/WorkerService";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../context/User";
import {getFontSize} from "../../utility/fontsize";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {storage} from "../../api/config";

import imageCompression from 'browser-image-compression';
import {Update_userimg_by_usersid} from "../../service/UserService";
import {convertUrlToFile, fixOrientationAndCompress} from "../../utility/image";
import ImageCropModal from "../../modal/ImageCropModal";
import AbilitySelectPopup from "../../modal/AbilitySelectPopup";
import {abilityOptions} from "../../utility/abilityOptions";
import {COLORS} from "../../utility/colors";
import CharacterCTA from "../../common/CharacterCTA";
import {imageDB} from "../../utility/imageData";

const Container = styled.div`
  height: calc(100vh + 1px);
  overflow-y: auto;
  padding: 30px 30px;
  background-color: var(--surface);
  box-sizing: border-box;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(19)}px !important;
  color: #111;
  margin-bottom: 12px;

  font-family: 'Pretendard-Bold', sans-serif !important;
  line-height: 1.5; /* ← 추가 */
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: ${() => getFontSize(15)}px !important;
  border-radius: 8px;
  border: 1px solid #ccc;
  background : var(--surface);
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  font-size: ${() => getFontSize(15)}px !important;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  min-height: 350px;
  max-height: 400px; // ✅ 한계 높이 설정 (선택)
  overflow-y: auto;  // ✅ 세로 스크롤 생기게!
  background-color: ${({ invalid }) => (invalid ? "#ffe5e5" : "#fff")};
  line-height:1.6;
`;

const CountText = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #888;
  text-align: right;
  margin-top: 4px;
`;

const Button = styled.button`
  width: 100%;
  background: ${COLORS.primary};
  color: white;
  padding: 14px;
  font-size: ${() => getFontSize(15)}px !important;
  font-weight: bold;
  border: none;
  border-radius: 8px;
`;

const RadioInput = styled.input`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const InfoBox = styled.div`
  background: #f7f8fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  font-size: ${() => getFontSize(15)}px !important;
  color: #333;
  line-height: 1.6;
`;

const TagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); // ✅ 1줄 3개
  gap: 12px;
`;

const TagItem = styled.div`
 padding: 6px 10px;
  border-radius: 8px;
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: ${({ active }) => (active ? `${COLORS.primary};` : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border: ${({ active }) => (active ? `2px solid ${COLORS.primary};` : "1px solid #ccc")};
`;

const AgeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const AgeOption = styled.div`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  background: ${({ active }) => (active ? `${COLORS.primary};` : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border: ${({ active }) => (active ? `2px solid ${COLORS.primary};` : "1px solid #ccc")};
`;

const ErrorText = styled.span`
  color: red;
  font-size: 13px !important;
  margin-left: 6px;
`;

const PhoneInfoBox = styled.div`
  background: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 10px;
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 700;
  color: #e65100;
  line-height: 1.5;
`;

const SelectText = styled.span`
  color: red;
  font-size: 13px !important;
  margin-left: 6px;
`;

const AddressSelectButton = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  padding: 10px 16px;
  border-radius: 10px;
  background: #f4f6fa;
  color: #000;
  border: 1px solid #cdd7f1;
  text-align:center;
  height:unset;
  flex: 1;

    &:hover {
    background: ${COLORS.primary};;
    color: white;
    border-color: ${COLORS.primary};;
    transition: all 0.2s ease-in-out;
  }

`;


// 📍 현재 위치로 선택 버튼 (라이트 서브)
const CurrentLocationButton = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  padding: 10px 16px;
  border-radius: 10px;
  background: #f4f6fa;
  color: #000;
  border: 1px solid #cdd7f1;
  font-weight: 500;
    text-align:center;
  height:unset;
  flex: 1;

  &:hover {
    background: ${COLORS.primary};;
    color: white;
    border-color: ${COLORS.primary};;
    transition: all 0.2s ease-in-out;
  }
`;

const DeleteButton = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: ${() => getFontSize(12)}px !important;
  line-height: 16px;
  text-align: center;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 2;
`;

const UploadPreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 10px;
  margin-top: 12px;
`;



const PreviewImage = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 8px;
`;

const PreviewImageWide = styled.img`
  grid-column: span 2;
  width: 100%;
  aspect-ratio: 2/1;
  object-fit: cover;
  border-radius: 8px;
`;
const UploadingText = styled.div`
  margin-top: 12px;
  font-size: ${() => getFontSize(14)}px !important;
  color: #888;
`;

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
  display: inline-block;
  padding: 2px 12px;

  background: linear-gradient(135deg, #ffd700, ${COLORS.primary};);
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
    background: ${COLORS.primary};;
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

const ThumbnailPreview = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row; /* ✅ 명시적으로 설정 */
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
`;

const AIButton = styled.button`
  font-size: 12px;
  padding: 4px 8px;
  width :100%;
  margin : 5px auto;
  border: 1px solid #ddd;
  background: var(--bg-soft);
  border-radius: 6px;
  color: #1a8f5c;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #eef9f2;
    border-color: #1a8f5c;
  }
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


const UserTypeSelector = ({ value, onChange }) => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <Title>당신은 누구입니까?</Title>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        maxWidth: "280px",
      }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", width: 120 }}>
          <RadioInput
            type="radio"
            name="type"
            value="person"
            checked={value === "person"}
            onChange={onChange}
          />
          <span>일반 사용자</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", width: 120 }}>
          <RadioInput
            type="radio"
            name="type"
            value="business"
            checked={value === "business"}
            onChange={onChange}
          />
          <span>사업자</span>
        </label>
      </div>
    </div>
  );
};

const GenderSelector = ({ gender, onChange, error }) => {
  return (
    <div style={{ marginBottom: "24px", marginTop:'50px' }}>
      <Title>
        성별 선택
        {error && <ErrorText> * 성별을 선택해주세요</ErrorText>}
      </Title>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        maxWidth: "200px",

      }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", width: 120 }}>
          <RadioInput
            type="radio"
            name="gender"
            value="male"
            checked={gender === "male"}
            onChange={() => onChange("male")}
            
          />
          <span>남성</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", width: 120 }}>
          <RadioInput
            type="radio"
            name="gender"
            value="female"
            checked={gender === "female"}
            onChange={() => onChange("female")}
          />
          <span>여성</span>
        </label>
      </div>
    </div>
  );
};

const ProfileImageUploaderBlock = ({ error, onUploadComplete, initialImage }) => {

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedRawFile, setSelectedRawFile] = useState(null);



  const handleFileSelect = (file) => {
    setSelectedRawFile(file);
    setCropModalOpen(true);
  };

  
  const handleCropConfirm = async (croppedFile) => {
    const fileRef = ref(storage, `profile_photos/${Date.now()}_${croppedFile.name}`);
    await uploadBytes(fileRef, croppedFile);
    const downloadUrl = await getDownloadURL(fileRef);
    onUploadComplete(downloadUrl);
    setCropModalOpen(false);
    toast.success("업로드 완료!");
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      <Title style={{marginTop:"unset"}}>
        지원 사진
        {error && (
          <ErrorText>
            * 아르바이트 지원 사진을 등록해주세요
          </ErrorText>
        )}
      </Title>



      <MobileProfileImageUploader
        onUploadComplete={onUploadComplete}
        onFileSelect={handleFileSelect}
        initialImage={initialImage} // ✅ 전달!
      />


      
      <ImageCropModal
        open={cropModalOpen}
        file={selectedRawFile}
        isCircle={false}
        onClose={() => setCropModalOpen(false)}
        onConfirm={handleCropConfirm}
      />
    </div>
  );
};

const AgeSelector = ({ ageList, selectedAge, onSelect, error }) => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <Title>
        연령대를 선택해주세요{" "}
        {error && (
          <ErrorText>
            * 연령대를 선택해주세요
          </ErrorText>
        )}
      </Title>
      <AgeGrid>
        {ageList.map((age, index) => (
          <AgeOption
            key={index}
            active={selectedAge === age}
            onClick={() => onSelect(age)}
          >
            {age}
          </AgeOption>
        ))}
      </AgeGrid>
    </div>
  );
};
const TagSelector = ({ tagItems, selectedTags, toggleTag, error }) => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <Title>
        가능한 일을 선택해주세요{" "}
        {error && (
          <ErrorText>
            * 1개 이상 선택해주세요
          </ErrorText>
        )}
      </Title>
      <TagGrid>
        {tagItems.map((item, index) => (
          <TagItem
            key={index}
            active={selectedTags.includes(item.name)}
            onClick={() => toggleTag(item.name)}
          >
            #{item.name}
          </TagItem>
        ))}
      </TagGrid>
    </div>
  );
};


const RewardInputBlock = ({ value, onChange, error }) => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <Title>
        보수 정보{" "}
        {error && (
          <ErrorText>
            * 보수 정보를 입력해주세요
          </ErrorText>
        )}
      </Title>

      <InfoBox>
        시급 또는 하루 보수를 대략적인 금액으로 적어주세요
        <br />
        (예: 시급 법정시급 / 하루 10만원 등)
      </InfoBox>

      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        invalid={error}
        placeholder="예: 시급 15,000원"
      />
    </div>
  );
};

const AddressSelectorBlock = ({ addressRef, selectedAddress, onClick, error, setSelectedAddress }) => {
  const { user } = useContext(UserContext);
  const currentAddress = user.USERINFO?.address_name;

  const handleUseCurrentLocation = () => {
    if (!currentAddress) {
      toast.error("현재 위치 주소가 없습니다.");
      return;
    }

    setSelectedAddress(currentAddress);
    toast.success("현재 위치로 주소가 설정되었습니다!");
  };

  return (
    <div ref={addressRef} style={{ marginBottom: "24px" }}>
      <Title>
        주소를 선택해주세요{" "}
        {error && (
          <ErrorText>
            * 주소가 필요합니다
          </ErrorText>
        )}
      </Title>

      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <AddressSelectButton onClick={onClick}>
          주소 선택하기
        </AddressSelectButton>

        <CurrentLocationButton onClick={handleUseCurrentLocation}>
          현재 위치로 선택
        </CurrentLocationButton>
      </div>


      {selectedAddress && (
        <div style={{ marginTop: 12, fontSize: 14, color: "#333" }}>
          선택된 주소: {selectedAddress}
        </div>
      )}
    </div>
  );
};
const AvailableTimeInputBlock = ({ value, onChange, error }) => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <Title>
        가능한 시간은 언제인가요?
        {error && <ErrorText>&nbsp;* 입력해주세요</ErrorText>}
      </Title>
      <InfoBox>
        요일별 가능 시간이나 전체적인 시간대를 적어주세요<br />
        (예: 평일 오후 2시~6시 / 주말 오전 가능)
      </InfoBox>
      <Input type="text" value={value} onChange={onChange} invalid={error} />
    </div>
  );
};

const SelfIntroInputBlock = ({ value, onChange, error, inputRef, userMeta, setUsedAISelfIntro }) => {

  return (
    <div ref={inputRef} style={{ marginBottom: "24px" }}>

      <TitleRow>

        <Title>
          간단 자기소개{" "}
          {error && <ErrorText>* 자기소개를 입력해주세요</ErrorText>}
        </Title>



      </TitleRow>


      <InfoBox>
        성격이나 일에 대한 태도는 어떤지?<br />
        (예: 꼼꼼한 성격으로 어르신돌봄 경력3년있어요)<br />
        - 자기소개는 30자 이상 작성해 주세요.
      </InfoBox>
      <Textarea
        value={value}
        onChange={onChange}
        invalid={error}
      />
      <CountText>{value.length}/100</CountText>

      {/* <AIButton type="button" onClick={handleAIRewriteClick}
        style={{
          opacity: value.length < 30 ? 0.5 : 1,
          pointerEvents: value.length < 30 ? 'none' : 'auto'
        }}
      >
        ✨ AI가 자기소개 완성 도와줄게요
      </AIButton>
 */}




    </div>
  );
};

const CareerInputBlock = ({ value, onChange }) => {
  return (
    <div style={{ marginBottom: "24px", marginTop:'50px' }}>

      <ExpertBadgeWrapper>
        <Title style={{marginTop:10}}>
          활동 이력{" "}
        </Title>

        <ExpertBadge>전문가</ExpertBadge>

      </ExpertBadgeWrapper>

 
      <InfoBox>
        아래와 같은 형식으로 작성해보세요:<br />
        - 언제 어디서 어떤 일을 했는지<br />
        (예: 2023~2024년 ○○센터 요양활동, 2022년 △△가사도우미 근무 등)<br />
        활동이력을 써주시면 프로필 옆에 전문가 뱃지를 붙여 드립니다<br />
      </InfoBox>
      <Textarea
        value={value}
        onChange={onChange}
        maxLength={100}
      />
      <CountText>{value.length}/100</CountText>
    </div>
  );
};


const AbilityInputBlock = ({ abilities, onOpenPopup }) => {
  return (
    <div style={{ marginBottom: "24px", marginTop:"50px" }}>
      <ExpertBadgeWrapper>
        <Title style={{ marginTop: 10 }}>
          내가 잘하는 일을 고르세요 
        </Title>

      </ExpertBadgeWrapper>

      <InfoBox>
        아래와 같은 형식으로 본인을 표현해보세요.<br />
        선택하신 능력은 <strong style={{ color: `${COLORS.primary}` }}>‘우리 동네 능력자 추천’</strong>에 노출됩니다.<br />
        <br />
        예시:<br />
        - 벌레잡기 왕 – 이 동네 벌레는 제가 다 잡습니다<br />
        - 도서관동행 왕 – 아이랑 도서관 잘 다녀요
      </InfoBox>

      <WhiteOutlineButton
        onClick={onOpenPopup}
        style={{ marginTop: 12, display: "flex", justifyContent: "center", alignItems:"center", width:"60%" }}
      >
        잘하는 일	 선택하기
      </WhiteOutlineButton>

      {abilities.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {abilities.map((a, idx) => (
            <div key={idx} style={{ color: "#333", fontSize: getFontSize(14), marginBottom: 4 }}>
              ✅ {a.title} 선택되었습니다.
            </div>
          ))}
        </div>
      )}
    </div>
  );
};




// ✅ 업로드 + 삭제 UI 구성
const WorkImageUploader = ({ uploadedUrls, setUploadedUrls }) => {
  const [uploading, setUploading] = useState(false);

  const [selectedRawFile, setSelectedRawFile] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  // ✅ 이미지 삭제 핸들러
  const handleDeleteImage = (index) => {
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (uploadedUrls.length + files.length > 5) {
      alert("이미지는 최대 5장까지만 등록 가능합니다.");
      return;
    }

    setUploading(true);
    const newUrls = [];

    try {
      for (const file of files) {
        // ✅ 압축 옵션 설정
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 640,
          useWebWorker: true,
        };


        // ✅ 회전 보정 + 압축
        const correctedFile = await fixOrientationAndCompress(file);


        const fileRef = ref(storage, `work_photos/${Date.now()}_${correctedFile.name}`);
        await uploadBytes(fileRef, correctedFile);
        const downloadUrl = await getDownloadURL(fileRef);
        newUrls.push(downloadUrl);
      }

      setUploadedUrls((prev) => [...prev, ...newUrls]);
    } catch (err) {
      console.error("업로드 실패", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };
  
  const handleSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (uploadedUrls.length >= 5) {
      alert("이미지는 최대 5장까지만 등록 가능합니다.");
      return;
    }

    setSelectedRawFile(file);
    setCropModalOpen(true);
  };

  const handleCropConfirm = async (croppedFile) => {
    setUploading(true);
    try {
      const fileRef = ref(storage, `work_photos/${Date.now()}_${croppedFile.name}`);
      await uploadBytes(fileRef, croppedFile);
      const downloadUrl = await getDownloadURL(fileRef);
      setUploadedUrls((prev) => [...prev, downloadUrl]);
    } catch (err) {
      alert("업로드 실패");
      console.error(err);
    } finally {
      setUploading(false);
      setCropModalOpen(false);
    }
  };
  

  return (
    <div style={{ marginBottom: "24px", marginTop:"50px" }}>

      <ExpertBadgeWrapper>
        <Title style={{ marginTop: 10 }}>
          지원자 참고 이미지{" "}
          <SelectText>
            (선택, 최대 5장)
          </SelectText>
        </Title>

        <ExpertBadge>전문가</ExpertBadge>

      </ExpertBadgeWrapper>

      <InfoBox style={{ marginTop: "10px" }}>
        실제 작업 공간이나 제공 서비스의 사진을 올려보세요.<br />
        참고이미지를 올려주시면 프로필 옆에 전문가 뱃지를 붙여 드립니다<br />
      </InfoBox>

      <div style={{ position: 'relative', display: 'inline-block', marginTop: 12, marginBottom: 8 }}>
        <WhiteOutlineButton>
          파일 선택
        </WhiteOutlineButton>
        <input
          type="file"
          accept="image/*"
          onChange={handleSelectFile}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer'
         }}
        />

        <ImageCropModal
          open={cropModalOpen}
          file={selectedRawFile}
          isCircle={false}
          onClose={() => setCropModalOpen(false)}
          onConfirm={handleCropConfirm}
        />
      </div>
 

      <UploadPreviewGrid>
        {uploadedUrls.slice(0, 5).map((url, idx) => {
          const isSingle = uploadedUrls.length === 1;
          const isLastOdd = uploadedUrls.length % 2 === 1 && idx === uploadedUrls.length - 1;

          const spanStyle = (isSingle || isLastOdd)
            ? { gridColumn: 'span 2' }
            : {};

          return (
            <div key={idx} style={{ position: 'relative', ...spanStyle }}>
              <img
                src={url}
                alt={`preview-${idx}`}
                style={{
                  width: '100%',
                  aspectRatio: (isSingle || isLastOdd) ? '2/1' : '1/1',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <DeleteButton onClick={() => handleDeleteImage(idx)}>×</DeleteButton>
            </div>
          );
        })}
      </UploadPreviewGrid>
      {uploading && <UploadingText>업로드 중...</UploadingText>}
    </div>
  );
};


const allowedTypes = ["video/mp4", "video/quicktime"];

const VideoUploadBlock = ({ videoUrl, setVideoUrl, setVideoThumbnail, existingThumbnail }) => {
  const [uploading, setUploading] = useState(false);

  const extractThumbnailFromVideo = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      video.preload = 'metadata';
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        video.currentTime = 1;
      };

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg');
      };

      video.onerror = (e) => reject(e);
    });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['video/mp4', 'video/quicktime'].includes(file.type)) {
      alert('MP4 또는 MOV 형식의 영상만 업로드할 수 있습니다.');
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      alert('30MB 이하의 영상만 업로드할 수 있습니다.');
      return;
    }

    setUploading(true);
    try {
      const timestamp = Date.now();
      const baseName = `${timestamp}`;

      const videoRef = ref(storage, `videos/${baseName}_${file.name}`);
      await uploadBytes(videoRef, file);
      const videoDownloadUrl = await getDownloadURL(videoRef);
      setVideoUrl(videoDownloadUrl);

      const thumbnailBlob = await extractThumbnailFromVideo(file);
      const thumbRef = ref(storage, `videos/${baseName}_thumb.jpg`);
      await uploadBytes(thumbRef, thumbnailBlob);
      const thumbUrl = await getDownloadURL(thumbRef);
      setVideoThumbnail(thumbUrl);
    } catch (err) {
      console.error('업로드 실패:', err);
      alert('영상 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    setVideoUrl('');
    setVideoThumbnail('');
  };

  return (
    <div style={{ marginBottom: '24px', marginTop:'50px' }}>
      <Title style={{ marginTop: 10 }}>지원자 소개 영상선택
      </Title>
      <InfoBox>
        자기 소개를 할 수 있는 영상을 올려 주세요.
        <br />30MB 이하로 제한되며 영상을 올리시면 홈화면에 첫번째로 노출됩니다.
        <br />영상이 등록되면 의뢰자에게 신뢰를 줄 수 있어 매칭 확률이 높아집니다.
      </InfoBox>

      <div style={{ position: 'relative', display: 'inline-block', marginTop: 12 }}>
        <WhiteOutlineButton>파일 선택</WhiteOutlineButton>
        <input
          type="file"
          accept="video/mp4,video/quicktime"
          onChange={handleUpload}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
      </div>

      {videoUrl && (
        <div style={{ marginTop: 12, position: 'relative' }}>
          <video
            src={videoUrl}
            controls
            playsInline
            muted
            style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
          />
          <DeleteButton onClick={handleDelete}>×</DeleteButton>
        </div>
      )}

      {existingThumbnail && (
        <div style={{ marginTop: 12 }}>
          <ThumbnailPreview src={existingThumbnail} />
        </div>
      )}

      <div style={{ minHeight: 32, marginTop: 8 }}>
        {uploading && <UploadingText>영상 업로드 중입니다...</UploadingText>}
      </div>
    </div>
  );
};






const MobileWorkerRegistContainer = ({ editMode = false, existingData = {}, promptMode }) => {


  const [usedAISelfIntro, setUsedAISelfIntro] = useState(false);
  const [type] = useState("person"); // 가게 제거, person 고정
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAge, setSelectedAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [selfIntro, setSelfIntro] = useState("");
  const [career, setCareer] = useState("");
  const [rewardInfo, setRewardInfo] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [abilities, setAbilities] = useState([]);
  const [invalidFields, setInvalidFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressPopupOpen, setAddressPopupOpen] = useState(false);
  const [abilityPopupOpen, setAbilityPopupOpen] = useState(false);

  const containerRef = useRef();
  const selfIntroRef = useRef();
  const addressRef = useRef();

  console.log("🧪 selfIntro 초기값:", selfIntro, typeof selfIntro); // ✅ 여기다!

  const { dispatch, user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (editMode) {
      setGender(existingData?.gender || "");
      setPhone(existingData?.phone || "");
      setSelectedAge(existingData?.age || "");
      setSelectedTags(existingData?.tags || []);
      setSelfIntro(existingData?.selfIntro || "");
      setCareer(existingData?.career || "");
      setRewardInfo(existingData?.rewardInfo || "");
      setAvailableTime(existingData?.availableTime || "");
      setSelectedAddress(existingData?.address || "");
      setProfileImg(existingData?.profileImg || "");
      setUploadedUrls(existingData?.photos || []);
      setVideoUrl(existingData?.videoUrl || "");
      setVideoThumbnail(existingData?.videoThumbnail || "");
      setAbilities(
        (existingData.abilities || []).map(tag => abilityOptions.find(opt => opt.tag === tag)).filter(Boolean)
      );
    }
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        if (prev.length >= 8) {

          return prev;
        }
        return [...prev, tag];
      }
    });
  };

  const getCoordsFromAddress = (address) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, function (result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          resolve({
            latitude: coords.getLat(),
            longitude: coords.getLng(),
          });
        } else {
          reject("주소 변환 실패");
        }
      });
    });
  };


  const handleSubmit = async () => {
    const invalid = {};
    if (!gender) invalid.gender = true;
    if (!phone.trim()) invalid.phone = true;
    if (!profileImg) invalid.profileImg = true;
    if (!selectedAge) invalid.age = true;
    if (selectedTags.length === 0) invalid.tags = true;
    if (!rewardInfo.trim()) invalid.rewardInfo = true;
    if (!availableTime.trim()) invalid.availableTime = true;
    if (!selectedAddress) invalid.address = true;
    if (!selfIntro.trim() || selfIntro.trim().length < 30) invalid.selfIntro = true;
    setInvalidFields(invalid);

    if (Object.keys(invalid).length > 0) {
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { latitude, longitude } = await getCoordsFromAddress(selectedAddress);
      const profileData = {
        gender, phone, profileImg, age: selectedAge, tags: selectedTags,
        address: selectedAddress,
        chatName: user.USERINFO?.nickname || "이름 미입력",
        availableTime, rewardInfo,
        selfIntro: selfIntro.trim(),
        career: career.trim(),
        latitude, longitude,
        videoUrl, videoThumbnail,
        users_id: user.USERS_ID,
        photos: uploadedUrls,
        abilities: abilities.map((a) => a.tag),
        USED_AI_SELFINTRO: usedAISelfIntro, // ✅ 이 줄만 추가!
      };

      if (editMode) {
        await updateWorkerByUserId(user.USERS_ID, profileData);
        const updated = await getWorkerByUserId(user.USERS_ID);
        dispatch({
          workeritems: [
            ...(user.workeritems?.filter(w => w.users_id !== user.USERS_ID) || []),
            updated,
          ]
        });
        toast.success("수정이 완료되었습니다!");
      } else {
        const result = await CreateWorker(profileData);
        if (!result.success) {
          toast.error(result.reason === "already_exists" ? "이미 등록된 지원서가 있습니다." : "등록 실패");
          return;
        }

        // // ✅ 등록일 때만 AI 이미지 생성!
        // try {
        //   await generateAndSaveAIImageForWorker({
        //     worker: profileData,
        //     users_id: user.USERS_ID,
        //   });
        //   console.log("✅ AI 이미지 자동 생성 완료");
        // } catch (err) {
        //   console.warn("⚠️ AI 이미지 생성 실패 - 무시하고 계속 진행", err);
        // }



        const created = await getWorkerByUserId(user.USERS_ID);
        dispatch({
          workeritems: [...(user.workeritems || []), created]
        });
        toast.success("등록이 완료되었습니다!");
      }


      setTimeout(() => {
        navigate("/Mobileconfig");   // 등록 후 내 정보로 (Mobileworkerlist 는 없는 화면이었다)
      }, 1500); // 1.5초 정도가 자연스럽고 UX도 괜찮아

    } catch (e) {
      console.error("❌ 저장 실패:", e);
      toast.error("저장 중 오류가 발생했습니다.");
    }
  };


  const shouldRender = (field) => {
    if (promptMode === "video") return field === "video";
    if (promptMode === "ability") return field === "ability";
    if (promptMode === "career") return field === "career";
    if (promptMode === "photos") return field === "photos";
    if (!promptMode || promptMode === "default") {
      // 기본 등록 모드에서는 일부만 보여줌
      return [
        "gender", "phone", "profileImg", "age", "tags",
        "reward", "address", "availableTime", "selfIntro"
      ].includes(field);
    }
    return false;
  };

  
  return (
    <Container ref={containerRef}>
      {shouldRender("gender") && (
        <GenderSelector gender={gender} onChange={(val) => setGender(val)} error={invalidFields.gender} />
      )}
      {shouldRender("phone") && (
        <div style={{ marginBottom: "24px" }}>
          <Title>
            연락 받을 전화번호
            {invalidFields.phone && <ErrorText>* 전화번호를 입력해주세요</ErrorText>}
          </Title>
          <PhoneInfoBox>
            📞 구인처에서 직접 연락드릴 수 있도록 전화번호를 입력해주세요
          </PhoneInfoBox>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="예: 010-1234-5678"
            invalid={invalidFields.phone}
          />
        </div>
      )}
      {shouldRender("profileImg") && (
        <ProfileImageUploaderBlock error={invalidFields.profileImg} initialImage={profileImg} onUploadComplete={async (url) => {
          setProfileImg(url);
          await Update_userimg_by_usersid({ USERS_ID: user.USERS_ID, profileImg: url });
        }} />
      )}
      {shouldRender("age") && (
        <AgeSelector ageList={["10대", "20대", "30대", "40대", "50대", "60대 이상"]} selectedAge={selectedAge} onSelect={setSelectedAge} error={invalidFields.age} />
      )}
      {shouldRender("tags") && (
        <TagSelector tagItems={Object.values(WORKNAME).map(name => ({ name }))} selectedTags={selectedTags} toggleTag={toggleTag} error={invalidFields.tags} />
      )}
      {shouldRender("reward") && (
        <RewardInputBlock value={rewardInfo} onChange={setRewardInfo} error={invalidFields.rewardInfo} />
      )}
      {shouldRender("address") && (
        <AddressSelectorBlock addressRef={addressRef} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} onClick={() => setAddressPopupOpen(true)} error={invalidFields.address} />
      )}
      {shouldRender("availableTime") && (
        <AvailableTimeInputBlock value={availableTime} onChange={(e) => setAvailableTime(e.target.value)} error={invalidFields.availableTime} />
      )}
      {shouldRender("selfIntro") && (
        <SelfIntroInputBlock value={selfIntro}
          onChange={(e) => setSelfIntro(e.target.value)} // ✅ 정상: 문자열만 들어감
          error={invalidFields.selfIntro}
          inputRef={selfIntroRef}
          userMeta={{
            name: user?.USERINFO?.nickname || "",      
            age: selectedAge,                                  // 선택된 나이
            gender: gender === "male" ? "남성" : "여성",         // 성별 변환
            region: selectedAddress?.split(" ")?.slice(0, 2).join(" ") || "", // 주소 앞 2단어 (예: 서울 관악구)
            category: selectedTags?.join(", ") || ""             // 태그 중 첫 번째 (희망 업무)
          }}
          setUsedAISelfIntro={setUsedAISelfIntro} // ✅ 요거 추가!
        />
      )}
      {shouldRender("ability") && (
        <AbilityInputBlock abilities={abilities} onOpenPopup={() => setAbilityPopupOpen(true)} />
      )}
      {shouldRender("video") && (
        <VideoUploadBlock videoUrl={videoUrl} setVideoUrl={setVideoUrl} setVideoThumbnail={setVideoThumbnail} existingThumbnail={videoThumbnail} />
      )}
      {shouldRender("photos") && (
        <WorkImageUploader uploadedUrls={uploadedUrls} setUploadedUrls={setUploadedUrls} />
      )}
      {shouldRender("career") && (
        <CareerInputBlock value={career} onChange={(e) => setCareer(e.target.value)} />
      )}

      {editMode && abilityPopupOpen && (
        <AbilitySelectPopup onClose={() => setAbilityPopupOpen(false)} initialSelected={abilities} onSave={setAbilities} />
      )}

      <div style={{ marginTop: 40 }}>
        <HongButton variant="primary" fullWidth onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (editMode ? "수정 중..." : "등록 중...") : (editMode ? "수정하기" : "등록하기")}
        </HongButton>




      </div>
      <Toaster position="bottom-right" richColors />
    </Container>
  );
};

export default MobileWorkerRegistContainer;