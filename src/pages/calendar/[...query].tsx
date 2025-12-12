import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Book from "@/components/layout/Book";
import Calendar from "@/components/calendar/Calendar";
import { DateHelper } from "@/helpers/date-helper";
import { Diary } from "@/types/Diary";
import { DiaryHelper } from "@/helpers/diary-helper";
import DiaryList from "@/components/list/DiaryList";
import { EventClickArg } from "@fullcalendar/core";
import { GetServerSideProps } from "next";
import { YearMonth } from "@/types/Common";
import { useRouter } from "next/router";

// 日記関連ヘルパー
const diaryHelper = new DiaryHelper();
// 日付関連ヘルパー
const dateHelper = new DateHelper();

/** Props. */
interface Props {
  /** 日付. */
  date: {
    /** 年. */
    year: string;
    /** 月. */
    month: string;
  };
}

/**
 * カレンダー画面.
 *
 * @param {Props} Props
 * @returns {JSX.Element} カレンダー画面.
 */
const CalendarPage = ({ date: { year, month } }: Props) => {
  // 現在のユーザーid
  const { currentUserId } = useContext(AuthContext);
  // ルーター
  const router = useRouter();
  // 年月
  const [yearMonth, setYearMonth] = useState<YearMonth>({
    year,
    month,
  });
  // 読み込み中か
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 日記リスト
  const [diaryList, setDiaryList] = useState<Diary[]>([]);
  // 日記リストを表示するか
  const [showDiaryList, setShowDiaryList] = useState<boolean>(true);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    setYearMonth({ year, month });

    diaryHelper
      .fetchAllDiary(currentUserId, year, month)
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
          const updatedAt = dateHelper.convertTimestampToDate(
            data,
            "updatedAt"
          );

          tempDiaryList.push({
            id: doc.id,
            date: date ?? new Date(),
            year: yearMonth.year,
            month: yearMonth.month,
            title,
            content,
            tagList,
            createdAt: createdAt ?? new Date(),
            updatedAt: updatedAt ?? new Date(),
          });
        });
        // 日記リストを日付順で並び替え
        const sortedDiaryList = [...tempDiaryList].sort((a, b) => {
          return a.date.getTime() - b.date.getTime();
        });
        setDiaryList(sortedDiaryList);
        setShowDiaryList(sortedDiaryList.length > 0);
      })
      .catch(() => {
        //
      });

    setIsLoading(false);
  }, [currentUserId, year, month, yearMonth.year, yearMonth.month]);

  // 「今日」クリックイベントハンドラ
  const clickTodayHandler = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    // 先月のカレンダーへ遷移
    router.push(`/calendar/${year}/${month}`);
  };
  // 「前へ」クリックイベントハンドラ
  const clickPrevHandler = () => {
    const { year, month } = yearMonth;
    const newYear = +month <= 1 ? (+year - 1).toString() : year;
    const newMonth = +month <= 1 ? "12" : (+month - 1).toString();
    // 先月のカレンダーへ遷移
    router.push(`/calendar/${newYear}/${newMonth}`);
  };
  // 「次へ」クリックイベントハンドラ
  const clickNextHandler = () => {
    const { year, month } = yearMonth;
    const newYear = +month >= 12 ? (+year + 1).toString() : year;
    const newMonth = +month >= 12 ? "1" : (+month + 1).toString();
    // 来月のカレンダーへ遷移
    router.push(`/calendar/${newYear}/${newMonth}`);
  };
  // 日付クリックイベントハンドラ
  const onClickDateHandler = (arg: EventClickArg) => {
    const { publicId } = arg.event._def;
    // 詳細画面へ遷移する
    router.push(`/detail?id=${publicId}`);
  };

  return (
    <Book
      // カレンダー
      leftPage={
        <Calendar
          yearMonth={yearMonth}
          diaryList={diaryList}
          clickTodayHandler={clickTodayHandler}
          clickPrevHandler={clickPrevHandler}
          clickNextHandler={clickNextHandler}
          onClickDateHandler={onClickDateHandler}
        />
      }
      // 日記リスト
      rightPage={
        <DiaryList
          isLoading={isLoading}
          diaryList={diaryList}
          showDiaryList={showDiaryList}
        />
      }
      currentPage="calendar"
    />
  );
};

export default CalendarPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const filterData = params?.query;

  // クエリが取得できなかった場合、notFoundをtrueにしてリターン
  if (!filterData) {
    return { notFound: true };
  }

  const numYear = +filterData[0];
  const numMonth = +filterData[1];

  // 年月が数字じゃない、もしくは正しくない月だった場合、notFoundをtrueにしてリターン
  if (isNaN(numYear) || isNaN(numMonth) || numMonth > 12 || numMonth < 1) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      date: {
        year: numYear.toString(),
        month: numMonth.toString(),
      },
    },
  };
};
