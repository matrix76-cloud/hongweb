
import ReactQuill,{ Quill }  from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef, useMemo, useState, useEffect } from 'react';
import { uploadImage } from '../service/UploadService';

/* 추가된 코드 */
import ImageResize from 'quill-image-resize';
Quill.register('modules/ImageResize', ImageResize);



export default function EditorEx({ value, setValue }) {
  const quillRef = useRef(null);

  const [html, setHtml] = useState(value);
  const [refresh, setRefresh] = useState(1);

  const onhtmlChange = (data) =>{
     setHtml(data);
     setValue(data);
     setRefresh((refresh) => refresh +1);
  }  
  


  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  
    input.addEventListener('change', async () => {
      const file = input.files[0];
  
      try {
  
        var p1 =  new Promise(function(resolve, reject){
  
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {	
            let img = reader.result;
            resolve(img);
            console.log("TCL: reader.onload -> img", img)
          }
      
        })
  
        const getRandom = () => Math.random();
        const random = getRandom();
  
        p1.then(async(result)=>{
          const uri = result;
          console.log("TCL: imageHandler -> uri", uri)
          
         
          const URL = await uploadImage({uri, random});
  
  
          const editor = quillRef.current.getEditor(); 
          const range = editor.getSelection();
          editor.insertEmbed(range.index, 'image', URL);
          editor.setSelection(range.index + 1);
  
        })
  
      } catch (error) {
        console.log(error);
      }
    });
  };
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: '1' }, { header: '2' }],
          [{ size: [] }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
          ['image'],
        ],
        handlers: { image: imageHandler },
      },
      clipboard: {
        matchVisual: false,
      },
       	/* 추가된 코드 */
	    ImageResize: {
		    parchment: Quill.import('parchment')
	    }
    }),
    [],
  );


  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'color',
    'background',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'align',
    'image',
  ];

  useEffect(()=>{
    setHtml(html);
  }, [refresh])

  return (
    <ReactQuill
      ref={quillRef}
      value={html}
      onChange={onhtmlChange}
      style={{ height: "700px", margin: "4px" }}
      modules={modules}
      formats={formats}
      placeholder={'내용을 입력해주세요'}
      theme="snow"
    />
  );
}