import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { FaCamera } from "react-icons/fa";
import { uploadImage } from "../service/UploadService";
import { fixOrientationAndCompress } from "../utility/image";
import { UserContext } from "../context/User";


import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../api/config"; // ✅ 상단에 이미 있을 수 있음


const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Preview = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
`;

const Placeholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #eee;
`;

const UploadLabel = styled.label`
  background: #f0f0f0;
  border-radius: 50%;
  padding: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e0e0e0;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;





const MobileProfileImageUploader = ({ initialImage, onUploadComplete, onFileSelect }) => {
    const [preview, setPreview] = useState(initialImage || null);
    const [fileName, setFileName] = useState("");
    const { dispatch, user } = useContext(UserContext);

    
    useEffect(() => {
        if (initialImage) {
            setPreview(initialImage);
        }
    }, [initialImage]);



    return (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {preview ? (
                <img
                    src={preview}
                    alt="profile"
                    style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
                />
            ) : (
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "#eee",
                    }}
                />
            )}

            {/* 파일 선택 버튼 커스텀 */}
            <div>
                <label
                    htmlFor="profile-upload"
                    style={{
                        display: "inline-block",
                        padding: "6px 14px",
                        background: "var(--surface)",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        fontSize: "13px",
                        cursor: "pointer",
                    }}
                >
                  파일 선택
                </label>
                <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            onFileSelect?.(file); // 🔥 외부에서 crop 열도록 위임
                        }
                      }}
                    style={{ display: "none" }}
                />

            </div>
        </div>
    );
};

export default MobileProfileImageUploader;
