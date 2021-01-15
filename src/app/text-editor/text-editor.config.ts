import { NgxEditorConfig } from 'ngx-editor';
import schema from './text-editor.schema';
import plugins from './plugins';

export const textEditorConfig: NgxEditorConfig = {
  schema,
  plugins,
  menu: [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote', 'ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ],
  locals: {
    // menu
    bold: 'Жирный',
    italic: 'Курсив',
    code: 'Код',
    blockquote: 'Цитата',
    underline: 'Подчеркнутый',
    strike: 'Зачеркнутый',
    bullet_list: 'Маркированный список',
    ordered_list: 'Нумерованный список',
    heading: 'Обычный текст',
    h1: 'Заголовок 1',
    h2: 'Заголовок 2',
    h3: 'Заголовок 3',
    h4: 'Заголовок 4',
    h5: 'Заголовок 5',
    h6: 'Заголовок 6',
    align_left: 'По левому краю',
    align_center: 'По центру',
    align_right: 'По правому краю',
    align_justify: 'Растянуть',
    text_color: 'Цвет текста',
    background_color: 'Цвет фона',

    // pupups, forms, others...
    url: 'Ссылка',
    text: 'Текст',
    openInNewTab: 'Открыть в новой вкладке',
    insert: 'Вставить',
    altText: 'Описание',
    title: 'Название',
    remove: 'Удалить',
  },
};
