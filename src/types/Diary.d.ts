/** 日記. */
export type Diary = {
  /** id. */
  id: string;
  /** 日付. */
  date: Date;
  /** 年. */
  year: string;
  /** 月. */
  month: string;
  /** タイトル. */
  title: string;
  /** 内容. */
  content: string;
  /** タグリスト. */
  tagList: string[];
  /** 作成日. */
  createdAt: Date;
  /** 更新日. */
  updatedAt: Date;
};
