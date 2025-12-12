import { useContext, useEffect } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Book from "@/components/layout/Book";
import MyPageMenu from "@/components/my/MyPageMenu";
import { useRouter } from "next/router";

/**
 * マイページ.
 *
 * @returns {JSX.Element} マイページ.
 */
const MyPage = () => {
  // 現在のユーザー
  const { currentUser } = useContext(AuthContext);
  // ルーター
  const router = useRouter();

  useEffect(() => {
    // ユーザー情報が存在しない場合、ログイン画面にリダイレクトさせる
    if (!currentUser) {
      router.push("/sign-in");
      return;
    }
  }, [currentUser, router]);

  return <Book leftPage={<></>} rightPage={<MyPageMenu />} currentPage="my" />;
};

export default MyPage;
