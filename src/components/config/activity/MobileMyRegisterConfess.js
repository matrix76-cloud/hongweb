import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'sonner';
import { UserContext } from '../../../context/User';
import { getFontSize } from '../../../utility/fontsize';
import { Column } from '../../../common/Column';
import { imageDB } from '../../../utility/imageData';
import { getCommentsByPostId, checkUserLikedPost, getMyPosts, deletePost } from '../../../service/PostService';
import MobileRegisterPopup from '../../../modal/MobileRegisterPopup';
import EmptyState from '../../EmptyState';


const MobileMyRegisterConfess = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [myConfess, setMyConfess] = useState([]);
  const [userLikedPosts, setUserLikedPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    const fetchMyWorks = async () => {


      console.log("user", user);
      const rawPosts = await getMyPosts(user.USERS_ID);
      const postsWithDetails = await Promise.all(
        rawPosts.map(async (post) => {
          const comments = await getCommentsByPostId(post.id);
          const liked = await checkUserLikedPost(post.id, user.USERS_ID);
          return { ...post, comments, liked };
        })
      );
      setMyConfess(postsWithDetails);
      setUserLikedPosts(postsWithDetails.filter(p => p.liked).map(p => p.id));
      setLoading(false);
    };

    fetchMyWorks();
  }, [user]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("정말 삭제하시겠어요?");
    if (!confirm) return;

    try {
      await deletePost(id);
      toast.success("삭제되었습니다.");
      setMyConfess(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error("삭제 실패", e);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleViewDetail = (item) => {
    setEditTarget(item);
    setShowPopup(true);
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <Container>
      {myConfess.length === 0 ? (

        <EmptyState type="praise" hideButton={true} />
      ) : (
        <>
          {myConfess.map(item => (
            <Card key={item.id}>
              <TopRow>
                <div><strong>{item.storename}</strong></div>
                <UserType>{item.region}</UserType>
              </TopRow>
              <div>{item.content.slice(0, 80)}...</div>
              <ButtonWrapper>
                <DetailButton onClick={() => handleViewDetail(item)}>수정</DetailButton>
                <DetailButton onClick={() => handleDelete(item.id)}>삭제</DetailButton>
              </ButtonWrapper>
            </Card>
          ))}
        </>
      )}

      {showPopup && (
        <MobileRegisterPopup
          isEdit={!!editTarget}
          postId={editTarget?.id}
          defaultData={editTarget}
          onClose={(refresh) => {
            setShowPopup(false);
            setEditTarget(null);
            if (refresh) {
              setLoading(true);
              (async () => {
                const rawPosts = await getMyPosts(user.USERS_ID);
                const postsWithDetails = await Promise.all(
                  rawPosts.map(async (post) => {
                    const comments = await getCommentsByPostId(post.id);
                    const liked = await checkUserLikedPost(post.id, user.USERS_ID);
                    return { ...post, comments, liked };
                  })
                );
                setMyConfess(postsWithDetails);
                setUserLikedPosts(postsWithDetails.filter(p => p.liked).map(p => p.id));
                setLoading(false);
              })();
            }
          }}
        />
      )}
    </Container>
  );
};

export default MobileMyRegisterConfess;



const Container = styled.div`
`

const Card = styled.div`
  background-color: #f9f9f9; // ← 여기만 바꾸면 됨!
  width: 80%;
  margin: 0 auto 12px;  /* 가운데 정렬 + 카드 간 간격 */
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserType = styled.div`
  font-size: ${() => `${getFontSize(12)}px !important`};
  color: #5284ff;
  background-color: #e6efff;
  padding: 4px 8px;
  border-radius: 8px;
`;



const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
`;

const Tag = styled.div`
  font-size: ${() => `${getFontSize(14)}px !important`};
  color: #4a6cd4;
  background-color: #eff4ff;
  padding: 4px 10px;
  border-radius: 12px;
`;

const Address = styled.div`
  font-size: ${() => `${getFontSize(14)}px !important`};
  color: #333;
  margin-bottom: 4px;
`;

const AvailableTime = styled.div`
  font-size: ${() => `${getFontSize(14)}px !important`};
  color: #333;
  margin-bottom: 12px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px; /* ✅ 버튼 간 간격을 줄임 */
  align-items: center;
  margin-top: 12px;
`;

const DetailButton = styled.button`
  background-color: #5284ff;
  color: white;
  padding: 8px 16px; /* ✅ 기존보다 세로/가로 padding 줄임 */
  border: none;
  border-radius: 6px;
  font-size: ${getFontSize(13)}px; /* ✅ 살짝 작게 */
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
  min-height: 36px; /* ✅ 버튼 높이를 일정하게 유지 */
`;



const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
`;






const InfoBox = styled.div`
  background: #f7f8fa;
  border: 1px solid #ddd;
  padding: 12px;
  margin-bottom: 12px;
  font-size: ${() => getFontSize(15)}px !important;
  color: #333;
  line-height: 1.6;
  margin:30px;
`;
