# 설계서: 화면 비율 최적화 (9:16 Aspect Ratio)

## 1. 게임 엔진 및 전역 설정

### 1.1 Phaser Config 수정
- **기존 해상도**: 600 x 800 (3:4)
- **변경 해상도**: 720 x 1280 (9:16)
- **위치**: `src/main.js`

## 2. 동적 UI 시스템 설계 (`UIManager.js`)

하드코딩된 좌표값을 지양하고 화면 크기에 비례한 동적 좌표 시스템을 구축합니다.

### 2.1 공통 수식
- **Center X**: `this.width / 2`
- **Center Y**: `this.height / 2`
- **Bottom Margin**: `this.height - 100`

### 2.2 UIManager 메서드 수정
- `createTitle`: y 좌표를 `this.height * 0.08`로 조정.
- `createSubTitle`: y 좌표를 인자로 받거나 `this.height * 0.15`로 기본값 설정.
- `createMenuListItem`: x 시작 위치를 80에서 `this.width * 0.1`로 변경.
- `createPagination`: y 위치를 740에서 `this.height * 0.9`로 변경.

## 3. Scene별 레이아웃 재설계

### 3.1 TitleScene (메인 메뉴)
- **로고 ("flow")**: y: 220 -> 320 (상단 여백 확보).
- **메뉴 리스트**: 시작 y: 420 -> 580, 간격: 100px.
- **하단 버튼**: y: height - 80 -> height - 120.

### 3.2 PackSelectScene (패키지 리스트)
- **섹션 헤더**: 높이 45px 유지, 전체 너비 720px로 확장.
- **리스트 시작**: y: 220 -> 280.

### 3.3 LevelSelectScene (레벨 그리드)
- **그리드 시작**: y: 260 -> 350.
- **그리드 간격**: 가로 110px, 세로 110px 유지 (화면 너비 720px에 여유롭게 배치 가능).

### 3.4 MainScene (게임 플레이)
- **그리드 크기 (`gridSize`)**: 400 -> 550 (화면 너비 720px 기준 좌우 여백 각 85px).
- **그리드 위치**: 화면 중앙 배치를 위한 `offsetY` 계산식 정교화.
- **HUD**: 상단 여백 확대 (`height * 0.05` 지점).

## 4. 시각적 자산 및 효과 조정
- **TitleScene 배경**: `Phaser.Math.Between(0, 720)`, `Phaser.Math.Between(0, 1280)`으로 생성 범위 확장.
- **Win Overlay**: 화면 전체를 덮는 `rectangle` 크기를 720x1280으로 자동 확장.

---
**상태**: 📐 설계 완료 (Design Phase)
**PDCA 액션**: `/pdca design aspect-ratio-9-16`
