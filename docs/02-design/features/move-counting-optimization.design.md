# 설계서: 이동 횟수(Moves) 카운팅 로직 최적화

## 1. 개요
단순 터치나 동일 색상의 반복 수정을 제외하고, 실질적인 파이프 그리기 작업이 발생했을 때만 이동 횟수를 증가시키는 로직을 설계합니다.

## 2. 세부 설계

### 2.1 이벤트 시스템 확장 (`PathManager.js`)
- **기존**: `startPath` (터치 시점)에서 `path-started` 이벤트 발생.
- **변경**: 파이프의 마디가 2개가 되는 시점(실제 드래그 발생)에 새로운 이벤트 발생.
- **신규 이벤트**: `path-extended-first`
    - **발생 조건**: `this.currentPath.length === 2`인 순간.
    - **전달 데이터**: `this.currentColor` (현재 작업 중인 색상).

### 2.2 상태 관리 및 카운팅 로직 (`MainScene.js`)
- **상태 변수**: `this.lastMovedColor` (마지막으로 이동 횟수를 소모한 색상).
- **로직 흐름**:
    1. `path-extended-first` 이벤트 수신.
    2. 수신된 색상이 `this.lastMovedColor`와 같은지 확인.
    3. **다르다면**:
        - `this.moves++` 증가.
        - `this.lastMovedColor = currentColor` 업데이트.
        - `uiManager.updateStats()` 호출하여 HUD 갱신.
    4. **같다면**: 무시 (동일 파이프 수정으로 간주).

### 2.3 예외 상황 및 초기화
- **레벨 초기화(Reset)**: `this.moves = 0`, `this.lastMovedColor = null`로 초기화.
- **파이프 끊김**: 다른 파이프를 가로질러 기존 파이프가 끊겨도 `lastMovedColor`는 유지됩니다. 즉, 끊긴 파이프를 다시 그리기 시작할 때 비로소 새로운 이동으로 카운트됩니다.

## 3. 상세 수정 스펙

| 파일 | 위치 | 수정 내용 |
| :--- | :--- | :--- |
| `src/classes/PathManager.js` | `extendPath()` | 길이가 2가 되는 시점에 `path-extended-first` 이벤트 emit. |
| `src/scenes/MainScene.js` | `create()` / `setupEvents()` | 이동 횟수 증가 조건을 `lastMovedColor` 비교 로직으로 변경. |
| `src/scenes/MainScene.js` | `init()` / `create()` | `lastMovedColor` 변수 초기화 로직 추가. |

## 4. 기대 결과
- 점을 터치만 하는 실수로 인한 이동 횟수 낭비 방지.
- 같은 색상의 파이프를 완성하지 못하고 여러 번 시도하더라도, 다른 색상을 만지기 전까지는 1회의 이동으로 보호받는 사용자 친화적 규칙 적용.

---
**상태**: 📐 설계 완료 (Design Phase)
**PDCA 액션**: `/pdca design move-counting-optimization`
