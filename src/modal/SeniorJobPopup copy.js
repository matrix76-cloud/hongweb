import ReactDOM from "react-dom";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";

import {
    MdBusiness,
    MdInfoOutline,
    MdPerson,
    MdLanguage,
    MdLocationOn,
} from "react-icons/md";
import { FaRegEdit, FaUsers, FaUserClock, FaPhone } from "react-icons/fa";


const SeniorJobPopup = ({ job, onClose }) => {
    return ReactDOM.createPortal(
        <Backdrop onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <Title>{job?.wantedTitle || "일자리 제목"}</Title>
                <Content>
                    <InfoRow><MdBusiness /> 모집회사 : {job.plbizNm}</InfoRow>
                    <InfoRow><MdLocationOn /> 주소 : {job.plDetAddr}</InfoRow>
                    <InfoRow><MdInfoOutline /> 참고내용 : {job.etcItm}</InfoRow>
                    <InfoRow><FaUserClock /> 연령제한 : {job.age ? `${job.age}세 이상` : '제한 없음'}</InfoRow>
                    <InfoRow>
                        <FaRegEdit />
                        접수방법 : {(job.acptMthdCd && {
                            CM0801: '온라인',
                            CM0802: '이메일',
                            CM0803: '팩스',
                            CM0804: '방문'
                        }[job.acptMthdCd]) || job.acptMthdCd}
                    </InfoRow>
                    <InfoRow><FaUsers /> 모집인원 : {job.clltPrnnum}명</InfoRow>
                    <InfoRow><MdPerson /> 담당자 : {job.clerk}</InfoRow>
                    {job.clerkContt && <InfoRow><FaPhone /> 담당자 전화번호 : {job.clerkContt}</InfoRow>}
                    {job.homepage && <InfoRow><MdLanguage /> 홈페이지 주소 : {job.homepage}</InfoRow>}
                </Content>
                <CloseButton onClick={onClose}>닫기</CloseButton>
            </Modal>
        </Backdrop>,
        document.getElementById("modal-root")
    );
};

export default SeniorJobPopup;

const Backdrop = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const Title = styled.div`
  font-size: ${() => getFontSize(20)}px !important;
  font-family : Pretendard-SemiBold;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Content = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #444;
  background-color : #eee;
  padding :10px;
  white-space: pre-line;
  line-height: 1.6;
`;

const CloseButton = styled.button`
  margin-top: 20px;
  background: #ff7e19;
  color: white;
  width: 100%;
  padding: 10px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 8px;
  font-size: ${() => getFontSize(14)}px !important;

  svg {
    min-width: 16px;
    margin-top: 2px;
    color: #666;
  }
`;

