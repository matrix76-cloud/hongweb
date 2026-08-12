import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getFontSize } from '../utility/fontsize';
import { imageDB } from '../utility/imageData';
import MobileRegisterPopup from '../modal/MobileRegisterPopup';
import { addComment, checkUserLikedPost, getAllPosts, getCommentsByPostId, likePost, unlikePost } from '../service/PostService';
import { Column } from '../common/Column';
import { distanceFunc } from '../utility/region';
import { UserContext } from '../context/User';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import MobilePostDetailPopup from '../modal/MobilePostDetailPopup';
import { COLORS } from '../utility/colors';
import { toast, Toaster } from 'sonner';

const getIconByType = (type) => {
    const map = {
        '칭찬': imageDB.praise,
        '고발': imageDB.accuse
    };
    return map[type] || null;
};

const getStoreSentence = (storeName, type) => {
    const lastChar = storeName.charCodeAt(storeName.length - 1) - 44032;
    const jong = lastChar % 28;
    const particle = jong === 0 ? '를' : '을';
    return `${storeName}${particle} ${type === '칭찬' ? '칭찬합니다' : '가게를 소개합니다'}`;
};

const formatTimeAgo = (date) => {
    if (!date) return '';
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  };

const GoBallListView = () => {
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [openCommentIndex, setOpenCommentIndex] = useState(null);
    const [openDetailIndex, setOpenDetailIndex] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showHeartIndex, setShowHeartIndex] = useState(null);
    const [userLikedPosts, setUserLikedPosts] = useState([]);
    const [selectedMap, setSelectedMap] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);

    const { dispatch, user } = useContext(UserContext);
    const [commentText, setCommentText] = useState('');

    const toggleHeart = async (index, postId) => {
        const hasLiked = userLikedPosts.includes(postId);
        const updatedLiked = hasLiked
            ? userLikedPosts.filter(id => id !== postId)
            : [...userLikedPosts, postId];

        setUserLikedPosts(updatedLiked);
        setPosts(prev => {
            const copy = [...prev];
            copy[index].likes = Math.max(0, copy[index].likes + (hasLiked ? -1 : 1));
            return copy;
        });

        if (hasLiked) {
            await unlikePost(postId, user.USERS_ID);
        } else {
            await likePost(postId, user.USERS_ID);
            setShowHeartIndex(index);
            setTimeout(() => setShowHeartIndex(null), 700);
        }
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userLat = user.USERINFO.latitude;
                const userLng = user.USERINFO.longitude;

                if (!userLat || !userLng) {
                    console.warn("사용자 위치 정보가 없습니다");
                    setPosts([]);
                    setLoading(false);
                    return;
                }

                const allPosts = await getAllPosts();

                const postsWithDistance = allPosts
                    .map((p) => {
                        const lat = p.lat;
                        const lng = p.lng;
                        if (lat && lng) {
                            const dist = distanceFunc(userLat, userLng, lat, lng);
                            return { ...p, distance: dist };
                        }
                        return null;
                    })
                    .filter(p => p)
                    .sort((a, b) => a.distance - b.distance);

                // ✅ 단계적 거리 확장 필터링
                let filteredPosts = postsWithDistance.filter(p => p.distance <= 5);
                if (filteredPosts.length <= 5) {
                    filteredPosts = postsWithDistance.filter(p => p.distance <= 10);
                }
                if (filteredPosts.length <= 5) {
                    filteredPosts = postsWithDistance.filter(p => p.distance <= 20);
                }

                const postsWithDetails = await Promise.all(
                    filteredPosts.map(async (post) => {
                        const comments = await getCommentsByPostId(post.id);
                        const liked = await checkUserLikedPost(post.id, user.USERS_ID);
                        return { ...post, comments, liked };
                    })
                );

                console.log("📦 최종 게시물 목록:", postsWithDetails);

                setPosts(postsWithDetails);
                setUserLikedPosts(postsWithDetails.filter(p => p.liked).map(p => p.id));
            } catch (e) {
                console.error('❌ 게시물 로딩 오류', e);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [user]);
      

    const handleHeartClick = (index) => {
        setShowHeartIndex(index);
        setTimeout(() => setShowHeartIndex(null), 700);
    };

    const getRibbonColor = (type) => {
        if (type === "칭찬하기") return "#FF7E19";
        if (type === "자랑하기") return "#4C84FF";
        return "#999"; // fallback
      };

    const handleSubmitComment = async (postId, index) => {
        if (!commentText.trim()) return;

        const newComment = {
            content: commentText,
            writer: user.USERINFO.nickname || '익명',
            profileImg: user.USERINFO.userimg || imageDB.default_profile,
            createdAt: new Date()
            };
        // Firestore 등록 함수 (예: addComment(postId, newComment))
        await addComment(postId, newComment);

        // UI에 즉시 반영
        setPosts(prev => {
            const copy = [...prev];
            copy[index].comments = [...copy[index].comments, newComment];
            return copy;
        });

        setCommentText('');
    };
    
    useEffect(() => {
        if (selectedMap && window.kakao?.maps) {
            const container = document.getElementById("miniMap");
            const options = {
                center: new window.kakao.maps.LatLng(selectedMap.lat, selectedMap.lng),
                level: 4,
            };
            const map = new window.kakao.maps.Map(container, options);
            new window.kakao.maps.Marker({
                map,
                position: options.center
            });
        }
    }, [selectedMap]);

    return (
        <>
            <Wrapper>


                <Toaster richColors />
                {loading ? (
                    <Column style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 60 }}>
                        <EmptyTitle>불러오는 중입니다...</EmptyTitle>
                    </Column>
                ) : posts.length === 0 ? (
                    <Column style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 60 }}>
                        <EmptyImage src={imageDB.emptypraise} loading="eager" />
                        <EmptyTitle>칭찬이나 자기가게를  홍보해주세요</EmptyTitle>
                    </Column>
                ) : (
                    posts.map((item, index) => {
                        const hasImages = item.images && item.images.length > 0;

                        return (
                            <Card key={item.id}>
                                <Ribbon style={{ background: getRibbonColor(item.type) }}>{item.type}</Ribbon>
                                <TargetLine>
                      
                                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <TitleMain>{getStoreSentence(item.storename, item.type)}</TitleMain>
                      
                                        <DistanceText>내 위치로부터 약 {item.distance.toFixed(1)}km</DistanceText>
                                    </div>
                                </TargetLine>

                                <TopText>
                                    {openDetailIndex === index ? item.content : item.content.slice(0, 45) + '...'}
                                </TopText>

                                {hasImages && (
                                    <ImageContainer $count={item.images.length}>
                                        {item.images.slice(0, 1).map((url, idx) => (
                                            <ImageOverlayContainer key={idx}>
                                                <StyledImage src={url} alt={`img-${idx}`} fullWidth />
                                                <OverlayText onClick={() => {
                                                    setSelectedPost({
                                                        ...item,
                                                        title: getStoreSentence(item.storename, item.type),
                                                        description: item.content
                                                    });
                                                }}>자세히 보기</OverlayText>

                                                {item.ttsUrl && (
                                                    <OverlayListenButton
                                                        onClick={() => {
                                                            const audio = new Audio(item.ttsUrl);
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
                                                    </OverlayListenButton>
                                                )}


                                            </ImageOverlayContainer>
                                        ))}

                                    </ImageContainer>
                                )}

                                <MetaInfo>
                                    <CommentProfile src={item.profileImg || imageDB.default_profile} />
                                    {item.writer || '익명'} 
                                </MetaInfo>

                                {openCommentIndex === index && (
                                    <CommentContainer>
                                        <CommentWriteBox>
                                            <CommentInput
                                                placeholder="댓글을 입력하세요"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                            />
                                            <CommentSubmitButton onClick={() => handleSubmitComment(item.id, index)}>등록</CommentSubmitButton>
                                        </CommentWriteBox>
                                        {item.comments.length === 0 && (
                                            <EmptyCommentText>댓글이 없습니다.</EmptyCommentText>
                                        )}
                                        {item.comments.map((c, i) => (
                                            <CommentBlock key={i}>
                                                <CommentMeta>
                                                    <CommentProfile src={c.profileImg || imageDB.default_profile} />
                                                    <CommentContent>
                                                        <CommentHeader>
                                                            <strong>{c.writer}</strong>
                                                            {formatTimeAgo(c.createdAt?.toDate?.().toLocaleDateString?.()) || ''}
                                                        </CommentHeader>
                                                        <CommentText>{c.content}</CommentText>
                                                    </CommentContent>
                                                </CommentMeta>
                                            </CommentBlock>
                                        ))}
                                    </CommentContainer>
                                )}

                                {showHeartIndex === index && (
                                    <HeartOverlay>
                                        <img src={imageDB.hearton} style={{ width: 80, height: 80 }} />
                                    </HeartOverlay>
                                )}

                            </Card>
                        );
                    })
                )}




                <AddButton onClick={() => setShowPopup(true)}>+</AddButton>
                {showPopup && <MobileRegisterPopup
                    onClose={(refresh) => {
                        setShowPopup(false);
                        if (refresh) {
                            // ✅ 새 게시글 등록 후 다시 데이터 로딩
                            setLoading(true);
                            setPosts([]);
                            setOpenCommentIndex(null);
                            setOpenDetailIndex(null);
                            // 🔁 데이터 다시 불러오기
                            (async () => {
                                try {
                                    const userLat = user.USERINFO.latitude;
                                    const userLng = user.USERINFO.longitude;

                                    if (!userLat || !userLng) return;
                                    const allPosts = await getAllPosts();

                                    const postsWithDistance = allPosts
                                        .map((p) => {
                                            const lat = p.lat;
                                            const lng = p.lng;
                                            if (lat && lng) {
                                                const dist = distanceFunc(userLat, userLng, lat, lng);
                                                return { ...p, distance: dist };
                                            }
                                            return null;
                                        })
                                        .filter(p => p && p.distance <= 20)
                                        .sort((a, b) => a.distance - b.distance);

                                    const postsWithDetails = await Promise.all(
                                        postsWithDistance.map(async (post) => {
                                            const comments = await getCommentsByPostId(post.id);
                                            const liked = await checkUserLikedPost(post.id, user.USERS_ID);
                                            return { ...post, comments, liked };
                                        })
                                    );

                                    setPosts(postsWithDetails);
                                    setUserLikedPosts(postsWithDetails.filter(p => p.liked).map(p => p.id));
                                } catch (e) {
                                    console.error('게시물 로딩 오류', e);
                                    setPosts([]);
                                } finally {
                                    setLoading(false);
                                }
                            })();
                        }
                    }}
                />}


            </Wrapper>
 


            {selectedPost && (
                <MobilePostDetailPopup
                    post={selectedPost}
                    userId={user.USERS_ID}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </>


        
    );
};

export default GoBallListView;

const OverlayListenButton = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.85); // ✅ 이전: 0.92 → 좀 더 투명하게
  color: #111827;
  border: 1px solid rgba(229, 231, 235, 0.8); // ✅ 선도 살짝 투명하게
  border-radius: 999px;
  font-size: ${getFontSize(13)}px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  backdrop-filter: blur(4px); // ✅ 선택: 약간 흐릿한 배경 효과
`;


const CommentWriteBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  font-size: ${() => getFontSize(13)}px !important;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  resize: none;
  line-height: 1.4;
`;

const CommentSubmitButton = styled.button`
  align-self: flex-end;
  padding: 6px 14px;
  min-height: 30px;
  background-color: #a9abae;
  color: white;
  font-size: ${() => getFontSize(13)}px !important;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const EmptyCommentText = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #999;
  padding: 6px 0;
`;


const CommentContent = styled.div`
  flex: 1;
  font-size: ${() => getFontSize(13)}px !important;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
  color: #888;
  font-size: ${() => getFontSize(13)}px !important;
`;

const CommentText = styled.div`
  color: #333;
  line-height: 1.4;
  font-size: ${() => getFontSize(13)}px !important;
`;

const Wrapper = styled.div`
  padding: 16px;
  position: relative;
  margin-bottom:50px;
`;

const Card = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin: 10px 5px 20px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
`;

const TargetLine = styled.div`
  display: flex;
  align-items: center;
  font-size: ${() => getFontSize(18)}px !important;
  font-family: 'Pretendard-SemiBold';
  color: #222;
  margin-bottom: 6px;
  margin-top: 25px;
`;

const TopText = styled.div`
  font-size: ${() => getFontSize(15)}px;
  font-weight: 500;
  color: #222;
  margin-bottom: 10px;
  line-height: 1.5;
`;

const ImageContainer = styled.div`
  display: ${({ count }) => (count === 1 ? 'block' : 'grid')};
  grid-template-columns: ${({ count }) => (count > 1 ? '1fr 1fr' : 'none')};
  gap: 6px;
  margin-top: 8px;
`;

const StyledImage = styled.img`
  width: 100%;
  aspect-ratio: 1.7 / 1;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
  grid-column: span 2;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${() => getFontSize(13)}px !important;
  color: #777;
  margin-top: 6px;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const IconImg = styled.img`
  width: 28px;
  height: 38px;
`;

const HeartOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 64px;
  pointer-events: none;
  animation: popFade 0.7s ease-out;

  @keyframes popFade {
    0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
    40% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
  }
`;

const AddButton = styled.button`
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 80px);
  right: 16px;
  z-index: 3;
  background: #fff;
  border: 2px solid ${COLORS.primary};
  color: ${COLORS.primary};
  border-radius: 50%;
  width: 52px;
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
    font-size: ${() => getFontSize(32)}px !important;
`;

const CommentToggle = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #444;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #FE6625;
  }
`;

const CommentContainer = styled.div`
  margin-top: 12px;
  padding-left: 4px;
  border-left: 2px solid #eee;
`;

const CommentBlock = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  margin-bottom: 12px;
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: ${() => getFontSize(13)}px !important;
  color: #555;
`;

const CommentProfile = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #ccc;
`;

const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
`;

const EmptyTitle = styled.div`
    margin-top: 20px;
    font-family: 'Pretendard-SemiBold';
    font-size: ${() => getFontSize(18)}px !important;
    color: #423f3f;
`
const RegionTag = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  background-color: #f3f3f3;
  color: #333;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

const OverlayText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: ${getFontSize(13)}px;
  cursor: pointer;
`;

const ImageOverlayContainer = styled.div`
  position: relative;
`;

const MapPopup = styled.div`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 200px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 2000;
  overflow: hidden;
`;

const CloseMap = styled.div`
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 22px !important;
  color: #333;
  cursor: pointer;
  z-index: 10;
`;

const TitleMain = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: 'Pretendard-SemiBold';
  color: #222;
  margin-bottom: 4px;
`;

const DistanceText = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #666;
  padding-left:5px;
`;


const Ribbon = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #fe7125;
  color: white;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  z-index: 10;
`;
const ListenButton = styled.div`
  margin-top: 10px;
  padding: 6px 14px;
  background-color: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  width: fit-content;

  &:hover {
    background-color: #e5e7eb;
  }
`;