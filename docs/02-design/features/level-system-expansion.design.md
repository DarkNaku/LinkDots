# 설계서: 레벨 시스템 확장 (LinkDots)

## 1. 데이터 구조 설계 (JSON Schema)

### 1.1 `levels.json` 구조
모든 레벨 데이터를 하나의 JSON 파일에 배열 형태로 저장합니다. 향후 레벨 팩(Pack) 단위로 분리할 수 있도록 설계합니다.

```json
{
  "packs": [
    {
      "name": "5x5 Basic",
      "levels": [
        {
          "id": 1,
          "size": 5,
          "dots": [
            { "color": "0xFF0000", "positions": [[0, 0], [4, 4]] },
            { "color": "0x00FF00", "positions": [[0, 4], [4, 0]] },
            { "color": "0x0000FF", "positions": [[1, 1], [3, 3]] },
            { "color": "0xFFFF00", "positions": [[1, 3], [3, 1]] },
            { "color": "0xFF00FF", "positions": [[2, 0], [2, 4]] }
          ]
        },
        {
          "id": 2,
          "size": 5,
          "dots": [ ... ]
        }
      ]
    }
  ]
}
```

## 2. 클래스 및 로직 설계

### 2.1 `MainScene` 확장
- `preload()`: `this.load.json('levels', 'assets/levels/levels.json');` 추가.
- `init(data)`: 다른 씬이나 메서드로부터 `levelId`를 전달받아 현재 레벨 설정.
- `create()`: `this.cache.json.get('levels')`를 통해 데이터를 읽어와 현재 레벨에 맞는 그리드 생성.

### 2.2 레벨 전환 로직
1. `checkWinCondition()`에서 승리 판정 시 `showWinMessage()` 호출.
2. `showWinMessage()` 내부에 'NEXT LEVEL' 버튼(Phaser Text) 생성.
3. 버튼 클릭 시:
    - 현재 레벨 인덱스 증가.
    - 다음 레벨 데이터가 존재하면 `this.scene.restart({ levelId: nextId })` 호출.
    - 마지막 레벨이면 "All Levels Completed!" 메시지 표시 후 메인으로 이동.

## 3. UI/UX 설계

### 3.1 승리 팝업 (Win Overlay)
- 배경: 반투명 검은색 사각형.
- 텍스트: "PERFECT!", "Level Complete".
- 버튼: "NEXT LEVEL" (Interactive Text).

### 3.2 HUD 업데이트
- 상단 중앙: `Level {PackName} - {LevelId}` 형식으로 표시.

## 4. 상세 구현 흐름
1. `assets/levels/` 디렉토리 생성 및 `levels.json` 작성.
2. `MainScene.js`의 `create()` 로직을 `levelId` 기반으로 동적 초기화되도록 수정.
3. `checkWinCondition` -> `showWinMessage` -> `Next Level` 버튼 로직 순차 구현.
4. 레벨 전환 시 `this.pathManager.reset()` 및 `this.gridManager.resetOccupancy()` 등의 정리 작업 확인 (Scene Restart 시 자동 처리됨).

---
**상태**: 📐 설계 완료 (Design Phase)
**PDCA 액션**: `/pdca design level-system-expansion`
