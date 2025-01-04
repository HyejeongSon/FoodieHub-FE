import React, { useEffect } from "react";

const MapComponent = ({address, name}) => {  
  useEffect(() => {
    // 네이버 지도 API가 로드되었는지 확인
    if (window.naver && window.naver.maps) {
      const map = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울 중심 좌표
        zoom: 14,
      });

      // 주소를 좌표로 바꾸는 코드
      window.naver.maps.Service.geocode(
        {
          query: address , // 주소 전달
        },
        function (status, response) {
          //좌표값 y,x 순서
          const location = new window.naver.maps.LatLng(response.v2.addresses[0].y, response.v2.addresses[0].x);
          marker.setPosition(location); //마커
          map.setCenter(location);  //지도위치
        }
      );

      // 마커 추가
      let marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(37.5665, 126.9780),
        map: map,
        title: name,
      });

      var contentString = [
        '<div class="iw_inner">',
        '   <h3>' +name+'</h3>',
        '</div>'
    ].join('');

      var infowindow = new window.naver.maps.InfoWindow({
        content: contentString
    });
    
      window.naver.maps.Event.addListener(marker, "click", function(e) {
        if (infowindow.getMap()) {
            infowindow.close();
        } else {
            infowindow.open(map, marker);
        }
    });

    }
  }, 
);

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
};

export default MapComponent;