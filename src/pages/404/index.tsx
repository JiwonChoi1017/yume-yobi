import Error from "@/components/error/Error";

/**
 * 404エラー画面.
 *
 * @returns {JSX.Element} 404エラー画面.
 */
const NotFoundPage = () => {
  return (
    <Error
      title="404"
      subtitle="Not Found"
      detail="お探しのページは見つかりませんでした。"
    />
  );
};

export default NotFoundPage;
