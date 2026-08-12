// ✅ 자세히 보기 팝업 컴포넌트 (하트 수 표시 추가 + 댓글 입력 제거 + 이미지 표시)
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { likePost, unlikePost, getCommentsByPostId } from '../service/PostService';
import { getFontSize } from '../utility/fontsize';

const MobilePostDetailPopup = ({ post, userId, onClose }) => {
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
            <PopupWrapper>
                <CloseButton onClick={onClose}>닫기</CloseButton>

                <Title>{post.title}</Title>
                <Content>{post.description}</Content>
                <SubInfo>
                    <span>내 위치로부터 {post.distance?.toFixed(1)}km</span>
                    <LikeGroup>
                        <LikeBtn>{liked ? '❤️' : '🤍'}</LikeBtn>
                        <LikeCount>{likes}</LikeCount>
                    </LikeGroup>
                </SubInfo>

                <Comments>
                    <ul>
                        {comments.map(c => (
                            <li key={c.id}>💬 {c.content}</li>
                        ))}
                    </ul>
                </Comments>

                {post.images && post.images.length > 0 && (
                    <ImageGallery>
                        {post.images.map((url, idx) => (
                            <Image key={idx} src={url} alt={`img-${idx}`} />
                        ))}
                    </ImageGallery>
                )}

                <MapContainer id="popupMap" />

               
            </PopupWrapper>
        </FullScreen>,
        document.body
    );
};

export default MobilePostDetailPopup;

// 💅 스타일드 컴포넌트
const FullScreen = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ffffff;
  z-index: 1000;
  overflow: auto;
`;

const PopupWrapper = styled.div`
  padding: 10px 24px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  font-size: 16px;
  background: #f1f1f1;
  border: none;
  padding: 3px 12px;
  border-radius: 8px;
  min-height : 38px;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(22)}px !important;
  font-family: 'Pretendard-SemiBold';
  margin-bottom: 8px;
`;

const Content = styled.p`
  font-size: 15px;
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
  padding: 6px 10px;
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