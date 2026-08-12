import React from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import EmptyState from "./EmptyState";

/**
 * 목록이 비었을 때. 공통 EmptyState 로 통일했다. (형 지시 2026-08-12)
 * 기존 호출부(content·height)는 그대로 쓰면 된다.
 */
const Empty = ({ containerStyle, content, height }) => (
  <EmptyState
    containerStyle={containerStyle}
    icon={IoDocumentTextOutline}
    content={content}
    height={height}
  />
);

export default Empty;
