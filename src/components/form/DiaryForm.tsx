import "react-datepicker/dist/react-datepicker.css";

import { AddIcon, DeleteIcon } from "../ui/Icon";
import { Button, DoubleButton } from "../ui/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import React, { useEffect, useRef, useState } from "react";

import Book from "../layout/Book";
import { Diary } from "@/types/Diary";
import classes from "@/styles/DiaryForm.module.css";
import ja from "date-fns/locale/ja";

/** Props. */
interface Props {
  /** 修正フォームか. */
  isModifyForm: boolean;
  /** 日記情報. */
  diaryInfo: Diary;
  /** 日記追加イベントハンドラ. */
  addDiaryHandler: (diary: Omit<Diary, "id" | "updatedAt">) => void;
  /** 日記更新イベントハンドラ. */
  updateDiaryHandler: (diary: Omit<Diary, "createdAt">) => void;
  /** キャンセルボタンを表示するか. */
  showCancelButton: boolean;
  /** キャンセルボタンクリックイベントハンドラ. */
  onClickCancelButtonHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// カレンダーを日本語化するための変数を定義
registerLocale("ja", ja);

/**
 * 日記フォーム.
 *
 * @param {Props} Props
 * @returns {JSX.Element} 日記フォーム.
 */
const DiaryForm = ({
  isModifyForm,
  diaryInfo,
  addDiaryHandler,
  updateDiaryHandler,
  showCancelButton,
  onClickCancelButtonHandler,
}: Props) => {
  // 選択された日付
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // タイトル
  const [title, setTitle] = useState<string>("");
  // 内容
  const [content, setContent] = useState<string>("");
  // タグリスト
  const [tagList, setTagList] = useState<string[]>([]);
  // 活性/非活性状態
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  // 各入力項目のref
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const { date, title, content, tagList } = diaryInfo;

    // 各状態を更新
    setSelectedDate(date);
    setTitle(title);
    setContent(content);
    setTagList(tagList.length ? tagList : []);

    setIsDisabled(!date || !title || !content);
  }, [diaryInfo]);

  // 送信イベントハンドラ
  const onSubmitHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!titleRef.current || !contentRef.current) {
      return;
    }

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    // 空文字を除外した新しいタグの配列を生成
    const filteredTagList = tagList.reduce((acc: string[], tag) => {
      if (!tag) {
        return acc;
      }
      return [...acc, tag];
    }, []);

    if (isModifyForm) {
      updateDiaryHandler({
        id: diaryInfo.id,
        date: selectedDate,
        year: year.toString(),
        month: month.toString(),
        title: titleRef.current.value,
        content: contentRef.current.value,
        tagList: filteredTagList,
        updatedAt: new Date(),
      });
      return;
    }

    addDiaryHandler({
      date: selectedDate,
      year: year.toString(),
      month: month.toString(),
      title: titleRef.current.value,
      content: contentRef.current.value,
      tagList: filteredTagList,
      createdAt: new Date(),
    });
  };
  // 日付変更イベントハンドラ
  const onChangeDateHandler = (date: Date) => {
    setSelectedDate(date);
  };
  // 入力変更イベントハンドラ
  const onChangeInputHandler = () => {
    if (!titleRef.current || !contentRef.current) {
      return;
    }

    const title = titleRef.current.value;
    const content = contentRef.current.value;

    setIsDisabled(!title || !content);
  };
  // タグ変更イベントハンドラ
  const onChangeTagHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const filteredTagList = tagList.reduce((acc: string[], tag, tagIndex) => {
      if (tagIndex === index) {
        return [...acc, e.target.value];
      }
      return [...acc, tag];
    }, []);
    setTagList(filteredTagList);
  };

  // タグ追加アイコンのクリックイベントハンドラ
  const onClickAddTagIconHandler = () => {
    setTagList((prevState) => {
      return [...prevState, ""];
    });
  };
  // タグ削除アイコンのクリックイベントハンドラ
  const onClickDeleteTagIconHandler = (index: number) => {
    const filteredTagList = tagList.reduce((acc: string[], tag, tagIndex) => {
      if (tagIndex === index) {
        return acc;
      }
      return [...acc, tag];
    }, []);
    setTagList(filteredTagList);
  };
  // タグ入力要素
  const tagInputElement = tagList.map((tag, index) => {
    return (
      <div key={index} className={classes.tagInputWrap}>
        <input
          className={classes.tagInput}
          type="text"
          maxLength={50}
          value={tag}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChangeTagHandler(e, index);
          }}
        />
        <DeleteIcon onClickHandler={() => onClickDeleteTagIconHandler(index)} />
      </div>
    );
  });
  // 左ページ要素
  const leftPageElement = (
    <div className={classes.diaryFormWrap}>
      <div className={classes.diaryForm}>
        <div>
          <label htmlFor="date">日付</label>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            locale="ja"
            selected={selectedDate}
            onChange={(date: Date | null) => {
              onChangeDateHandler(date ?? new Date());
            }}
          />
        </div>
        <div>
          <label htmlFor="title">タイトル</label>
          <input
            ref={titleRef}
            type="text"
            id="title"
            name="title"
            maxLength={150}
            defaultValue={title}
            onChange={onChangeInputHandler}
          />
        </div>
        <div>
          <label className={classes.tagLabel} htmlFor="tag">
            タグ
            <AddIcon onClickHandler={onClickAddTagIconHandler} />
          </label>
          {tagInputElement}
        </div>
      </div>
    </div>
  );
  //ボタン要素
  const buttonElement = showCancelButton ? (
    <DoubleButton
      button={{
        first: {
          text: "キャンセル",
          clickHandler: onClickCancelButtonHandler,
        },
        second: {
          className: "submitButton",
          text: isModifyForm ? "修正" : "夢日記を追加",
          isDisabled,
          clickHandler: onSubmitHandler,
        },
      }}
    />
  ) : (
    <Button
      className="singleButton"
      text={isModifyForm ? "修正" : "夢日記を追加"}
      isSubmit={true}
      isDisabled={isDisabled}
    />
  );
  // 右ページ要素
  const rightPageElement = (
    <div className={classes.diaryFormWrap}>
      <div className={classes.diaryForm}>
        <div>
          <label htmlFor="content">内容</label>
          <textarea
            ref={contentRef}
            id="content"
            name="content"
            rows={28}
            maxLength={3000}
            defaultValue={content}
            onChange={onChangeInputHandler}
          />
        </div>
        {buttonElement}
      </div>
    </div>
  );

  return (
    <Book
      leftPage={leftPageElement}
      rightPage={rightPageElement}
      currentPage="diaryForm"
    />
  );
};

export default DiaryForm;
