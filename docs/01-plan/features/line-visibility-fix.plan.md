# 계획서: 라인 미표시 버그 수정 (Line Visibility Bug Fix)

## 1. 개요
점을 터치하여 드래그해도 화면에 선(Path)이 보이지 않는 현상을 분석하고 수정합니다. 최근 추가된 "경로 곡선 라운딩 처리" 로직에서 Phaser Graphics API의 잘못된 사용이 원인으로 의심됩니다.

## 2. 버그 원인 분석 (가설)
- **잘못된 API 호출**: `PathManager.js`의 `draw()` 메서드에서 `this.graphics.lineStyle`에 객체(`{ width, color, ... }`)를 전달하고 있으나, Phaser 3의 표준 API는 `(width, color, alpha)` 순서의 인자를 받습니다. 이로 인해 선의 두께가 0 또는 정의되지 않은 값으로 설정되어 보이지 않을 가능성이 큽니다.
- **뎁스(Depth) 문제**: UI 요소가 게임 보드보다 위에 그려져 선을 가리고 있을 가능성.
- **좌표 계산 오류**: 9:16 해상도 변경 후 `worldX`, `worldY` 좌표가 화면 밖으로 벗어났을 가능성.

## 3. 해결 전략
- `PathManager.js`의 `lineStyle` 호출 방식을 Phaser 3 표준 방식(`this.graphics.lineStyle(width, color, alpha)`)으로 복구합니다.
- 라운드 캡(Cap) 및 조인(Join) 처리가 필요한 경우, Phaser 3에서 지원하는 다른 방식(예: `setDefaultStyles` 또는 별도의 원형 그리기 조합)을 검토하거나 기본 스타일로 우선 복구하여 가시성을 확보합니다.
- `MainScene`에서 `pathManager.graphics`의 뎁스를 명시적으로 설정하여 UI 아래에 가려지지 않도록 합니다.

## 4. 상세 작업 목록
- [ ] `PathManager.js` 내 `draw()` 메서드의 `lineStyle` 코드를 표준 인자 방식으로 수정.
- [ ] `MainScene.js`의 `create()`에서 `pathManager.graphics.setDepth(1)` 등 뎁스 설정 추가.
- [ ] 브라우저 콘솔의 에러 로그 확인 (API 오호출 시 발생하는 경고 확인).
- [ ] 수정 후 드래그 시 선이 정상적으로 출력되는지 검증.

## 5. 성공 지표
- 점을 터치하고 드래그할 때 해당 색상의 선이 끊김 없이 부드럽게 표시됨.
- 선이 UI 요소(버튼, 텍스트) 뒤에 적절히 배치됨.
- 모든 해상도(9:16)에서 선의 위치가 점의 중심과 일치함.

---
**상태**: 🛠️ 버그 분석 및 계획 수립 완료
**PDCA 액션**: `/pdca plan line-visibility-fix`
