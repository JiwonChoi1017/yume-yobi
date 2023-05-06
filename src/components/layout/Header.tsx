import { FaCalendarAlt, FaPlus, FaUserAlt } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * ヘッダー.
 *
 * @returns {JSX.Element} ヘッダー.
 */
const Header = () => {
  // ログイン中か
  const [isSignIn, setIsSignIn] = useState<boolean>(false);
  // ログアウトイベントハンドラ、現在のユーザー
  const { signOutHandler, currentUser } = useContext(AuthContext);
  // ルーター
  const router = useRouter();

  useEffect(() => {
    setIsSignIn(!!currentUser);
  }, [currentUser]);

  // ログインアイコンのクリックイベントハンドラ
  const onClickSignInIconHandler = () => {
    router.push("/sign-in");
  };
  // ログアウトアイコンのクリックイベントハンドラ
  const onClickSignOutHandler = async () => {
    await signOutHandler();
    setIsSignIn(!!currentUser);
    router.push("/");
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/form">
              <FaPlus />
            </Link>
          </li>
          <li>
            <Link href="/calendar">
              <FaCalendarAlt />
            </Link>
          </li>
          <li
            onClick={
              isSignIn ? onClickSignOutHandler : onClickSignInIconHandler
            }
          >
            <FaUserAlt />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;