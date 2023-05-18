import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Calendar from "@/components/calendar/Calendar";
import { DateHelper } from "@/helpers/date-helper";
import { Diary } from "@/types/Diary";
import { DiaryHelper } from "@/helpers/diary-helper";
import DiaryList from "@/components/list/DiaryList";
import { LIST_QUERY_COUNT } from "@/constants/globalConstant";
import MainLayout from "@/components/layout/MainLayout";
import { useRouter } from "next/router";

/**
 * カレンダー画面.
 *
 * @returns {JSX.Element} カレンダー画面.
 */
const CalendarPage = () => {
  // 現在のユーザーid
  const { currentUserId } = useContext(AuthContext);
  // ルーター
  const router = useRouter();
  // クエリ
  const { query } = router.query;
  // 読み込み中か
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 日記リスト
  const [diaryList, setDiaryList] = useState<Diary[]>([]);

  useEffect(() => {
    if (
      !Array.isArray(query) ||
      query?.length !== LIST_QUERY_COUNT ||
      !currentUserId
    ) {
      return;
    }

    // 日記関連ヘルパー
    const diaryHelper = new DiaryHelper();
    // 日付関連ヘルパー
    const dateHelper = new DateHelper();

    diaryHelper
      .fetchAllDiary(currentUserId, query)
      .then((snapshot) => {
        const tempDiaryList: Diary[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const { title, content, tagList } = data as Diary;
          // 各日付のDate型への変換を行う
          const date = dateHelper.convertTimestampToDate(data, "date");
          const createdAt = dateHelper.convertTimestampToDate(
            data,
            "createdAt"
          );
          const modifiedAt = dateHelper.convertTimestampToDate(
            data,
            "modifiedAt"
          );

          tempDiaryList.push({
            id: doc.id,
            date: date ?? new Date(),
            year: query[0],
            month: query[1],
            title,
            content,
            tagList,
            createdAt: createdAt ?? new Date(),
            modifiedAt: modifiedAt ?? new Date(),
          });
        });
        setDiaryList(tempDiaryList);
      })
      .catch(() => {
        //
      });

    setIsLoading(false);
  }, [query, currentUserId]);

  return (
    <MainLayout>
      <Calendar />
      <DiaryList isLoading={isLoading} diaryList={diaryList} />
    </MainLayout>
  );
};

export default CalendarPage;