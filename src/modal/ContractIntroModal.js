import ModalWrapper from './ModalWrapper';
import styled from 'styled-components';

const ContractList = styled.div`

list-style-type: disc;
padding-left: 20px;
margin-bottom: 20px;
color: #333;
`



export const ContractIntroModal = ({ onClose, onSubmit }) => {
  return (
    <ModalWrapper
      title="📄 계약서를 작성하기 전 확인해주세요"
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel="계약서 작성 화면으로 이동"
    >
        <ContractList>

        <ul>
        <li>계약은 서로의 합의에 따라 작성됩니다.</li>
        <li>의뢰자는 금액을 입력하고 먼저 서명해야 합니다.</li>
        <li>도움주실 분은 이후 서명하여 계약을 완료합니다.</li>
        <li>양쪽 모두 서명 후, 결제가 완료되면 계약이 법적 효력을 가집니다.</li>
        </ul>

        </ContractList>

    </ModalWrapper>
  );
};


