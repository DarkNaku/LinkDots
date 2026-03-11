# 계획서: 파이프 삭제 시 배경색 및 점유율 동기화 버그 수정

## 1. 개요
파이프의 시작점을 터치하여 기존 경로를 초기화했을 때, 셀 배경색과 파이프 점유율(%) 데이터가 즉시 갱신되지 않고 잔상이 남는 문제를 해결합니다.

## 2. 버그 원인 분석
- **UI 갱신 누락**: `MainScene.js`의 `pointerdown` 이벤트 핸들러에서 `pathManager.startPath()` 호출 후 `gridManager.draw()`와 `updateHUD()`를 호출하지 않아, 드래그를 시작하기 전까지 이전 배경색이 유지됨.
- **길이 1 경로의 잔존**: 사용자가 점을 터치만 하고 떼었을 때, `PathManager`에는 길이가 1인 경로가 저장되어 있어 해당 셀이 계속 `isOccupied = true` 상태로 남음.

## 3. 해결 전략
- **이벤트 핸들러 보완**: `MainScene`의 `pointerdown` 및 `pointerup` 시점에도 그리드 재그리기와 HUD 업데이트를 명시적으로 수행합니다.
- **경로 자동 정리**: `PathManager.endPath()` 메서드에서 경로의 길이가 2 미만(연결되지 않은 단일 점)인 경우, 해당 색상의 경로를 완전히 삭제(`clearPath`)하도록 로직을 강화합니다.
- **점(Dot) 배경색 처리**: 점 위치는 파이프가 연결되었을 때만 배경색이 칠해지도록 `isOccupied` 관리를 철저히 합니다.

## 4. 상세 작업 목록
- [ ] `src/scenes/MainScene.js`: `pointerdown` 이벤트 핸들러에 `gridManager.draw()` 및 `updateHUD()` 호출 추가.
- [ ] `src/classes/PathManager.js`: `endPath()` 메서드에 길이가 1인 경로를 감지하여 삭제하는 로직 추가.
- [ ] `src/scenes/MainScene.js`: `pointerup` 이벤트 핸들러에 `gridManager.draw()` 호출 추가.
- [ ] 수정 후 점 터치 시 즉시 배경색이 사라지고 점유율이 줄어드는지 확인.

## 5. 성공 지표
- 점을 터치하는 순간 기존 파이프와 배경색이 즉시 사라짐.
- 파이프가 사라진 만큼 파이프 % 수치가 실시간으로 감소함.
- 연결되지 않은 점(Dot) 주위에는 배경색이 남지 않음.

---
**상태**: 🛠️ 버그 분석 및 계획 수립 완료
**PDCA 액션**: `/pdca plan pipe-clear-sync-fix`
