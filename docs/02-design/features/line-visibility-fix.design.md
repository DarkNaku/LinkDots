# 설계서: 라인 미표시 버그 수정 (Line Visibility Bug Fix)

## 1. 개요
최근 적용된 경로 라운딩 처리 이후 발생한 "라인 미표시 버그"를 해결하기 위한 기술적 수정 설계입니다.

## 2. 기술적 수정 사항

### 2.1 `PathManager.js` API 호출 방식 변경
- **문제**: 현재 `this.graphics.lineStyle({...})`와 같이 객체를 인자로 전달하고 있으나, 이는 Phaser 3 표준 API와 호환되지 않아 선의 두께가 정상적으로 설정되지 않습니다.
- **수정**: 표준 위치 기반 인자(`width, color, alpha`) 방식으로 변경합니다.
- **라운딩 처리**: `lineStyle` 호출 직후 `setDefaultStyles`를 사용하거나, `strokePath` 전에 전역 그래픽 설정을 조정하는 대신, 가장 안정적인 표준 스타일을 우선 적용합니다.

```javascript
// 수정 예정 코드
const thickness = cells[0].size * 0.45;
this.graphics.lineStyle(thickness, color, 1);
```

### 2.2 뎁스(Depth) 및 시각적 레이어 설정
- **MainScene.js**:
    - `pathManager.graphics`의 뎁스를 `5`로 설정합니다.
    - `gridManager.graphics` (배경 그리드) 뎁스는 `0` (기본값).
    - 점(Dot) 객체들의 뎁스는 별도 설정하지 않거나 `10`으로 설정하여 선이 점 아래로 들어가게 합니다.
    - UI 요소(UIManager 생성물)는 뎁스 `100` 이상을 유지합니다.

## 3. 상세 수정 스펙

| 파일 | 위치 | 수정 내용 |
| :--- | :--- | :--- |
| `src/classes/PathManager.js` | `draw()` 메서드 | `lineStyle` 인자를 `(width, color, alpha)` 순으로 변경. |
| `src/scenes/MainScene.js` | `create()` 메서드 | `this.pathManager.graphics.setDepth(5)` 추가. |

## 4. 검증 시나리오 (QA)
1. 게임 실행 후 첫 번째 점 터치.
2. 드래그 이동 시 정확한 두께와 색상의 선이 실시간으로 그려지는지 확인.
3. 선이 꺾이는 지점에서 그래픽이 깨지지 않는지 확인.
4. 선이 점(Dot)이나 버튼(UI)을 가리지 않는지 확인.

---
**상태**: 📐 설계 완료 (Design Phase)
**PDCA 액션**: `/pdca design line-visibility-fix`
