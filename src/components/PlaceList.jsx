import React from "react";

const PlaceList = ({
  className,
  places,
  map,
  setSelectedPlace,
  mapRef,
  markerRef,
  setShowPlaceList,
}) => {
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
    setSelectedPlace(position); // 좌표 저장
    setShowPlaceList(false);
  };

  const handleHover = (place) => {
    const latlng = new window.kakao.maps.LatLng(place.y, place.x);
    if (map) map.panTo(latlng);
  };

  return (
    <ul
      className={className}
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
    </ul>
  );
};

export default PlaceList;
