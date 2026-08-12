// 📄 src/components/config/etc/MobileDevProjectDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../../../utility/fontsize";
import { getDevProjectById } from "../../../service/DevProjectService";

export default function MobileDevProjectDetail({ projectId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);


    console.log("MobileDevProjectDetail projectId:", projectId);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setData(null);

                if (!projectId) {
                    if (!mounted) return;
                    setData(null);
                    return;
                }

                const res = await getDevProjectById({ projectId });
                if (!mounted) return;
                setData(res || null);
            } catch (e) {
                console.error("getDevProjectById error:", e);
                if (!mounted) return;
                setData(null);
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [projectId]);

    const images = useMemo(() => data?.imageUrls || [], [data]);
    const detailHtml = useMemo(() => data?.detailHtml || "", [data]);

    if (loading) return <Box>불러오는 중…</Box>;
    if (!data) return <Box>프로젝트를 찾을 수 없습니다.</Box>;

    return (
        <Wrap>
            <Head>
                <Title>{data.title}</Title>
                {!!data.desc && <Desc>{data.desc}</Desc>}
                {!!data.tags?.length && (
                    <Tags>
                        {data.tags.slice(0, 3).map((t) => (
                            <Tag key={t}>{t}</Tag>
                        ))}
                    </Tags>
                )}
            </Head>

            {!!detailHtml && (
                <HtmlBox dangerouslySetInnerHTML={{ __html: detailHtml }} />
            )}

            {!!images?.length && (
                <ImgSection>
                    {images.slice(1).map((url, idx) => (
                        <DetailImg
                            key={`${url}-${idx}`}
                            src={url}
                            alt={`detail-${idx + 1}`}
                            loading="lazy"
                        />
                    ))}
                </ImgSection>
            )}
        </Wrap>
    );
}


const Wrap = styled.div`
  padding: 12px;
`;

const Box = styled.div`
  padding: 16px;
  color: rgba(15,23,42,0.7);
  font-weight: 800;
`;

const Head = styled.div`
  border-radius: 16px;
  background: #fff;
  border: 1px solid rgba(15,23,42,0.08);
  box-shadow: 0 6px 14px rgba(2,6,23,0.05);
  padding: 14px;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.2px;
`;

const Desc = styled.div`
  margin-top: 8px;
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 700;
  color: rgba(15,23,42,0.7);
  line-height: 1.55;
`;

const Tags = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eaf3ff;
  border: 1px solid rgba(66, 134, 222, 0.28);
  color: #1d4ed8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${() => getFontSize(11)}px !important;
  font-weight: 900;
  white-space: nowrap;
`;

const HtmlBox = styled.div`
  margin-top: 12px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid rgba(15,23,42,0.08);
  box-shadow: 0 6px 14px rgba(2,6,23,0.05);
  padding: 14px;

  /* ✅ "가운데 정렬 이상함" 방지용: 기본은 left */
  text-align: left;

  /* ✅ 네가 서버에 넣는 html은 class="dc-wrap"로 감싸기로 했으니, 그 규칙 기반으로 기본 타이포 잡아줌 */
  .dc-wrap h1, .dc-wrap h2, .dc-wrap h3 {
    margin: 16px 0 8px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.2px;
  }
  .dc-wrap h2 {
    font-size: ${() => getFontSize(16)}px !important;
  }
  .dc-wrap p, .dc-wrap li, .dc-wrap div {
    font-size: ${() => getFontSize(13)}px !important;
    font-weight: 700;
    color: rgba(15,23,42,0.78);
    line-height: 1.7;
  }
  .dc-wrap ul {
    padding-left: 18px;
    margin: 8px 0;
  }
  .dc-wrap hr {
    border: 0;
    border-top: 1px solid rgba(15,23,42,0.08);
    margin: 14px 0;
  }

  /* ✅ 서버에서 "카테고리 섹션 꾸미기" 하려면: h2 대신 아래 클래스 권장 */
  .dc-title {
    margin: 18px 0 10px;
    padding-left: 10px;
    border-left: 4px solid #4286de;
    font-size: ${() => getFontSize(15)}px !important;
    font-weight: 900;
    color: #0f172a;
  }
`;

const ImgSection = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

const DetailImg = styled.img`
  width: 100%;
  border-radius: 16px;
  display: block;
  border: 1px solid rgba(15,23,42,0.08);
  box-shadow: 0 6px 14px rgba(2,6,23,0.05);
`;
