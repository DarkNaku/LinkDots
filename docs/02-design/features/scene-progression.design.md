# 설계서: 게임 흐름 시스템 (Scene Progression)

## 1. Scene 구조 및 전환 설계

### 1.1 전체 흐름도
`TitleScene` (시작) ➔ `PackSelectScene` (패키지 선택) ➔ `LevelSelectScene` (레벨 선택) ➔ `MainScene` (게임 플레이)

### 1.2 Scene 간 데이터 전달 (Data Passing)
- `PackSelectScene` ➔ `LevelSelectScene`: `{ packIndex: number }`
- `LevelSelectScene` ➔ `MainScene`: `{ packIndex: number, levelIndex: number }`
- `MainScene` ➔ `LevelSelectScene`: `{ packIndex: number }` (Back 또는 레벨 클리어 후 이동 시)

## 2. 각 Scene 상세 설계

### 2.1 TitleScene (메인 타이틀)
- **구성**: 게임 로고(텍스트), 'START' 버튼, 배경 애니메이션(부유하는 점들).
- **이벤트**: 'START' 클릭 시 `PackSelectScene`으로 전환.

### 2.2 PackSelectScene (패키지 선택)
- **구성**: 타이틀("SELECT PACK"), 패키지 리스트 버튼들.
- **동적 로드**: `levels.json`의 `packs` 배열을 순회하며 버튼 생성. 각 버튼에는 패키지 이름과 그리드 크기(예: 5x5) 표시.
- **이벤트**: 패키지 버튼 클릭 시 해당 `packIndex`를 가지고 `LevelSelectScene`으로 전환. 'BACK' 클릭 시 `TitleScene`으로 이동.

### 2.3 LevelSelectScene (레벨 선택)
- **구성**: 타이틀("SELECT LEVEL"), 레벨 번호 그리드(5열 구성).
- **동적 로드**: 선택된 패키지의 `levels` 배열 길이에 따라 1부터 N까지 번호가 적힌 버튼 생성.
- **이벤트**: 레벨 번호 클릭 시 `packIndex`와 `levelIndex`를 가지고 `MainScene`으로 전환. 'BACK' 클릭 시 `PackSelectScene`으로 이동.

### 2.4 MainScene (게임 화면 수정)
- **추가 사항**: 
    - HUD에 'BACK'(레벨 선택으로 이동) 버튼 추가.
    - 레벨 클리어 후 나타나는 'NEXT LEVEL' 버튼 클릭 시, 현재 팩의 마지막 레벨인 경우 자동으로 `LevelSelectScene`으로 유도하는 로직 보완.

## 3. UI/UX 디자인 가이드

### 3.1 공통 요소
- **Back 버튼**: 모든 선택 화면 상단 좌측에 일관된 스타일의 'BACK' 버튼 배치.
- **배경**: 모든 Scene에 공통적으로 짙은 남색(`#040218`) 배경 유지.
- **애니메이션**: Scene 전환 시 페이드 효과(`cameras.main.fadeIn/fadeOut`) 적용.

### 3.2 UIManager 확장
- `createTitle(text)`: Scene별 메인 타이틀 생성.
- `createBackButton(callback)`: 공통 뒤로가기 버튼 생성.
- `createGridButton(x, y, text, callback)`: 레벨 선택용 작은 정사각형 버튼 생성.

## 4. 상세 구현 로직
1. `levels.json`을 `MainScene`뿐만 아니라 모든 선택 Scene에서 접근할 수 있도록 `preload`에서 전역 캐싱 확인.
2. `MainScene`에서 게임 클리어 여부에 따른 상태 관리를 강화하여 UI 오버레이와 입력 처리가 충돌하지 않도록 보장.

---
**상태**: 📐 설계 완료 (Design Phase)
**PDCA 액션**: `/pdca design scene-progression`
