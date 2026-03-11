# 설계서: LinkDots (Flow Free 클론)

## 1. 시스템 아키텍처
본 게임은 Phaser 3 프레임워크를 사용하여 개발됩니다. 단일 Scene(`MainScene`) 구조로 시작하며, 필요 시 레벨 선택 Scene을 추가합니다.

### 1.1 Phaser 설정
- **타입**: Phaser.AUTO
- **크기**: 600x800 (세로형 모바일 레이아웃 최적화)
- **배경색**: #000000 (검은색)
- **부모 컨테이너**: `game-container`

## 2. 데이터 구조 설계

### 2.1 레벨 데이터 (Level Data)
각 레벨은 다음과 같은 JSON 구조로 정의됩니다.
```json
{
  "level": 1,
  "size": 5,
  "dots": [
    { "color": "0xFF0000", "positions": [[0,0], [4,4]] },
    { "color": "0x00FF00", "positions": [[0,4], [4,0]] },
    ...
  ]
}
```

### 2.2 그리드 상태 (Grid State)
- `Grid` 클래스는 `Cell` 객체의 2차원 배열을 관리합니다.
- `Cell` 속성:
    - `x, y`: 그리드 좌표.
    - `worldX, worldY`: 실제 렌더링 좌표.
    - `dotColor`: 해당 칸에 점이 있는 경우 색상 (null 가능).
    - `pathColor`: 해당 칸을 지나는 선의 색상 (null 가능).
    - `isOccupied`: 선이 점유하고 있는지 여부.

## 3. 클래스 설계

### 3.1 `MainScene` (Phaser.Scene)
- `preload()`: 필요한 에셋 로드.
- `create()`: 그리드 생성, 레벨 데이터 배치, 입력 이벤트 리스너 등록.
- `update()`: (필요 시) 실시간 UI 업데이트.

### 3.2 `GridManager`
- 그리드 초기화 및 렌더링.
- 특정 좌표의 `Cell` 반환.
- 모든 셀이 채워졌는지 확인 (`isAllFilled()`).

### 3.3 `PathManager`
- 사용자의 드래그 입력을 받아 경로 생성 및 관리.
- `currentPath`: 현재 드래그 중인 경로 데이터.
- `pathsByColor`: 색상별로 완성되거나 진행 중인 경로 저장.
- **주요 메서드**:
    - `startPath(cell)`: 드래그 시작 시 호출.
    - `extendPath(cell)`: 드래그 중 새로운 셀 진입 시 호출.
    - `validatePath(cell)`: 교차 여부 확인 및 기존 경로 끊기 로직 처리.

## 4. 핵심 로직 및 알고리즘

### 4.1 경로 그리기 (Path Drawing)
1. 사용자가 특정 색상의 점 위에서 클릭/터치 시작.
2. 드래그 이동 시 인접한 셀(상하좌우)로만 이동 허용.
3. 새로운 셀로 이동 시:
    - 이미 다른 색상의 선이 있다면? 해당 선을 끊음(초기화).
    - 같은 색상의 선이 이미 있다면? 해당 지점까지 경로를 되돌림(Backtrack).
    - 다른 색상의 점이 있다면? 진입 금지.
4. 목표 점(동일 색상)에 도달하면 경로 완성.

### 4.2 승리 판정 (Win Condition)
1. 모든 색상의 점 쌍이 연결됨.
2. 그리드의 모든 `Cell.isOccupied`가 `true`임.
3. 위 두 조건 충족 시 승리 알림 표시.

## 5. UI 및 시각적 요소
- **선(Pipe)**: `Graphics` 객체를 사용하여 부드러운 선 표현.
- **점(Dot)**: `Circle` 프리미티브 사용.
- **HUD**: 화면 상단에 현재 레벨 및 이동 횟수 표시.
- **Reset**: 화면 하단에 현재 레벨 초기화 버튼 배치.

---
**상태**: 📐 설계 완료 (Design Phase)
**PDCA 액션**: `/pdca design link-dots`
