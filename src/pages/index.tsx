import React, { useEffect, useState } from "react";

import Loader from "@/components/ui/Loader";
import Logo from "@/components/ui/Logo";
import NotSupportSpError from "@/components/error/NotSupportSpError";
import { OpenDiaryButton } from "@/components/ui/Button";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/router";

/**
 * ホーム画面.
 *
 * @returns {JSX.Element} ホーム画面.
 */
const HomePage = () => {
  // 読み込み中か
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // SPサポート対象外エラーを表示するか
  const [showNotSupportSpError, setShowNotSupportSpError] =
    useState<boolean>(false);
  // ルーター
  const router = useRouter();

  useEffect(() => {
    setShowNotSupportSpError(isMobile);
    setIsLoading(false);
  }, []);

  // 日記を開くイベントハンドラ
  const openDiaryHandler = () => {
    router.push("/calendar");
  };

  // 読み込み中の場合
  if (isLoading) {
    return <Loader isFromTop={true} />;
  }

  // SPサポート対象外エラーを表示する場合
  if (showNotSupportSpError) {
    return (
      <NotSupportSpError
        title="スマートフォンでは<br />ご利用いただけません"
        detail="お手数ですが、PCにてご利用ください。"
      />
    );
  }

  return (
    <>
      <Logo />
      <OpenDiaryButton text="日記帳を開く" clickHandler={openDiaryHandler} />
    </>
  );
};

export default HomePage;
