import React, { useEffect } from "react";

const MapComponent = () => {
  useEffect(() => {
    // 네이버 지도 API가 로드되었는지 확인
    if (window.naver && window.naver.maps) {
      const map = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울 중심 좌표
        zoom: 14,
      });

      // 마커 추가
      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(37.5665, 126.9780),
        map: map,
        title: "서울",
      });
    }
  }, []);

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
};

export default MapComponent;