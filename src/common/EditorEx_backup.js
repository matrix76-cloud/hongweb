import React, { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';

import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

import fontSize from "tui-editor-plugin-font-size";
import "tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css";



export const EditorEx_backup = ({ body, setBody }) => {

  
  const editorRef = useRef();

  const onChangeGetHTML = () => {
    // 에디터에 입력된 내용을 HTML 태그 형태로 취득
    const data = editorRef.current.getInstance().getHTML();
    // Body에 담기
    setBody(data);
  };

  
  return (
      <Editor
        toolbarItems={[
          // 툴바 옵션 설정
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
  
        ]}
        language="ko-KR"
        initialValue={'작성해주세요.'}
        height="800px" // 에디터 창 높이
        width="1000px"
        initialEditType="wysiwyg" // 기본 에디터 타입 (or wysiwyg)
        previewStyle="tab" // 미리보기 스타일 (or tab) (verttical은 양쪽이 나뉨)
        ref={editorRef} // ref 참조
        onChange={onChangeGetHTML} // onChange 이벤트
        plugins={[colorSyntax, fontSize]}
    

      >
      </Editor>
  );
}