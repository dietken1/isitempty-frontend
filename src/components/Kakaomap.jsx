import React from "react";
import PlaceList from "./PlaceList";

const KakaoMap = ({
  places,
  setSelectedPlace,
  setShowPlaceList,
  className,
  markerRef,
  mapRef,
  pagination,
}) => {
  return (
    <PlaceList
      className={className}
      places={places}
      setSelectedPlace={setSelectedPlace}
      setShowPlaceList={setShowPlaceList}
      mapRef={mapRef}
      markerRef={markerRef}
      map={mapRef.current}
      pagination={pagination}
    />
  );
};

export default KakaoMap;
