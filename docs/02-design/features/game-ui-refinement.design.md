# 설계서: 게임 화면 UI 고도화 (Flow Free 스타일)

## 1. UI 컴포넌트 상세 설계

### 1.1 `UIManager.createGameHeader(level, size)`
- **구성**:
    - **Back Button**: `createCircularBackButton` 재사용.
    - **Level Info**: "레벨 {level}" (Bold, Neon Green), "{size}x{size}" (Normal, White).
    - **Settings**: 우측 상단 톱니바퀴 아이콘 (depth: 100).
- **좌표**:
    - Level Info: (Center X, height * 0.08).
    - Settings: (width - 70, height * 0.08).

### 1.2 `UIManager.createStatsBar()`
- **구성**: 그리드 직상단에 위치하는 3단 정보 바.
- **텍스트 스타일**: 24px, White, 상단 정렬.
- **필드**:
    - **Flow**: "흐름: {connected}/{total}" (Left).
    - **Moves**: "무브: {current} 최고: {best}" (Center).
    - **Pipe**: "파이프: {percentage}%" (Right).
- **좌표**: y = 그리드 상단 경계 - 40px.

### 1.3 `UIManager.createGameControls(callbacks)`
- **구성**: 화면 하단에 배치되는 원형 버튼들.
- **항목**:
    - **Undo**: 좌측 (width * 0.15), 회전 화살표 아이콘.
    - **Hint**: 중앙 (Center X), 전구 아이콘 + 남은 수 뱃지.
    - **Reset**: 우측 (width * 0.85), 초기화 아이콘.
- **스타일**: 지름 60px 원형 테두리 또는 아이콘 단독.

## 2. 그리드 및 경로 렌더링 고도화

### 2.1 `GridManager.draw()` 수정
- **레이어 분리**:
    1. **Cell Background Layer**: 경로 색상의 0.2 alpha 버전으로 셀 내부 채움.
    2. **Grid Line Layer**: 셀 경계선 (0x333333, alpha 0.5).
- **구현**: `cells` 배열을 순회하며 `pathColor`가 존재하면 해당 위치에 `fillRect` 수행.

### 2.2 실시간 업데이트 로직
- `PathManager`에서 경로가 변경될 때마다 `MainScene`이 이를 감지하여 `gridManager.draw()`와 `uiManager.updateHUD()`를 동시 호출.

## 3. Layout & Typography 스펙

- **Neon Green**: `#00FF00` (Title 강조색)
- **HUD Margin**: 상단 5%, 하단 10% 확보.
- **Grid Offset**: 통계 바와 하단 컨트롤러 사이의 중앙 영역에 자동 배치.

## 4. 인터랙션 및 기능 매핑

- **Undo**: `pathManager`에 최근 경로 변경 이력을 스택으로 관리하여 이전 상태 복구. (초기 단계에선 UI만 배치)
- **Hint**: 현재 보드 상태를 분석하여 다음 최적의 마디 표시. (초기 단계에선 UI만 배치)
- **Reset**: `scene.restart()` 또는 `pathManager.reset()` 호출.

---
**상태**: 📐 설계 완료 (Design Phase)
**PDCA 액션**: `/pdca design game-ui-refinement`
