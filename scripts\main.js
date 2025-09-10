/**
 * 메인 애플리케이션 클래스
 * UI 관리 및 사용자 인터랙션을 담당합니다.
 */
class ShortsApp {
    constructor() {
        this.youtubeAPI = new YouTubeAPI();
        this.shortsData = [];
        this.currentRank = 1;
        
        this.init();
    }

    /**
     * 애플리케이션 초기화
     */
    async init() {
        try {
            this.setCurrentDate();
            await this.loadPopularShorts();
        } catch (error) {
            this.showError(error.message);
        }
    }

    /**
     * 현재 날짜를 한국어로 설정
     */
    setCurrentDate() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };
        
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('ko-KR', options);
        }
    }

    /**
     * 인기 쇼츠 데이터를 로드합니다
     */
    async loadPopularShorts() {
        try {
            this.showLoading();
            
            // API 키 유효성 검사
            this.youtubeAPI.validateApiKey();
            
            // 데이터 가져오기
            this.shortsData = await this.youtubeAPI.getPopularShorts();
            
            if (this.shortsData.length === 0) {
                throw new Error('인기 쇼츠를 찾을 수 없습니다.');
            }

            this.hideLoading();
            this.renderShorts();
            
        } catch (error) {
            console.error('쇼츠 로딩 오류:', error);
            this.hideLoading();
            this.showError(this.getErrorMessage(error));
        }
    }

    /**
     * 로딩 상태 표시
     */
    showLoading() {
        const loadingElement = document.getElementById('loading');
        const errorElement = document.getElementById('error');
        const gridElement = document.getElementById('shortsGrid');
        
        if (loadingElement) loadingElement.style.display = 'block';
        if (errorElement) errorElement.style.display = 'none';
        if (gridElement) gridElement.style.display = 'none';
    }

    /**
     * 로딩 상태 숨기기
     */
    hideLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    /**
     * 에러 메시지 표시
     * @param {string} message - 에러 메시지
     */
    showError(message) {
        const errorElement = document.getElementById('error');
        const errorMessageElement = document.getElementById('errorMessage');
        const loadingElement = document.getElementById('loading');
        const gridElement = document.getElementById('shortsGrid');
        
        if (errorElement) errorElement.style.display = 'block';
        if (errorMessageElement) errorMessageElement.textContent = message;
        if (loadingElement) loadingElement.style.display = 'none';
        if (gridElement) gridElement.style.display = 'none';
    }

    /**
     * 에러 메시지를 사용자 친화적으로 변환
     * @param {Error} error - 에러 객체
     * @returns {string} 사용자 친화적인 에러 메시지
     */
    getErrorMessage(error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('api key') || message.includes('key')) {
            return 'YouTube API 키가 올바르지 않습니다. config.js 파일을 확인해주세요.';
        } else if (message.includes('quota') || message.includes('limit')) {
            return 'API 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.';
        } else if (message.includes('network') || message.includes('fetch')) {
            return '네트워크 연결을 확인해주세요.';
        } else if (message.includes('not found') || message.includes('찾을 수 없습니다') || message.includes('불러올 수 없습니다')) {
            return '데이터를 불러올 수 없습니다';
        } else {
            return '데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
    }

    /**
     * 쇼츠 카드들을 렌더링합니다
     */
    renderShorts() {
        const gridElement = document.getElementById('shortsGrid');
        if (!gridElement) return;

        // 기존 내용 초기화
        gridElement.innerHTML = '';
        
        // 쇼츠 카드 생성
        this.shortsData.forEach((shorts, index) => {
            const card = this.createShortsCard(shorts, index + 1);
            gridElement.appendChild(card);
        });

        // 그리드 표시
        gridElement.style.display = 'grid';
    }

    /**
     * 개별 쇼츠 카드를 생성합니다
     * @param {Object} shorts - 쇼츠 데이터
     * @param {number} rank - 순위
     * @returns {HTMLElement} 쇼츠 카드 요소
     */
    createShortsCard(shorts, rank) {
        const card = document.createElement('div');
        card.className = 'shorts-card';
        card.setAttribute('data-rank', rank);

        // 썸네일 이미지 (lazy loading 적용)
        const thumbnail = document.createElement('img');
        thumbnail.className = 'shorts-thumbnail';
        thumbnail.src = shorts.thumbnail;
        thumbnail.alt = this.youtubeAPI.escapeHtml(shorts.title);
        thumbnail.loading = 'lazy';
        
        // 썸네일 로딩 에러 처리
        thumbnail.onerror = () => {
            thumbnail.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDIwMCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSAxNDBIMTE1VjE3MEg4NVYxNDBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMDAgMTU1TDEwMCAxNTUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
        };

        // 순위 배지
        const rankBadge = document.createElement('div');
        rankBadge.className = 'rank-badge';
        rankBadge.textContent = rank;

        // 제목
        const title = document.createElement('h3');
        title.className = 'shorts-title';
        title.textContent = shorts.title;

        // 채널명
        const channel = document.createElement('p');
        channel.className = 'shorts-channel';
        channel.textContent = shorts.channelTitle;

        // 메타 정보 (조회수, 업로드 시간)
        const meta = document.createElement('div');
        meta.className = 'shorts-meta';
        
        const viewCount = document.createElement('span');
        viewCount.className = 'view-count';
        viewCount.textContent = `조회수 ${this.youtubeAPI.formatViewCount(shorts.viewCount)}`;
        
        const uploadTime = document.createElement('span');
        uploadTime.className = 'upload-time';
        uploadTime.textContent = this.youtubeAPI.formatRelativeTime(shorts.publishedAt);
        
        meta.appendChild(viewCount);
        meta.appendChild(uploadTime);

        // 카드 내용 조립
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        cardContent.appendChild(rankBadge);
        cardContent.appendChild(title);
        cardContent.appendChild(channel);
        cardContent.appendChild(meta);

        card.appendChild(thumbnail);
        card.appendChild(cardContent);

        // 클릭 이벤트 (새 탭에서 YouTube 열기)
        card.addEventListener('click', () => {
            window.open(shorts.url, '_blank', 'noopener,noreferrer');
        });

        // 키보드 접근성
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `${rank}위: ${shorts.title} - ${shorts.channelTitle}`);
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.open(shorts.url, '_blank', 'noopener,noreferrer');
            }
        });

        return card;
    }
}

// DOM이 로드된 후 애플리케이션 시작
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ShortsApp();
    } catch (error) {
        console.error('애플리케이션 초기화 오류:', error);
        
        // 초기화 실패 시 에러 표시
        const errorElement = document.getElementById('error');
        const errorMessageElement = document.getElementById('errorMessage');
        
        if (errorElement && errorMessageElement) {
            errorElement.style.display = 'block';
            errorMessageElement.textContent = '애플리케이션을 시작할 수 없습니다. 페이지를 새로고침해주세요.';
        }
    }
});

// 전역 에러 핸들러
window.addEventListener('error', (event) => {
    console.error('전역 에러:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('처리되지 않은 Promise 거부:', event.reason);
});
