// ✅ 자세히 보기 팝업 컴포넌트 (하트 수 표시 추가 + 댓글 입력 제거 + 이미지 표시)
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { likePost, unlikePost, getCommentsByPostId } from '../service/PostService';
import { getFontSize } from '../utility/fontsize';
import { Row } from '../common/Row';
import { toast, Toaster } from 'sonner';

const MobilePostDetailPopup = ({ post, userId, onClose }) => {

    const [current, setCurrent] = useState(0);
    if (!post) return null;

    const handleScroll = (e) => {
      const scrollLeft = e.target.scrollLeft;
      const width = e.target.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setCurrent(index);
    };

    const [liked, setLiked] = useState(post.liked || false);
    const [likes, setLikes] = useState(post.likes || 0);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (post?.id) {
            getCommentsByPostId(post.id).then(setComments);
        }
    }, [post?.id]);

    useEffect(() => {
        if (post?.lat && post?.lng && window.kakao?.maps) {
            const mapContainer = document.getElementById('popupMap');
            const options = {
                center: new window.kakao.maps.LatLng(post.lat, post.lng),
                level: 4,
            };
            const map = new window.kakao.maps.Map(mapContainer, options);
            new window.kakao.maps.Marker({
                map,
                position: options.center
            });
        }
    }, [post?.lat, post?.lng]);

    const handleLike = async () => {
        if (liked) {
            await unlikePost(post.id, userId);
            setLikes(prev => Math.max(0, prev - 1));
        } else {
            await likePost(post.id, userId);
            setLikes(prev => prev + 1);
        }
        setLiked(!liked);
    };

    return ReactDOM.createPortal(
      <FullScreen>
        <Toaster richColors />
        <PopupWrapper>
          
                <CloseButton onClick={onClose}>×</CloseButton>
                {post.images?.length > 0 && (
                  <>
                    <ImageSliderContainer onScroll={handleScroll}>
                      {post.images.map((img, idx) => (
                        <SlideImage key={idx} src={img} alt={`img-${idx}`} />
                      ))}
                    </ImageSliderContainer>
                    <ImageIndicator>
                      {post.images.map((_, idx) => (
                        <Dot key={idx} active={current === idx} />
                      ))}
                    </ImageIndicator>
                  </>
                )}

     
        
                <ContentSection>
                  <Title>{post.title}</Title>
          
                  <Content>{post.description}

                  {/* <LikeGroup>
                    <LikeBtn>{liked ? '❤️' : '🤍'}</LikeBtn>
                    <LikeCount>{likes}</LikeCount>
                  </LikeGroup> */}

                    </Content>
               
                
                  <Label>가게 위치</Label>
           
                  <MapContainer id="popupMap" />
                  {/* <Comments>
                    <ul>
                      {comments.map(c => (
                        <li key={c.id}>💬 {c.content}</li>
                      ))}
                    </ul>
                  </Comments> */}


            {post.aiImageUrl && (
              <>
                <Label>AI 이미지</Label>
                <Image src={post.aiImageUrl} alt="AI 이미지" />
              </>
            )}

            {post.ttsUrl && (
              <ListenButton
                onClick={() => {
                  const audio = new Audio(post.ttsUrl);
                  const toastId = toast.loading("🎧 음성 준비 중입니다...", {
                    duration: Infinity,
                    style: {
                      fontSize: '13px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: '#f4f4f5',
                      color: '#111',
                      boxShadow: 'none',
                    },
                  });

                  audio.onloadeddata = () => {
                    toast.dismiss(toastId);
                    const playToastId = toast("🎧 음성을 재생 중입니다...", {
                      duration: Infinity,
                      style: {
                        fontSize: '13px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#f4f4f5',
                        color: '#111',
                        boxShadow: 'none',
                      },
                    });
                    audio.play();
                    audio.onended = () => toast.dismiss(playToastId);
                  };

                  audio.onerror = () => {
                    toast.dismiss(toastId);
                    toast.error("음성 재생에 실패했습니다 😢");
                  };
                }}
              >
                🎧 AI 요약 듣기
              </ListenButton>
            )}
                </ContentSection>


           
          

               
            </PopupWrapper>
        </FullScreen>,
        document.body
    );
};

export default MobilePostDetailPopup;


const ListenButton = styled.div`
  margin: 10px 0 16px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 600;
  width: fit-content;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
`;


const Label = styled.div`
  font-size: ${() => getFontSize(17)}px !important;
  font-family: 'Pretendard-SemiBold';
  margin: 24px 0 8px;
`;


// 💅 스타일드 컴포넌트
const FullScreen = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ffffff;
  z-index: 1000;
  overflow: auto;
`;

const PopupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
`;

const ImageSliderContainer = styled.div`
  width: 100%;
  overflow-x: scroll;
  white-space: nowrap;
  display: flex;
  scroll-snap-type: x mandatory;


  &::-webkit-scrollbar {
    display: none;
  }
`;

const SlideImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  scroll-snap-align: start;
  flex-shrink: 0;
`;

const ContentSection = styled.div`
  padding: 16px 20px;
`;




const Title = styled.div`
  font-size: ${() => getFontSize(22)}px !important;
  font-family: 'Pretendard-SemiBold';
  margin-bottom: 8px;
`;

const Content = styled.div`
  font-size: ${() => getFontSize(15)}px !important;
  color: #444;
  white-space: pre-line;
  margin-bottom: 16px;
`;

const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const SubInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;

`;

const LikeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const LikeBtn = styled.div`
  font-size: 18px;
  padding: 6px 1px;
  border-radius: 6px;


`;

const LikeCount = styled.span`
  font-size: 14px;
  color: #333;
`;

const Comments = styled.div`
  margin-top: 5px;
  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 10px 0;
  }
  li {
    margin-bottom: 6px;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${() => getFontSize(22)}px !important;
  font-weight: bold;
  z-index: 10;
  cursor: pointer;
`;

const ImageIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 10px 0 0;
`;
const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ active }) => (active ? '#FF7A00' : '#ccc')};
`;
