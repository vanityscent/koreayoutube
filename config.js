// YouTube Data API v3 설정
const CONFIG = {
    // Google Cloud Console에서 발급받은 YouTube Data API v3 키를 여기에 입력하세요
    API_KEY: 'AIzaSyDr9CsdEaS4k9l14wXcQ7GMtPb6_MrZCeg',
    
    // API 엔드포인트
    BASE_URL: 'https://www.googleapis.com/youtube/v3',
    
    // 검색 파라미터
    SEARCH_PARAMS: {
        part: 'snippet',
        type: 'video',
        regionCode: 'KR',           // 한국 지역
        videoDuration: 'short',     // 쇼츠 영상만
        order: 'relevance',         // 관련성 순 (더 많은 결과를 위해)
        maxResults: 50,             // 더 많은 결과를 위해 50개로 증가
        publishedAfter: '',         // 최근 7일로 설정됨
        publishedBefore: '',        // 오늘까지로 설정됨
        q: 'shorts'                 // 쇼츠 관련 키워드 추가
    }
};

// API 키 유효성 검사
function validateApiKey() {
    if (!CONFIG.API_KEY || CONFIG.API_KEY ==='AIzaSyDr9CsdEaS4k9l14wXcQ7GMtPb6_MrZCeg') {
        throw new Error('YouTube API 키가 설정되지 않았습니다. config.js 파일에서 API_KEY를 설정해주세요.');
    }
}

// 최근 7일 날짜 범위 설정 (더 유연한 검색을 위해)
function setRecentDateRange() {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    CONFIG.SEARCH_PARAMS.publishedAfter = sevenDaysAgo.toISOString();
    CONFIG.SEARCH_PARAMS.publishedBefore = endOfToday.toISOString();
}
