import { useContext, useEffect } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Book from "@/components/layout/Book";
import SignInForm from "@/components/sign-in/SignInForm";
import { useRouter } from "next/router";

/**
 * ログイン画面.
 *
 * @returns {JSX.Element} ログイン画面.
 */
const SignInPage = () => {
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
    <Book leftPage={<></>} rightPage={<SignInForm />} currentPage="signIn" />
  );
};

export default SignInPage;
