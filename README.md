# 🔥 오늘의 한국 인기 쇼츠 TOP 10

YouTube Data API v3를 활용하여 한국에서 오늘 가장 인기 있는 쇼츠 영상 10개를 실시간으로 가져와 순위별로 표시하는 반응형 웹 애플리케이션입니다.

## ✨ 주요 기능

- **실시간 데이터**: YouTube Data API v3를 통한 실시간 인기 쇼츠 데이터
- **반응형 디자인**: 모바일(1열), 태블릿(2열), 데스크톱(3열) 지원
- **아름다운 UI**: 보라색 그라데이션 배경과 호버 애니메이션
- **사용자 경험**: 로딩 스피너, 에러 처리, 이미지 lazy loading
- **접근성**: 키보드 네비게이션, 스크린 리더 지원
- **클릭 액션**: 카드 클릭 시 YouTube 새 탭에서 열기

## 🎯 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **API**: YouTube Data API v3
- **아키텍처**: 클래스 기반 모듈화 구조
- **스타일링**: CSS Grid, Flexbox, CSS 변수
- **폰트**: Google Fonts (Noto Sans KR)

## 📁 프로젝트 구조

```
CURSOR-YOUTUBE/
├── index.html              # 메인 HTML 파일
├── styles/
│   └── main.css           # 메인 스타일시트
├── scripts/
│   ├── config.js          # API 설정 및 환경 변수
│   ├── api.js             # YouTube API 클래스
│   └── main.js            # 메인 애플리케이션 클래스
└── README.md              # 프로젝트 문서
```

## 🚀 설치 및 실행

### 1. 프로젝트 클론 또는 다운로드

```bash
git clone <repository-url>
cd CURSOR-YOUTUBE
```

### 2. YouTube Data API v3 설정

#### Google Cloud Console에서 API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** > **라이브러리**로 이동
4. "YouTube Data API v3" 검색 후 **사용 설정**
5. **API 및 서비스** > **사용자 인증 정보**로 이동
6. **사용자 인증 정보 만들기** > **API 키** 선택
7. 생성된 API 키를 복사

#### API 키 설정

`scripts/config.js` 파일을 열고 API 키를 설정하세요:

```javascript
const CONFIG = {
    API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE', // 여기에 발급받은 API 키 입력
    // ... 기타 설정
};
```

### 3. 로컬 서버 실행

#### 방법 1: Python (권장)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### 방법 2: Node.js

```bash
# http-server 설치 (전역)
npm install -g http-server

# 서버 실행
http-server -p 8000
```

#### 방법 3: Live Server (VS Code 확장)

VS Code에서 Live Server 확장을 설치하고 `index.html`을 우클릭하여 "Open with Live Server" 선택

### 4. 브라우저에서 확인

브라우저에서 `http://localhost:8000`으로 접속하여 애플리케이션을 확인하세요.

## 🌐 배포 방법

### Netlify 배포

1. [Netlify](https://www.netlify.com/)에 가입/로그인
2. **Sites** > **Add new site** > **Deploy manually**
3. 프로젝트 폴더를 드래그 앤 드롭
4. 배포 완료 후 도메인 확인

### Vercel 배포

1. [Vercel](https://vercel.com/)에 가입/로그인
2. **New Project** 클릭
3. GitHub 저장소 연결 또는 폴더 업로드
4. **Deploy** 클릭

### GitHub Pages 배포

1. GitHub에 저장소 생성
2. 프로젝트 파일 업로드
3. **Settings** > **Pages**로 이동
4. **Source**를 "Deploy from a branch"로 설정
5. **main** 브랜치 선택 후 **Save**

## ⚙️ API 설정 상세

### 검색 파라미터

```javascript
SEARCH_PARAMS: {
    part: 'snippet',           // 기본 정보
    type: 'video',             // 비디오만 검색
    regionCode: 'KR',          // 한국 지역
    videoDuration: 'short',    // 쇼츠 영상만
    order: 'viewCount',        // 조회수 순 정렬
    maxResults: 10,            // 상위 10개
    publishedAfter: '',        // 오늘 시작 시간
    publishedBefore: ''        // 오늘 종료 시간
}
```

### API 사용량 제한

- YouTube Data API v3는 일일 할당량이 있습니다
- 기본 할당량: 10,000 단위/일
- 검색 요청: 100 단위
- 비디오 상세 정보: 1 단위

## 🎨 커스터마이징

### 색상 테마 변경

`styles/main.css`에서 CSS 변수를 수정하여 색상을 변경할 수 있습니다:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --card-background: white;
    --text-color: #333;
}
```

### 그리드 레이아웃 조정

```css
/* 모바일: 1열, 태블릿: 2열, 데스크톱: 3열 */
.shorts-grid {
    grid-template-columns: 1fr;                    /* 모바일 */
}

@media (min-width: 768px) {
    .shorts-grid {
        grid-template-columns: repeat(2, 1fr);     /* 태블릿 */
    }
}

@media (min-width: 1024px) {
    .shorts-grid {
        grid-template-columns: repeat(3, 1fr);     /* 데스크톱 */
    }
}
```

## 🐛 문제 해결

### 일반적인 오류

1. **"API 키가 설정되지 않았습니다"**
   - `config.js`에서 API_KEY가 올바르게 설정되었는지 확인
   - API 키에 따옴표가 제대로 있는지 확인

2. **"API 사용량이 초과되었습니다"**
   - Google Cloud Console에서 할당량 확인
   - 다음 날까지 대기하거나 할당량 증가 요청

3. **"네트워크 연결을 확인해주세요"**
   - 인터넷 연결 상태 확인
   - 방화벽이나 프록시 설정 확인

4. **"오늘 업로드된 인기 쇼츠를 찾을 수 없습니다"**
   - 오늘이 한국 시간 기준인지 확인
   - API 키의 지역 설정 확인

### 개발자 도구 활용

브라우저의 개발자 도구(F12)를 열어 Console 탭에서 자세한 오류 메시지를 확인할 수 있습니다.

## 📱 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해주세요.

---

**주의사항**: 이 애플리케이션은 YouTube Data API v3를 사용합니다. API 사용량 제한과 서비스 약관을 준수해주세요.
