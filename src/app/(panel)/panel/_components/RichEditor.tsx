'use client';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { errorToast } from '@/lib/utils';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Editor = dynamic(() => import('react-draft-wysiwyg').then((imported) => imported.Editor), { ssr: false });

type TRichEditor = {
  onSave: (jsonData: string) => void;
  defaultValue?: string;
  className?: string;
  isDisabled?: boolean;
};
const RichEditor = ({ defaultValue, onSave, className, isDisabled }: TRichEditor) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    if (defaultValue) {
      try {
        const blocks = JSON.parse(defaultValue);
        setEditorState(EditorState.createWithContent(convertFromRaw(blocks)));
      } catch {
        errorToast('Nie udało się wczytać poprzedniego opisu!');
      }
    }
  }, [defaultValue]);

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  const handleSave = () => {
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    onSave(content);
  };

  return (
    <div className={className}>
      <Editor
        editorClassName="border max-h-[400px]"
        editorState={editorState}
        readOnly={isDisabled}
        onEditorStateChange={onEditorStateChange}
        localization={{ locale: 'pl' }}
        toolbar={{
          options: [
            'inline',
            'blockType',
            'fontSize',
            'fontFamily',
            'list',
            'textAlign',
            'colorPicker',
            'link',
            'emoji',
            'remove',
            'history',
          ],
        }}
      />
      <Button onClick={handleSave} disabled={isDisabled} className="max-w-sm mt-2 mx-auto w-full">
        Zapisz
      </Button>
    </div>
  );
};

export default RichEditor;
