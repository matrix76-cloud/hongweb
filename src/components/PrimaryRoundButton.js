import styled from "styled-components";
import { COLORS } from "../utility/colors";


export const PrimaryRoundedButton = styled.div`
  width: 100%;
  padding: 12px 0;
  box-sizing: border-box; // ✅ 이거 추가
  background-color: ${COLORS.primary}10; // 연한 primary 색 배경
  color: ${COLORS.primary};
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${COLORS.primary}20;
  }
`;