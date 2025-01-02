import React, { useState, useEffect } from "react";

function StarRating(props) {
  const AVR_RATE = Math.round(props.voteAverage * 10) / 10; // 소수점 한 자리로 반올림 (5점 만점)
  const STAR_IDX_ARR = ["first", "second", "third", "fourth", "last"]; // 별의 고유 ID
  const [ratesResArr, setRatesResArr] = useState([0, 0, 0, 0, 0]); // 별점 리스트 상태

  const calcStarRates = () => {
    let tempStarRatesArr = [0, 0, 0, 0, 0]; // 임시 리스트
    let starVerScore = AVR_RATE * 14; // 별 하나의 크기를 14로 계산
    let idx = 0;

    while (starVerScore > 14) {
      tempStarRatesArr[idx] = 14; // 가득 찬 별
      idx += 1; // 다음 별
      starVerScore -= 14; // 남은 점수
    }
    tempStarRatesArr[idx] = starVerScore; // 마지막 별 채우기
    return tempStarRatesArr;
  };

  useEffect(() => {
    setRatesResArr(calcStarRates()); // 첫 렌더링 시 상태 설정
  }, [AVR_RATE]);

  return (
    <div className="star_rate">
      {STAR_IDX_ARR.map((item, idx) => {
        return (
          <span className="star_icon" key={idx}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="15"
              viewBox="0 0 14 13"
              fill="rgba(209, 209, 209, 0.5)"
            >
              {/* clip-path는 임의의 사각형을 만들어 별 위에 덮어줍니다. */}
              <clipPath id={`${item}StarClip`}>
                {/* 여기서 width는 SVG의 viewBox 기준입니다. */}
                <rect width={`${ratesResArr[idx]}`} height="15" />
              </clipPath>
              <path
                id={`${item}Star`}
                d="M9,2l2.163,4.279L16,6.969,12.5,10.3l.826,4.7L9,12.779,4.674,15,5.5,10.3,2,6.969l4.837-.69Z"
                transform="translate(-2 -2)"
              />
              {/* clip-path를 사용하기 위한 태그입니다. */}
              <use
                clipPath={`url(#${item}StarClip)`}
                href={`#${item}Star`}
                fill="#21BF73" // 채운 별의 색상
              />
            </svg>
          </span>
        );
      })}
    </div>
  );
}

export default StarRating;
