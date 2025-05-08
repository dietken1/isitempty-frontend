import React from "react";

const SearchBar = ({ keyword, setKeyword, onSearch, className }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="장소를 입력하세요"
      />
      <button type="submit">검색</button>
      <i
        style={{ fontSize: "22px", cursor: "pointer" }}
        class="ri-crosshair-line"
      ></i>
    </form>
  );
};

export default SearchBar;
