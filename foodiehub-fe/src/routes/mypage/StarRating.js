import styled from "styled-components";
import { useState, useEffect, memo } from "react";

const StarRate = memo(({ num, id }) => {
  const AVR_RATE = num * 20; // 별점에 대한 비율 계산
  const STAR_IDX_ARR = ["first", "second", "third", "fourth", "last"];
  const [ratesResArr, setRatesResArr] = useState([0, 0, 0, 0, 0]);

  const calcStarRates = () => {
    let tempStarRatesArr = [0, 0, 0, 0, 0];
    let starVerScore = (AVR_RATE * 70) / 100; // 비율 계산
    let idx = 0;

    while (starVerScore > 14) {
      tempStarRatesArr[idx] = 14; // 최대 14로 설정
      idx += 1;
      starVerScore -= 14;
    }
    tempStarRatesArr[idx] = parseFloat(starVerScore.toFixed(2)); // 소수점 2자리까지 처리
    return tempStarRatesArr;
  };

  useEffect(() => {
    setRatesResArr(calcStarRates());
  }, [num]); // num 값 변경 시 계산

  return (
    <StarRateWrap key={id}>
      {STAR_IDX_ARR.map((item, idx) => (
        <span className="star_icon" key={`${item}_${id}_${idx}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="19"
            viewBox="0 0 14 13"
            fill="#cacaca"
          >
            <clipPath id={`${item}StarClip_${id}`}>
              <rect width={`${ratesResArr[idx]}`} height="39" />
            </clipPath>
            <path
              id={`${item}Star_${id}`}
              d="M9,2l2.163,4.279L16,6.969,12.5,10.3l.826,4.7L9,12.779,4.674,15,5.5,10.3,2,6.969l4.837-.69Z"
              transform="translate(-2 -2)"
            />
            <use
              clipPath={`url(#${item}StarClip_${id})`}
              href={`#${item}Star_${id}`}
              fill="#21BF73"
            />
          </svg>
        </span>
      ))}
    </StarRateWrap>
  );
});

export default StarRate;

const StarRateWrap = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 100px 0 0 15px;
  display: inline;
  .star_icon {
    display: inline-flex;
    margin-right: 5px;
  }
`;
