import React from "react";
import "./Pagination.css";


const Pagination = ({
  totalPosts,
  userPerPage,
  setCurrentPage,
  currentPage,
}) => {
  let pages = [];

  for (let i = 1; i <= Math.ceil(totalPosts / userPerPage); i++) {
    pages.push(i);
  }
 

  return (
    <div className="pagination" style={{justifyContent:"center"}}>
      {currentPage > 1 && totalPosts > userPerPage ? (
        <>
          <button onClick={() => setCurrentPage(1)}>{"<<"}</button>
          <button onClick={() => setCurrentPage(currentPage - 1)}>{"<"}</button>
        </>
      ) : null}

      {pages.map((page, index) => {
        return (
          <button
            key={index}
            onClick={() => setCurrentPage(page)}
            className={page === currentPage ? "active" : ""}
          >
            {page}
          </button>
        );
      })}
      {currentPage < 5 && totalPosts > userPerPage ? (
        <>
          <button onClick={() => setCurrentPage(currentPage + 1)}>{">"}</button>
          <button
            onClick={() => setCurrentPage(Math.ceil(totalPosts / userPerPage))}
          >
            {">>"}
          </button>
        </>
      ) : null}
    </div>
  );
};

export default Pagination;
