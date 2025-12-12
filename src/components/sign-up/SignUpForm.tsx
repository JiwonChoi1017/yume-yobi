import { useContext, useRef, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { AuthErrorCodes } from "firebase/auth";
import { DoubleButton } from "../ui/Button";
import { ErrorInfo } from "@/types/Error";
import { RESPONSE_STATUS } from "@/constants/globalConstant";
import UserForm from "../layout/UserForm";
import { useRouter } from "next/router";

/**
 * ユーザー登録フォーム.
 *
 * @returns {JSX.Element} ユーザー登録フォーム.
 */
const SignUpForm = () => {
  // 各入力項目のref
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  // 活性/非活性状態
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  // エラー情報
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  // ルーター
  const router = useRouter();
  // ユーザー登録ハンドラ
  const { signUpHandler } = useContext(AuthContext);
  // 送信イベント
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef.current || !passwordRef.current) {
      return;
    }
    // ユーザー登録イベント発火させ、エラー情報を取得
    const errorInfo = await signUpHandler({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    setErrorInfo(errorInfo);
    // ユーザー登録に成功した場合、ログイン画面へ移動
    if (errorInfo && errorInfo.status === RESPONSE_STATUS.SUCCESS) {
      router.push("/sign-in");
    }
  };
  // キャンセルイベント
  const onCancelHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // ログイン画面に戻る
    router.push("/sign-in");
  };
  // 入力変更イベントハンドラ
  const onChangeInputHandler = () => {
    if (!emailRef.current || !passwordRef.current) return;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    // 活性/非活性状態を更新
    setIsDisabled(!email || !password || password.length < 10);
  };
  // エラー状態か
  const isError = errorInfo?.status === RESPONSE_STATUS.ERROR;
  // メールアドレス入力エラーか
  const isEmailError =
    isError &&
    (errorInfo?.code === AuthErrorCodes.INVALID_EMAIL ||
      errorInfo?.code === AuthErrorCodes.EMAIL_EXISTS);
  // メールアドレスエラー文言
  const emailErrorMsg = isEmailError && (
    <p className="errorMsg">{errorInfo.message}</p>
  );
  // パスワード入力エラーか
  const isPasswordError =
    isError &&
    (errorInfo?.code === AuthErrorCodes.INVALID_PASSWORD ||
      errorInfo?.code === AuthErrorCodes.WEAK_PASSWORD);
  // パスワードエラー文言
  const passwordErrorMsg = isPasswordError && (
    <p className="errorMsg">{errorInfo.message}</p>
  );

  return (
    <UserForm title="新規登録" onSubmitHandler={onSubmitHandler}>
      <div>
        <label htmlFor="email">メールアドレス</label>
        <input
          ref={emailRef}
          id="email"
          className={`${isEmailError ? "error" : ""}`}
          name="email"
          type="text"
          maxLength={254}
          placeholder="例：example@mail.com"
          onChange={onChangeInputHandler}
        />
        {emailErrorMsg}
      </div>
      <div>
        <label htmlFor="password">パスワード</label>
        <input
          ref={passwordRef}
          id="password"
          className={`${isPasswordError ? "error" : ""}`}
          name="password"
          type="password"
          placeholder="例：10文字以上の文字"
          onChange={onChangeInputHandler}
        />
        {passwordErrorMsg}
      </div>
      <DoubleButton
        button={{
          first: {
            text: "登録する",
            isSubmit: true,
            isDisabled,
          },
          second: {
            text: "キャンセル",
            clickHandler: onCancelHandler,
          },
        }}
      />
    </UserForm>
  );
};

export default SignUpForm;
