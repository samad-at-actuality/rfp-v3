'use client';

import {
  useEditor,
  EditorContent,
  Editor,
  useEditorState,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  Minus,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from 'lucide-react';
import { Toggle } from './ui/toggle';
import TextAlign from '@tiptap/extension-text-align';
import { defaultMarkdownSerializer } from 'prosemirror-markdown';

import { TableKit } from '@tiptap/extension-table';
import { marked } from 'marked';
import { MarkdownSerializer } from 'prosemirror-markdown';

// Custom nodes for markdown serialization
const customNodes = {
  bulletList(state: any, node: any) {
    state.renderList(node, '  ', () => '- ');
  },
  orderedList(state: any, node: any) {
    const start = node.attrs?.order || 1;
    state.renderList(node, '  ', (i: number) => `${start + i}. `);
  },
  listItem(state: any, node: any) {
    state.renderContent(node);
  },
  paragraph(state: any, node: any) {
    state.renderInline(node);
    state.closeBlock(node);
  },
  text(state: any, node: any) {
    state.text(node.text);
  },
  // Add other node types as needed
  ...defaultMarkdownSerializer.nodes,
};

// Custom marks for markdown serialization
const customMarks = {
  // Standard marks
  strong: defaultMarkdownSerializer.marks.strong,
  em: defaultMarkdownSerializer.marks.em,
  code: defaultMarkdownSerializer.marks.code,
  link: defaultMarkdownSerializer.marks.link,
  strike: defaultMarkdownSerializer.marks.strike,

  // Tiptap specific marks
  bold: defaultMarkdownSerializer.marks.strong,
  italic: defaultMarkdownSerializer.marks.em,
  underline: defaultMarkdownSerializer.marks.em, // Underline is not standard in Markdown
};

export const customMarkdownSerializer = new MarkdownSerializer(
  customNodes,
  customMarks
);

const TiptapEditor = ({
  content,
  onUpdate,
  editable,
}: {
  content: string;
  onUpdate?: (html: string) => void;
  editable?: boolean;
}) => {
  const editor = useEditor({
    editable,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TableKit,
    ],
    ...(onUpdate
      ? {
          onUpdate: ({ editor }) => {
            const markdown = customMarkdownSerializer.serialize(
              editor.state.doc
            );
            console.log('markdown: ', markdown);
            onUpdate?.(markdown);
          },
        }
      : {}),
    content: marked.parse(content), // load Markdown into editor as HTML
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[200px] h-[300px] overflow-y-auto p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className='border-1 shadow-md rounded-lg overflow-hidden flex flex-col bg-white w-full'>
      {editable && <Menubar editor={editor} />}{' '}
      <div className='p-0'>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;

const Menubar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,

        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isUnderline: ctx.editor.isActive('underline') ?? false,
        canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,

        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,

        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,

        isAlignLeft:
          ctx.editor.isActive('textAlign', { align: 'left' }) ?? false,
        isAlignCenter:
          ctx.editor.isActive('textAlign', { align: 'center' }) ?? false,
        isAlignRight:
          ctx.editor.isActive('textAlign', { align: 'right' }) ?? false,
      };
    },
  });

  const options = [
    [
      {
        icon: <Undo className='size-4' />,
        onClick: () => editor.chain().focus().undo().run(),
        isActive: false,
        disabled: !editorState.canUndo,
      },
      {
        icon: <Redo className='size-4' />,
        onClick: () => editor.chain().focus().redo().run(),
        isActive: false,
        disabled: !editorState.canRedo,
      },
    ],
    [
      {
        icon: <Bold className='size-4' />,
        onClick: () => editor.chain().focus().toggleBold().run(),
        isActive: editorState.isBold,
        disabled: !editorState.canBold,
      },
      {
        icon: <Italic className='size-4' />,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        isActive: editorState.isItalic,
        disabled: !editorState.canItalic,
      },
      {
        icon: <Underline className='size-4' />,
        onClick: () => editor.chain().focus().setUnderline().run(),
        isActive: editorState.isUnderline,
        disabled: !editorState.canUnderline,
      },
    ],
    [
      {
        icon: <AlignLeft className='size-4' />,
        onClick: () => editor.chain().focus().setTextAlign('left').run(),
        isActive: editorState.isAlignLeft,
        disabled: false,
      },
      {
        icon: <AlignCenter className='size-4' />,
        onClick: () => editor.chain().focus().setTextAlign('center').run(),
        isActive: editorState.isAlignCenter,
        disabled: false,
      },
      {
        icon: <AlignRight className='size-4' />,
        onClick: () => editor.chain().focus().setTextAlign('right').run(),
        isActive: editorState.isAlignRight,
        disabled: false,
      },
      {
        icon: <AlignJustify className='size-4' />,
        onClick: () => editor.chain().focus().setTextAlign('justify').run(),
        isActive: editorState.isAlignRight,
        disabled: false,
      },
    ],
    [
      {
        icon: <List className='size-4' />,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        isActive: editorState.isBulletList,
        disabled: false,
      },
      {
        icon: <ListOrdered className='size-4' />,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: editorState.isOrderedList,
        disabled: false,
      },
    ],
  ];

  const _ = [
    {
      icon: <Heading1 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editorState.isHeading1,
      disabled: false,
    },
    {
      icon: <Heading2 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editorState.isHeading2,
      disabled: false,
    },
    {
      icon: <Heading3 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editorState.isHeading3,
      disabled: false,
    },
    {
      icon: <Heading4 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: editorState.isHeading4,
      disabled: false,
    },
    {
      icon: <Heading5 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: editorState.isHeading5,
      disabled: false,
    },
    {
      icon: <Heading6 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: editorState.isHeading6,
      disabled: false,
    },
    {
      icon: <Strikethrough className='size-4' />,
      onClick: () => editor.chain().focus().setStrike().run(),
      isActive: editorState.isStrike,
      disabled: !editorState.canStrike,
    },
    {
      icon: <Minus className='size-4' />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
      disabled: false,
    },
    // {
    //   icon: <AlignLeft className='size-4' />,
    //   onClick: () => editor.chain().focus().setTextAlign('left').run(),
    //   isActive: editorState.isAlignLeft,
    // },
    // {
    //   icon: <AlignCenter className='size-4' />,
    //   onClick: () => editor.chain().focus().setTextAlign('center').run(),
    //   isActive: editorState.isAlignCenter,
    // },
    // {
    //   icon: <AlignRight className='size-4' />,
    //   onClick: () => editor.chain().focus().setTextAlign('right').run(),
    //   isActive: editorState.isAlignRight,
    // },
    // {
    //   icon: <Highlighter className='size-4' />,
    //   onClick: () => editor.chain().focus().setHorizontalRule().run(),
    //   isActive: editorState.isHorizontalRule,
    // },
  ];
  return (
    <div className='flex items-center gap-2 border-b bg-white p-2 py-2 overflow-hidden rounded-t-lg'>
      {options.map((group, groupIndex) => (
        <div
          key={`group-${groupIndex}`}
          className='flex items-center mr-2 border-r-2 border-r-gray-200 pr-2'
        >
          {group.map((option, optionIndex) => (
            <Toggle
              key={`${groupIndex}-${optionIndex}`}
              onPressedChange={option.onClick}
              pressed={option.isActive}
              disabled={option.disabled}
            >
              {option.icon}
            </Toggle>
          ))}
        </div>
      ))}
    </div>
  );
};
