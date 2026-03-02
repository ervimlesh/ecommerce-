
export default function Pagination({ pageNo, setPageNo,totalPosts }) {
  const prevThreeNoArr = Array.from(
    { length: 2 },
    (_, index) => pageNo - 1 - index
  )
    .filter((value) => value > 0)
    .reverse();
  const nextFourNoArr = Array.from({ length: 1 }, (_, index) => pageNo + index);
  const paginationArr = [...prevThreeNoArr, ...nextFourNoArr];

  const handleNext = () => {
    setPageNo(pageNo + 1);
  };
  const handlePrev = () => {
    setPageNo(pageNo - 1);
  };
  return (
    <div className="pagination-container">
      {pageNo > 1 ? (
        <div onClick={handlePrev} className="page-btn">
          {"<"}
        </div>
      ) : (
        ""
      )}
      {paginationArr.map((value) => {
        return (
          <>
            <div
              onClick={() => setPageNo(value)}
              className={value == pageNo ? `page-btn active` : `page-btn`}
            >
              {value}
            </div>
          </>
        );
      })}

      {/* <div onClick={handleNext} className="page-btn">
        {">"}
      </div> */}
      {pageNo < totalPosts ? (
        <div onClick={handleNext} className="page-btn">
          {">"}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
