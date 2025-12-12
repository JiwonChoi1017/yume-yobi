import Error from "@/components/error/Error";

/**
 * 500エラー画面.
 *
 * @returns {JSX.Element} 500エラー画面.
 */
const InternalServerErrorPage = () => {
  return (
    <Error
      title="500"
      subtitle="Internal Server Error"
      detail="申し訳ありません。このページは表示できません。"
    />
  );
};

export default InternalServerErrorPage;
