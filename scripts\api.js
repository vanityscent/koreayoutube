/**
 * YouTube Data API v3 클래스
 * 한국 인기 쇼츠 데이터를 가져오는 기능을 제공합니다.
 */
class YouTubeAPI {
    constructor() {
        this.baseUrl = CONFIG.BASE_URL;
        this.apiKey = CONFIG.API_KEY;
    }

    /**
     * API 키 유효성 검사
     */
    validateApiKey() {
        if (!this.apiKey || this.apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
            throw new Error('YouTube API 키가 설정되지 않았습니다. config.js 파일에서 API_KEY를 설정해주세요.');
        }
    }

    /**
     * URL 파라미터를 쿼리 스트링으로 변환
     * @param {Object} params - URL 파라미터 객체
     * @returns {string} 쿼리 스트링
     */
    buildQueryString(params) {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                queryParams.append(key, value);
            }
        });
        
        return queryParams.toString();
    }

    /**
     * YouTube API에서 인기 쇼츠 데이터를 가져옵니다
     * @returns {Promise<Array>} 쇼츠 영상 데이터 배열
     */
    async getPopularShorts() {
        try {
            this.validateApiKey();
            
            // 최근 7일 날짜 범위 설정
            setRecentDateRange();
            
            const searchParams = {
                ...CONFIG.SEARCH_PARAMS,
                key: this.apiKey
            };

            const queryString = this.buildQueryString(searchParams);
            const url = `${this.baseUrl}/search?${queryString}`;

            console.log('YouTube API 요청:', url);

            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API 요청 실패: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.items || data.items.length === 0) {
                console.log('최근 7일 내 쇼츠를 찾을 수 없어 대체 검색을 시도합니다...');
                return await this.getFallbackShorts();
            }

            // 비디오 상세 정보를 가져오기 위해 비디오 ID 수집
            const videoIds = data.items.map(item => item.id.videoId).join(',');
            
            // 비디오 상세 정보 가져오기 (조회수, 업로드 시간 등)
            const videoDetails = await this.getVideoDetails(videoIds);
            
            // 데이터 병합 및 정리
            const shortsData = this.mergeVideoData(data.items, videoDetails);
            
            return shortsData;

        } catch (error) {
            console.error('YouTube API 오류:', error);
            throw error;
        }
    }

    /**
     * 대체 검색: 날짜 제한 없이 인기 쇼츠를 검색합니다
     * @returns {Promise<Array>} 쇼츠 영상 데이터 배열
     */
    async getFallbackShorts() {
        try {
            console.log('대체 검색을 시작합니다...');
            
            // 날짜 제한 없이 인기 쇼츠 검색
            const fallbackParams = {
                part: 'snippet',
                type: 'video',
                regionCode: 'KR',
                videoDuration: 'short',
                order: 'viewCount',
                maxResults: 20,
                q: 'shorts',
                key: this.apiKey
            };

            const queryString = this.buildQueryString(fallbackParams);
            const url = `${this.baseUrl}/search?${queryString}`;

            console.log('대체 YouTube API 요청:', url);

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`대체 API 요청 실패: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.items || data.items.length === 0) {
                throw new Error('인기 쇼츠를 찾을 수 없습니다.');
            }

            // 비디오 상세 정보를 가져오기 위해 비디오 ID 수집
            const videoIds = data.items.map(item => item.id.videoId).join(',');
            
            // 비디오 상세 정보 가져오기
            const videoDetails = await this.getVideoDetails(videoIds);
            
            // 데이터 병합 및 정리
            const shortsData = this.mergeVideoData(data.items, videoDetails);
            
            console.log(`대체 검색으로 ${shortsData.length}개의 쇼츠를 찾았습니다.`);
            return shortsData;

        } catch (error) {
            console.error('대체 검색 오류:', error);
            throw new Error('인기 쇼츠를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
    }

    /**
     * 비디오 상세 정보를 가져옵니다
     * @param {string} videoIds - 콤마로 구분된 비디오 ID들
     * @returns {Promise<Object>} 비디오 상세 정보
     */
    async getVideoDetails(videoIds) {
        try {
            const params = {
                part: 'statistics,contentDetails',
                id: videoIds,
                key: this.apiKey
            };

            const queryString = this.buildQueryString(params);
            const url = `${this.baseUrl}/videos?${queryString}`;

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`비디오 상세 정보 요청 실패: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('비디오 상세 정보 오류:', error);
            throw error;
        }
    }

    /**
     * 검색 결과와 비디오 상세 정보를 병합합니다
     * @param {Array} searchItems - 검색 결과 아이템들
     * @param {Object} videoDetails - 비디오 상세 정보
     * @returns {Array} 병합된 쇼츠 데이터
     */
    mergeVideoData(searchItems, videoDetails) {
        const detailsMap = {};
        
        if (videoDetails.items) {
            videoDetails.items.forEach(video => {
                detailsMap[video.id] = video;
            });
        }

        return searchItems
            .map(item => {
                const videoId = item.id.videoId;
                const details = detailsMap[videoId];
                
                if (!details) {
                    return null; // 상세 정보가 없는 경우 제외
                }

                return {
                    id: videoId,
                    title: item.snippet.title,
                    channelTitle: item.snippet.channelTitle,
                    thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
                    publishedAt: item.snippet.publishedAt,
                    viewCount: parseInt(details.statistics.viewCount) || 0,
                    duration: details.contentDetails.duration,
                    url: `https://www.youtube.com/watch?v=${videoId}`
                };
            })
            .filter(item => item !== null) // null 값 제거
            .sort((a, b) => b.viewCount - a.viewCount); // 조회수 순으로 정렬
    }

    /**
     * HTML 이스케이핑 함수
     * @param {string} text - 이스케이핑할 텍스트
     * @returns {string} 이스케이핑된 텍스트
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 상대 시간 포맷팅 (예: "2시간 전", "1일 전")
     * @param {string} publishedAt - ISO 8601 날짜 문자열
     * @returns {string} 상대 시간 문자열
     */
    formatRelativeTime(publishedAt) {
        const now = new Date();
        const published = new Date(publishedAt);
        const diffMs = now - published;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 60) {
            return `${diffMinutes}분 전`;
        } else if (diffHours < 24) {
            return `${diffHours}시간 전`;
        } else if (diffDays < 7) {
            return `${diffDays}일 전`;
        } else {
            return published.toLocaleDateString('ko-KR');
        }
    }

    /**
     * 조회수를 한국어 형식으로 포맷팅
     * @param {number} viewCount - 조회수
     * @returns {string} 포맷팅된 조회수
     */
    formatViewCount(viewCount) {
        if (viewCount >= 100000000) {
            return `${(viewCount / 100000000).toFixed(1)}억`;
        } else if (viewCount >= 10000) {
            return `${(viewCount / 10000).toFixed(1)}만`;
        } else if (viewCount >= 1000) {
            return `${(viewCount / 1000).toFixed(1)}천`;
        } else {
            return viewCount.toString();
        }
    }
}
