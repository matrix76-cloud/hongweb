import React from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import EmptyState from "./EmptyState";

/**
 * 대화내역이 없을 때. 공통 EmptyState 로 통일했다. (형 지시 2026-08-12)
 * 기존 호출부(content·height)는 그대로 쓰면 된다.
 */
const Emptychat = ({ containerStyle, content, height }) => (
  <EmptyState
    containerStyle={containerStyle}
    icon={IoChatbubblesOutline}
    content={content}
    height={height}
  />
);

export default Emptychat;
