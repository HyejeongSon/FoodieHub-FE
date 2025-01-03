import React from "react";

//  voteAverage, uniqueId -> props로 추후에 변경
function StarRating({ voteAverage, uniqueId }) {
  console.log("Rendering StarRating with voteAverage:", voteAverage);
  const AVR_RATE = Math.round(voteAverage * 10) / 10; // 소수점 한 자리로 반올림 (5점 만점)
  const STAR_IDX_ARR = ["first", "second", "third", "fourth", "last"]; // 별의 고유 ID

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

  const ratesResArr = calcStarRates();

  return (
    <div className="star_rate">
      {STAR_IDX_ARR.map((item, idx) => {
        const uniqueClipPathId = `${uniqueId}-${item}StarClip`;
        const uniquePathId = `${uniqueId}-${item}Star`;
        return (
          <span className="star_icon" key={`${item}-${voteAverage}-${idx}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="15"
              viewBox="0 0 14 13"
              fill="rgba(209, 209, 209, 0.5)"
            >
              {/* clipPath의 id를 고유하게 설정 */}
              <clipPath id={uniqueClipPathId}>
                <rect width={`${ratesResArr[idx]}`} height="15" />
              </clipPath>
              <path
                id={uniquePathId}
                d="M9,2l2.163,4.279L16,6.969,12.5,10.3l.826,4.7L9,12.779,4.674,15,5.5,10.3,2,6.969l4.837-.69Z"
                transform="translate(-2 -2)"
              />
              <use
                clipPath={`url(#${uniqueClipPathId})`}
                href={`#${uniquePathId}`}
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
