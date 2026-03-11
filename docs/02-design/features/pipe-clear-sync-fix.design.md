# 설계서: 파이프 삭제 시 배경색 및 점유율 동기화 버그 수정

## 1. 개요
파이프 초기화 시 발생하는 시각적 잔상(셀 배경색)과 데이터 불일치(점유율 미갱신) 문제를 해결하기 위한 상세 설계입니다.

## 2. 세부 설계 사항

### 2.1 불완전한 경로 자동 정리 (`PathManager.js`)
- **로직**: 드래그가 종료되는 시점(`endPath`)에 현재 경로의 마디 수를 확인합니다.
- **조건**: 만약 `this.currentPath`의 길이가 2 미만(시작점만 있고 연결되지 않음)이라면, 해당 색상의 모든 경로 데이터를 삭제합니다.
- **메서드**: `this.clearPath(this.currentColor)` 호출.

### 2.2 실시간 UI/데이터 동기화 (`MainScene.js`)
- **Pointer Down (터치 시작)**:
    - 점을 터치하여 기존 파이프가 초기화된 직후, `gridManager.draw()`를 호출하여 배경색을 즉시 지웁니다.
    - `updateHUD()`를 호출하여 점유율(Pipe %) 수치를 즉시 갱신합니다.
- **Pointer Up (터치 종료)**:
    - 드래그가 끝나고 불완전한 경로가 정리된 후, `gridManager.draw()`와 `updateHUD()`를 다시 호출하여 최종 상태를 화면에 반영합니다.

## 3. 상세 수정 스펙

| 파일 | 위치 | 수정 내용 |
| :--- | :--- | :--- |
| `src/classes/PathManager.js` | `endPath()` | `if (this.currentPath && this.currentPath.length < 2) this.clearPath(this.currentColor)` 로직 추가. |
| `src/scenes/MainScene.js` | `setupInputs()` | `pointerdown` 콜백 내부에 `draw()` 및 `updateHUD()` 추가. |
| `src/scenes/MainScene.js` | `setupInputs()` | `pointerup` 콜백 내부에 `draw()` 및 `updateHUD()` 추가. |

## 4. 기대 결과
- 사용자가 점을 터치하는 즉시 해당 색상의 모든 시각적 요소(선, 배경색)가 사라지고 통계 수치가 0에 가깝게 줄어듦.
- 점을 터치만 하고 드래그하지 않아도 데이터 오염 없이 깨끗하게 상태가 유지됨.

---
**상태**: 📐 설계 완료 (Design Phase)
**PDCA 액션**: `/pdca design pipe-clear-sync-fix`
