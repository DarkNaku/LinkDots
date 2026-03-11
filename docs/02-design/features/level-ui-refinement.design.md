# 설계서: 레벨 선택 화면 UI 고도화 (Flow Free 스타일)

## 1. UI 컴포넌트 상세 설계

### 1.1 `UIManager.createCircularBackButton()`
- **형태**: 반지름 24px의 원형(Circle) 그래픽.
- **스타일**:
    - 선 색상: 흰색 (`0xFFFFFF`), 두께 2px.
    - 배경: 투명 또는 매우 짙은 회색 (`0x111111`).
- **아이콘**: 텍스트 '<' 대신 Graphics로 그린 화살표.
- **위치**: (40, 50) 좌측 상단 고정.

### 1.2 `UIManager.createStyledGridButton(x, y, text, color)`
- **크기**: 64x64 정사각형.
- **상태별 스타일**:
    - **Unlocked (기본)**:
        - 테두리: `color` (예: 녹색 `0x00FF00`), 두께 2px.
        - 배경: 투명.
        - 텍스트: 흰색, 폰트 크기 28px.
    - **Completed (완료)**:
        - 배경: `color`로 채움.
        - 텍스트: 흰색.
        - 추가: 우측 하단에 작은 'V' 체크 표시 (옵션).
- **인터랙션**: `pointerdown` 시 스케일 0.95로 축소.

### 1.3 `UIManager.createPagination(total, current)`
- **형태**: 지름 8px의 작은 원들.
- **간격**: 20px.
- **위치**: 화면 하단 중앙 (y: 700).
- **스타일**:
    - 활성(Current): 흰색 불투명 (`alpha: 1`).
    - 비활성(Other): 회색 반투명 (`0x888888`, `alpha: 0.5`).

## 2. Layout & Typography

### 2.1 헤더 영역
- **Pack Name (팩 이름)**:
    - 위치: (300, 50) 중앙 상단.
    - 폰트: 32px, Bold, 녹색 계열 (`0x00FF00` - 이미지 참고).
- **Pack Info (상세 정보)**:
    - 위치: (300, 150).
    - 텍스트: "5x5 - 쉬움".
    - 폰트: 36px, White.

### 2.2 그리드 영역
- **시작 위치**: (x: 80, y: 220).
- **간격**: 가로 110px, 세로 110px (여백 확보).
- **배치**: 5열 x 6행 (한 페이지당 30개).

## 3. 구현 로직

### 3.1 `LevelSelectScene.js` 수정
1. `create()` 메서드에서 기존 UI 제거.
2. `UIManager`의 신규 메서드를 호출하여 헤더 및 백 버튼 생성.
3. `packData`에서 테마 색상(없으면 기본 녹색)을 가져와 버튼 생성 시 전달.
4. 레벨 버튼 생성 반복문에서 5x6 그리드 좌표 계산 로직 적용.
5. 하단에 페이지네이션 점 생성.

### 3.2 배경 효과
- `TitleScene`에서 사용한 펄싱 도트 효과를 재사용하거나, `LevelSelectScene` 전용의 정적인 그라데이션 배경 적용.

---
**상태**: 📐 설계 완료 (Design Phase)
**PDCA 액션**: `/pdca design level-ui-refinement`
