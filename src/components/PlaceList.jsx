import React, { useRef } from "react";

const PlaceList = ({
  className,
  places,
  map,
  setSelectedPlace,
  mapRef,
  markerRef,
  setShowPlaceList,
  pagination,
}) => {
  const listRef = useRef(null);
  if (!places.length) return null;

  const handleClick = (place, index) => {
    const position = new window.kakao.maps.LatLng(place.y, place.x);
    if (!mapRef.current) return;

    markerRef.current.forEach((m) => m.setMap(null));
    markerRef.current = [];

    const imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
    const imageSize = new window.kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new window.kakao.maps.Size(36, 691),
      spriteOrigin: new window.kakao.maps.Point(0, index * 46 + 10),
      offset: new window.kakao.maps.Point(13, 37),
    };

    const markerImage = new window.kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imgOptions
    );

    const marker = new window.kakao.maps.Marker({
      position,
      image: markerImage,
    });

    marker.setMap(mapRef.current);
    markerRef.current.push(marker);

    mapRef.current.setCenter(position);
    mapRef.current.setLevel(5);
    setSelectedPlace(position);
    setShowPlaceList(false);
  };

  const handleHover = (place) => {
    const latlng = new window.kakao.maps.LatLng(place.y, place.x);
    if (map) map.panTo(latlng);
  };

  return (
    <ul
      ref={listRef}
      className={className}
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        maxHeight: 300,
        overflowY: "auto",
        marginTop: "1rem",
        listStyle: "none",
      }}
    >
      {places.map((place, index) => (
        <li
          key={place.id}
          style={{ marginBottom: "0.5rem", cursor: "pointer" }}
          onClick={() => handleClick(place, index)}
          onMouseEnter={() => handleHover(place)}
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

      {pagination && (
        <li style={{ marginTop: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            {Array.from({ length: pagination.last }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => {
                  pagination.gotoPage(i + 1);
                  if (listRef.current) listRef.current.scrollTop = 0;
                }}
                style={{
                  padding: "4px 8px",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </li>
      )}
    </ul>
  );
};

export default PlaceList;
