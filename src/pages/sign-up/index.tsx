import { useContext, useEffect } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Book from "@/components/layout/Book";
import SignUpForm from "@/components/sign-up/SignUpForm";
import { useRouter } from "next/router";

/**
 * ユーザ登録画面.
 *
 * @returns {JSX.Element} ユーザ登録画面.
 */
const SignUpPage = () => {
  // 現在のユーザー
  const { currentUser } = useContext(AuthContext);
  // ルーター
  const router = useRouter();

  useEffect(() => {
    // ユーザー情報が存在する場合、マイページにリダイレクトさせる
    if (!!currentUser) {
      router.push("/my");
      return;
    }
  }, [currentUser, router]);

  return (
    <Book leftPage={<></>} rightPage={<SignUpForm />} currentPage="signUp" />
  );
};

export default SignUpPage;
