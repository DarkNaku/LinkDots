# 설계서: 터치 하이라이트 효과 추가 (Touch Highlight Effect)

## 1. 개요
플레이어의 터치 입력을 시각적으로 강조하기 위해, 드래그 중인 포인터 위치에 반투명한 하이라이트 원을 표시하는 기능을 설계합니다.

## 2. 상세 설계

### 2.1 하이라이트 객체 사양
- **타입**: `Phaser.GameObjects.Arc` (Circle)
- **크기**: `cellSize * 0.8` (그리드 셀 크기의 약 80%를 지름으로 설정)
- **투명도**: `0.35` (반투명)
- **뎁스(Depth)**: `15` (그리드: 0, 파이프: 5, 점: 10보다 상위에 위치)
- **색상**: `pathManager.currentColor`를 동적으로 할당.

### 2.2 입력 상태별 동작 흐름 (`MainScene.js`)

#### A. Pointer Down (터치 시작)
1. 사용자가 점을 터치하여 경로 그기가 가능해지면:
2. `highlightCircle.setVisible(true)` 호출.
3. `highlightCircle.setFillStyle(currentColor, 0.35)`로 색상 동적 변경.
4. `highlightCircle.setPosition(pointer.x, pointer.y)` 초기 위치 설정.

#### B. Pointer Move (드래그 중)
1. 터치가 유지된 상태에서 포인터가 이동할 때:
2. `highlightCircle.setPosition(pointer.x, pointer.y)`를 호출하여 실시간으로 위치 추적.

#### C. Pointer Up (터치 종료)
1. 사용자가 손을 떼면:
2. `highlightCircle.setVisible(false)`를 호출하여 화면에서 즉시 제거.

## 3. 구현 방식 설계

### 3.1 객체 생성 (`MainScene.create`)
```javascript
this.touchHighlight = this.add.circle(0, 0, this.gridManager.cellSize * 0.4, 0xffffff, 0.35);
this.touchHighlight.setVisible(false);
this.touchHighlight.setDepth(15);
```

### 3.2 이벤트 핸들러 업데이트 (`MainScene.setupInputs`)
- `pointerdown`: `this.touchHighlight.setFillStyle(this.pathManager.currentColor, 0.35); this.touchHighlight.setVisible(true);`
- `pointermove`: `if (pointer.isDown) this.touchHighlight.setPosition(pointer.x, pointer.y);`
- `pointerup`: `this.touchHighlight.setVisible(false);`

## 4. 예외 처리 및 고려 사항
- **색상 없음**: 점이 없는 빈 공간을 터치했을 때는 하이라이트가 나타나지 않도록 `pathManager.currentColor` 유무를 체크합니다.
- **성능**: 매 프레임 업데이트 대신 `pointermove` 이벤트 발생 시에만 좌표를 갱신하여 최적화합니다.

---
**상태**: 📐 설계 완료 (Design Phase)
**PDCA 액션**: `/pdca design touch-highlight`
