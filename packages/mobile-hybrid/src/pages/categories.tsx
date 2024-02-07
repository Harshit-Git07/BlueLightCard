import { NextPage } from 'next';

const CategoriesPage: NextPage = () => {
  const backBtn = () => {
    window.history.back();
  };
  return (
    <div className="p-5">
      <button onClick={backBtn}>Back</button>
      <h1>Browse Categories Page</h1>
    </div>
  );
};

export default CategoriesPage;
