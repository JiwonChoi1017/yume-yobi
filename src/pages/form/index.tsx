import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { DateHelper } from "@/helpers/date-helper";
import { Diary } from "@/types/Diary";
import DiaryForm from "@/components/form/DiaryForm";
import { DiaryHelper } from "@/helpers/diary-helper";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

/** Props. */
interface Props {
  /** (任意)遷移元. */
  referer?: string;
  /** (任意)id. */
  id?: string;
}

// 日記関連ヘルパー
const diaryHelper = new DiaryHelper();
// 日付関連ヘルパー
const dateHelper = new DateHelper();

/**
 * フォーム画面.
 *
 * @param {Props} Props
 * @returns {JSX.Element} フォーム画面.
 */
const FormPage = ({ referer, id }: Props) => {
  // 現在のユーザーid
  const { currentUserId } = useContext(AuthContext);
  // ルーター
  const router = useRouter();
  // 日記情報
  const [diaryInfo, setDiaryInfo] = useState<Diary>({
    id: "",
    date: new Date(),
    year: "",
    month: "",
    title: "",
    content: "",
    tagList: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  // キャンセルボタンの表示状態
  const [showCancelButton, setShowCancelButton] = useState<boolean>(false);

  useEffect(() => {
    if (referer) {
      // 現在のURL
      const { origin, pathname } = location;
      const currentUrl = `${origin}${pathname}`;
      // 遷移元と現在のURLが一致しない場合、trueをセット
      setShowCancelButton(referer !== currentUrl);
    }

    // 日記id、もしくはユーザーidが存在しない場合、早期リターン
    if (!id || !currentUserId) {
      return;
    }

    // 日記を取得
    diaryHelper.fetchDiary(currentUserId, id).then((doc) => {
      const data = doc.data();
      // 日記を取得できなかった場合、早期リターン
      if (!data) {
        return;
      }
      const { year, month, title, content, tagList } = data as Diary;
      // 各日付のDate型への変換を行う
      const date = dateHelper.convertTimestampToDate(data, "date");
      const createdAt = dateHelper.convertTimestampToDate(data, "createdAt");
      const updatedAt = dateHelper.convertTimestampToDate(data, "updatedAt");
      setDiaryInfo({
        id: doc.id,
        date: date ?? new Date(),
        year,
        month,
        title,
        content,
        tagList,
        createdAt: createdAt ?? new Date(),
        updatedAt: updatedAt ?? new Date(),
      });
    });
  }, [referer, id, currentUserId]);

  // 日記追加イベントハンドラ
  const addDiaryHandler = async (diary: Omit<Diary, "id" | "updatedAt">) => {
    // 現在のユーザーidが存在しない場合、早期リターン
    if (!currentUserId) {
      return;
    }

    await diaryHelper
      .addDiary(currentUserId, diary)
      .then(() => {
        router.push("/calendar");
      })
      .catch();
  };
  // 日記更新イベントハンドラ.
  const updateDiaryHandler = async (diary: Omit<Diary, "createdAt">) => {
    // 現在のユーザーidが存在しない場合、早期リターン
    if (!currentUserId) {
      return;
    }

    await diaryHelper
      .updateDiary(currentUserId, diary)
      .then(() => {
        router.push("/calendar");
      })
      .catch();
  };
  // 前のページへ戻る
  const goBackPreviousPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };

  return (
    <DiaryForm
      isModifyForm={!!id}
      diaryInfo={diaryInfo}
      addDiaryHandler={addDiaryHandler}
      updateDiaryHandler={updateDiaryHandler}
      showCancelButton={showCancelButton}
      onClickCancelButtonHandler={goBackPreviousPage}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context) {
    return { props: {} };
  }

  // contextから遷移元の情報を取得
  const referer = context.req.headers.referer ?? null;
  const id = context.query?.id ?? null;

  return { props: { referer, id } };
};

export default FormPage;
