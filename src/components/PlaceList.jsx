import React from "react";

const PlaceList = ({ places }) => {
  if (!places.length) return null;

  return (
    <ul
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        maxHeight: 300,
        overflowY: "auto",
        marginTop: "1rem",
      }}
    >
      {places.map((place, index) => (
        <li
          key={place.id}
          style={{ marginBottom: "0.5rem", cursor: "pointer" }}
          onClick={() => {
            const latlng = new window.kakao.maps.LatLng(place.y, place.x);
            window.map.setCenter(latlng);
          }}
        >
          <strong>
            {index + 1}. {place.place_name}
          </strong>
          <br />
          <span style={{ fontSize: "0.9rem", color: "#666" }}>
            {place.address_name}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PlaceList;
