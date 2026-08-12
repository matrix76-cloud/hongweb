import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../context/User";
import { ReadRECIPE } from "../service/RecipeService";
import { imageDB } from "../utility/imageData";
import { ensureHttps, shuffleArray, shuffleArray10 } from "../utility/common";
import { getFontSize } from "../utility/fontsize";
import { LazyFoodImageex } from "../common/LasyImageex";
import LottieAnimation from "../common/LottieAnimation";
import { LoadingSearchAnimationStyle } from "../screen/css/common";
import MobileRecipePopup from "../modal/MobileRecipePopup";

const MobileRecipeBoard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(30);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupItem, setPopupItem] = useState({});

  useEffect(() => {
    async function fetchData() {
      const all = await ReadRECIPE();
      const shuffled = shuffleArray(all); // 🔄 전체를 섞고
      setRecipes(shuffled);               // 💾 전체 저장
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = recipes
    .filter(r => r.ITEM.RCP_NM.includes(query))
    .slice(0, visibleCount);

  const handleClick = (item) => {
    setPopupItem(item);
    setPopupOpen(true);
  };

  return (
    <>
      {popupOpen && (
        <MobileRecipePopup item={popupItem.ITEM} totalitem={popupItem} callback={() => setPopupOpen(false)} />
      )}

      <SearchWrapper>
        <SearchInput
          placeholder="요리 제목 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </SearchWrapper>

      <Container>
        {loading ? (
          <LottieAnimation
            containerStyle={LoadingSearchAnimationStyle}
            animationData={imageDB.loadinglarge}
            width={"100px"}
            height={"100px"}
          />
        ) : (
          <MasonryGrid>
            {filtered.map((data, index) => (
              <Card key={index} onClick={() => handleClick(data)}>
                <LazyFoodImageex
                  src={ensureHttps(data.ITEM.ATT_FILE_NO_MK)}
                  containerStyle={{
                    width: "100%",
                    aspectRatio: "4 / 3",  // ✅ 비율 기반 레이아웃 확보
                    backgroundColor: "#ededed",
                    borderRadius: 10,
                  }}
                />
                <TagRow>
                  <Tag highlight>{data.ITEM.RCP_PAT2}</Tag>
                  <Tag secondary>{data.ITEM.RCP_WAY2}</Tag>
                </TagRow>
                <Name>{data.ITEM.RCP_NM}</Name>
                <Desc>{data.ITEM.RCP_NA_TIP}</Desc>
              </Card>
            ))}
          </MasonryGrid>
        )}
        {!loading && filtered.length === visibleCount && (
          <LoadMoreButton onClick={() => setVisibleCount(visibleCount + 30)}>
            더보기
          </LoadMoreButton>
        )}
      </Container>
    </>
  );
};

export default MobileRecipeBoard;

// styled-components
const Header = styled.div`
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 10px 16px;
`;

const BackButton = styled.div`
  margin-right: 8px;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: Pretendard-SemiBold;
  color: #1A1E28;
`;

const SearchWrapper = styled.div`
  position: sticky;
  top: 0px; /* 헤더 높이 아래로 딱 고정되게 */
  background: #fff;
  z-index: 9;
  padding: 8px 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: ${() => getFontSize(14)}px !important;
`;

const Container = styled.div`
  padding: 0 16px 40px;
`;

const MasonryGrid = styled.div`
  column-count: 2;
  column-gap: 16px;
`;

const Card = styled.div`
  break-inside: avoid;
  margin-bottom: 20px;
  cursor: pointer;
`;

const TagRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
`;

const Tag = styled.div`
  background-color: ${({ highlight, secondary }) =>
    highlight ? "#FFF0E9" : secondary ? "#f5f5f5" : "#eee"};
  color: ${({ highlight, secondary }) =>
    highlight ? "#FE6625" : secondary ? "#66686F" : "#333"};
  padding: 4px 8px;
  font-size: ${() => getFontSize(12)}px !important;
  border-radius: 12px;
`;

const Name = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  font-family: Pretendard-SemiBold;
  color: #1A1E28;
  margin-top: 4px;
`;

const Desc = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #666;
  margin-top: 4px;
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 20px auto 50px;
  padding: 10px 16px;
  font-size: ${() => getFontSize(16)}px !important;
  border: none;
  background-color: #FF7E19;
  width :80%;
  color: white;
  border-radius: 8px;
  cursor: pointer;

`;
