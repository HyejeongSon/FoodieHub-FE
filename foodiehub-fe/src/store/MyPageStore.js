export async function fetchStoreLikes() {
    console.log("fetchStoreLikes 호출");
    const url = "/api/store/like";
    return await httpRequest("GET", url);
}

export async function fetchStoreFavorites() {
    console.log("fetchStoreFavorites 호출");
    const url = "/api/store/favorite"; // 북마크 API URL
    return await httpRequest("GET", url);
}

export async function fetchRemoveStoreLike(storeId) {
    const url = `/api/store/${storeId}/like`;
    return await httpRequest("DELETE", url);
}

export async function fetchRemoveStoreFavorite(storeId) {
    const url = `/api/store/${storeId}/favorite`;
    return await httpRequest("DELETE", url);
}

export async function fetchDeleteReview(reviewId) {
    const url = `/api/review/${reviewId}`;
    return await httpRequest("DELETE", url);
}

export async function fetchUserReviews() {
    console.log("fetchUserReviews호출");
    const url = "/api/review/user";
    return await httpRequest("GET", url);
}

export async function downloadReviewImage(filename) {
    const url = `/api/review/image/${filename}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    });

    if (!response.ok) {
        console.error("이미지 다운로드 실패:", response.status);
        throw new Error("이미지 다운로드 실패");
    }

    return response.blob(); // 이미지 파일 데이터 반환
}

async function httpRequest(method, url, body = null) {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    };

    // 로그아웃 시 Authorization 헤더 제외
    if (url === '/api/auth/logout') {
        console.log('Deleting Authorization UserInfo for Logout Request');
        delete headers.Authorization;
    }

    const options = {
        method,
        headers,
        credentials: 'include', // 쿠키 포함
        body: body ? JSON.stringify(body) : null,
    };

    try {

        const response = await fetch(url, options);

        console.log(`HTTP 요청: ${method} ${url}, 상태: ${response.status}`);

        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return response.text(); // JSON이 아니면 텍스트로 처리
        }

        // 토큰 만료 시 갱신 처리
        if (response.status === 401 && getCookie('refresh_token')) {
            console.log('토큰 만료, 새 토큰 발급 시도');
            const refreshResponse = await fetch('/api/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ refreshToken: getCookie('refresh_token') }),
            });

            if (refreshResponse.ok) {
                const { accessToken } = await refreshResponse.json();
                localStorage.setItem('access_token', accessToken);

                const retryOptions = {
                    ...options,
                    headers: {
                        ...headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                };
                const retryResponse = await fetch(url, retryOptions);
                if (retryResponse.ok) {
                    return await retryResponse.json();
                }
            }
        }
        // 에러 처리 추가
        const errorData = await response.json(); // JSON 응답 파싱
        
        if (response.status === 401) {
            console.info(`HTTP 요청: 401 (Unauthorized)`, errorData);
          } else {
            console.error(`HTTP 요청 실패: ${response.status}`, errorData);
          }

        throw { status: response.status, response: errorData }; // 에러 객체를 throw


    } catch (error) {
        if (error.status === 401) {
            // 401은 에러로 로그 남기지 않기
            // console.info('로그인 필요 상태', error.response);
          } else {
            console.error('HTTP 요청 중 오류 발생:', error);
          }
    
          throw error; // or 에러를 잡아먹어도 됨
    }
}

// 쿠키 가져오는 함수
function getCookie(key) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [k, v] = cookie.trim().split('=');
        if (k === key) return v;
    }
    return null;
}