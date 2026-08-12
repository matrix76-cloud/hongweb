import styled from 'styled-components';

const MobileChatImgPopup = ({ img, callback }) => {
    return (
        <Overlay onClick={callback}>
            <ImgBox>
                <img src={img} alt="미리보기" />
            </ImgBox>
        </Overlay>
    );
};

export default MobileChatImgPopup;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ImgBox = styled.div`
  max-width: 90%;
  max-height: 90%;

  img {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }
`;
