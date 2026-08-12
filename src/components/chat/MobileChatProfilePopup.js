import styled from 'styled-components';
import MobileProfileConfig from '../config/profile/MobileProfileConfig_working';

const MobileChatProfilePopup = ({ ITEM, callback }) => {

    const handleClose = () => {
      callback();
    }
    return (
      <Overlay onClick={callback}>

        <PopupWrapper onClick={(e) => e.stopPropagation()}>
          <MobileProfileConfig USERS_ID={ITEM.SUPPORTER_ID} editable={false} callback={handleClose} />
        </PopupWrapper>
       
     
             
      </Overlay>
    );
};

export default MobileChatProfilePopup;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.75); // ✅ 약간 더 어두운 팝업 배경
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupWrapper = styled.div`
  width: 90%;
  max-height: 90%;
  background: white;
  border-radius: 20px;
  overflow-y: auto;
  padding: 10px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
`;