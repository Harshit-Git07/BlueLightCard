const Spinner = () => {
  return (
    <div className="p-3 rounded bg-white dark:bg-gray-700 shadow-lg">
      <svg
        className="spinner"
        width="60px"
        height="60px"
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="path"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          cx="33"
          cy="33"
          r="30"
        ></circle>
      </svg>
    </div>
  );
};

export default Spinner;
