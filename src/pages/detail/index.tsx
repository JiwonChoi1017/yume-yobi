import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { DateHelper } from "@/helpers/date-helper";
import { Diary } from "@/types/Diary";
import DiaryDetail from "@/components/detail/DiaryDetail";
import { DiaryHelper } from "@/helpers/diary-helper";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

/** Props. */
interface Props {
  /** (任意)id. */
  id?: string;
}

// 日記関連ヘルパー
const diaryHelper = new DiaryHelper();
// 日付関連ヘルパー
const dateHelper = new DateHelper();

/**
 * 詳細画面.
 *
 * @param {Props} Props
 * @returns {JSX.Element} 詳細画面.
 */
const DetailPage = ({ id }: Props) => {
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

  useEffect(() => {
    // 日記idが存在しない場合、404にリダイレクトさせる
    if (!id) {
      router.replace("/404");
      return;
    }

    // ユーザーidが存在しない場合、早期リターン
    if (!currentUserId) {
      return;
    }

    // 日記を取得
    diaryHelper.fetchDiary(currentUserId, id).then((doc) => {
      const data = doc.data();
      // 日記を取得できなかった場合、404にリダイレクトさせる
      if (!data) {
        router.replace("/404");
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
  }, [router, id, currentUserId]);

  // 日記削除イベントハンドラ
  const deleteDiaryHandler = async () => {
    // ユーザーidが存在しない場合、早期リターン
    if (!currentUserId) {
      return;
    }

    await diaryHelper
      .deleteDiary(currentUserId, diaryInfo.id)
      .then(() => {
        router.push(`/calendar`);
      })
      .catch(() => {});
  };

  return (
    <DiaryDetail
      diaryInfo={diaryInfo}
      onClickDeleteButtonHandler={deleteDiaryHandler}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context) {
    return { props: {} };
  }

  // contextから遷移元の情報を取得
  const id = context.query?.id ?? null;

  return { props: { id } };
};

export default DetailPage;
