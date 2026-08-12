import React, { useContext, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { GoPlusCircle } from "react-icons/go";
import { UserContext } from "../../context/User";
import { uploadImage } from "../../service/UploadService";
import { UpdateContactByResult } from "../../service/ContactService";
import { CreateMessageEx } from "../../service/ChatService";
import { CHATCONTENTTYPE } from "../../utility/screen";
import { sleep } from "../../utility/common";
import MobileWarningPopup from "../../modal/MobileWarningPopup/MobileWarningPopup";
import HongButton from "../HongButton";
import { getFontSize } from "../../utility/fontsize";
import { toast } from "sonner";
import useContractFlow from "../../hooks/useContractFlow";

const MAX_IMAGES = 8;
const GRID_COUNT = 9;

const Container = styled.div`
  background-color: #fff;
  width: 90%;
  margin: 0 auto;
  padding-top: 10px;
`;

const TitleText = styled.div`
  text-align: center;
  margin-bottom: 16px;
  font-size: ${() => getFontSize(15)}px;
  color: #666;
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 10px;
`;

const GridCell = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #fafafa;
  border: 1.5px dashed #bbb;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ImageBox = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const DeleteBtn = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: ${() => getFontSize(12)}px;
  cursor: pointer;
  z-index: 2;
`;

const NoticeText = styled.div`
  font-size: ${() => getFontSize(14)}px;
  color: #888;
  text-align: center;
  margin-top: 12px;
`;

const Complete = ({ containerStyle, ITEM, CONTACTITEM }) => {
    const { user } = useContext(UserContext);
    const fileInput = useRef();

    const flow = useContractFlow(CONTACTITEM.CONTACT_ID);

    const isSupporter = user.USERS_ID === flow.SUPPORTER_ID;
    const isComplete = flow.isWorkDone;
    const isFinalized = flow.isReviewDone || isComplete; // ✅ 평가 or 작업 완료 후 차단

    const [images, setImages] = useState([]);
    const [fail, setFail] = useState(false);
    const [content, setContent] = useState("");

    useEffect(() => {
        if (flow.resultImages?.length) {
            setImages(flow.resultImages);
        } else {
            setImages([]);
        }
    }, [JSON.stringify(flow.resultImages)]);

    const handleUploadImage = async (e) => {
        if (!isSupporter || isFinalized) return;

        const file = e.target.files[0];
        if (!file || !ImagefileExtensionValid(file.name)) {
            setContent("지원하지 않는 이미지 형식입니다.");
            setFail(true);
            return;
        }

        if (images.length >= MAX_IMAGES) {
            setContent("완료 사진은 최대 8장까지 첨부할 수 있습니다.");
            setFail(true);
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = async () => {
                const base64 = resizeImage(img, 200, 200);
                const url = await uploadImage({ uri: base64, random: Math.random() });
                setImages((prev) => [...prev, url]);
            };
        };
        reader.readAsDataURL(file);
    };

    const resizeImage = (img, maxW, maxH) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let { width, height } = img;

        if (width > height && width > maxW) {
            height *= maxW / width;
            width = maxW;
        } else if (height > maxH) {
            width *= maxH / height;
            height = maxH;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        return canvas.toDataURL("image/jpeg", 0.8);
    };

    const ImagefileExtensionValid = (name) => {
        const ext = name.split(".").pop().toLowerCase();
        return ["jpg", "jpeg", "png", "bmp"].includes(ext);
    };

    const handleImageDelete = (index) => {
        if (!isSupporter || isFinalized) return;
        const updated = [...images];
        updated.splice(index, 1);
        setImages(updated);
    };

    const handleCompleteSubmit = async () => {
        if (images.length === 0) {
            setContent("결과 사진을 적어도 한 장 이상 첨부해주세요.");
            setFail(true);
            return;
        }

        const COMPLETE = { type: "complete", result: "", images };

        await UpdateContactByResult({ CONTACT_ID: flow.CONTACT_ID, COMPLETE });

        await CreateMessageEx({
            CHAT_ID: ITEM.CHAT_ID,
            msgitems: [
                `${ITEM.SUPPORTER.USERINFO.nickname}님이 일감을 완료하고 사진을 등록하였습니다.`,
                `${ITEM.OWNER.USERINFO.nickname}님은 결과를 확인 후 평가를 작성해주세요.`,
                `평가가 완료되면 ${ITEM.SUPPORTER.USERINFO.nickname}님에게 용역비가 지급됩니다.`
            ],
            users_id: user.USERS_ID,
            read: [user.USERS_ID],
            CHAT_CONTENT_TYPE: CHATCONTENTTYPE.COMPLETE,
            RESULTITEM: COMPLETE
        });

        await sleep(500);
    };

    const remainingCount = GRID_COUNT - images.length;

    return (
        <Container style={containerStyle}>
            {fail && <MobileWarningPopup callback={() => setFail(false)} content={content} />}

            <GridWrapper>
                {images.map((img, idx) => (
                    <GridCell key={idx}>
                        <ImageBox src={img} />
                        {isSupporter && !isFinalized && (
                            <DeleteBtn onClick={() => handleImageDelete(idx)}>✕</DeleteBtn>
                        )}
                    </GridCell>
                ))}

                {images.length < MAX_IMAGES && isSupporter && !isFinalized && (
                    <GridCell onClick={() => fileInput.current.click()} style={{ cursor: "pointer" }}>
                        <GoPlusCircle size={36} color="#ccc" />
                    </GridCell>
                )}

                {[...Array(remainingCount - 1)].map((_, i) => (
                    <GridCell key={`empty-${i}`} style={{ borderStyle: "dashed", borderColor: "#eee" }} />
                ))}
            </GridWrapper>

            <input type="file" ref={fileInput} onChange={handleUploadImage} style={{ display: "none" }} />

            <div style={{ margin: "20px auto 80px", width: "90%" }}>
                {isComplete ? (
                    <TitleText>✅ 작업 완료 보고가 완료되었습니다.</TitleText>
                ) : (
                    isSupporter && !isFinalized && (
                        <HongButton variant="primary" fullWidth onClick={handleCompleteSubmit}>
                            일감완료
                        </HongButton>
                    )
                )}
            </div>

            {!isSupporter && !isFinalized && (
                <NoticeText>
                    지원자가 결과를 등록하면 여기에 표시됩니다.
                </NoticeText>
            )}
        </Container>
    );
};

export default Complete;
