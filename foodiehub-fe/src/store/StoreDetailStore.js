export async function fetchStoreDetail(storeId) {
    const url = `/api/store/detail/${storeId}`;
    return await httpRequest("GET", url);
}

export async function toggleStoreLike(storeId) {
    const url = `/api/store/like/${storeId}`;
    return await httpRequest("POST", url);
}

export async function toggleStoreFavorite(storeId) {
    const url = `/api/store/favorite/${storeId}`;
    return await httpRequest("POST", url);
}

export async function fetchPagedReviews(storeId, page) {
    const url = `/api/review/store/${storeId}?page=${page}`;
    return await httpRequest("GET", url);
}

export async function toggleReviewLike(reviewId) {
    const url = `/api/review/like/${reviewId}`;
    return await httpRequest("POST", url);
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