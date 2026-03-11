# 설계서: 경로 곡선 라운딩 처리 (Smooth Path Rendering) - 하이브리드 방식

## 1. 렌더링 전략 개요 (Hybrid Rendering)
Phaser 3 Graphics의 기본 선 그리기와 원형 채우기 기능을 결합하여 완벽한 곡선을 구현합니다.

### 1.1 하이브리드 구조
- **Joints (마디)**: 경로에 포함된 모든 셀의 중심 좌표(`worldX, worldY`)에 채워진 원(`fillCircle`)을 그립니다.
- **Segments (구간)**: 인접한 두 마디 사이를 두꺼운 직선(`lineTo`)으로 연결합니다.
- **결과**: 직선의 끝부분과 원이 겹치면서 90도 꺾임 지점이 자연스럽게 바깥쪽으로 부드러워지며, 전체적으로 매끄러운 파이프 형태가 됩니다.

## 2. 세부 스펙

### 2.1 크기 및 색상
- **두께 (Thickness)**: `cells[0].size * 0.45`
- **원 지름 (Circle Diameter)**: 선의 두께와 동일하게 설정하여 이질감을 제거합니다.
- **색상**: 각 경로의 고유 색상(`color`)과 불투명도(`alpha: 1`) 적용.

### 2.2 `PathManager.draw()` 메서드 재설계
```javascript
// 의사 코드 로직
this.graphics.clear();
this.paths.forEach((cells, color) => {
    const thickness = cells[0].size * 0.45;
    const radius = thickness / 2;

    // 1. 모든 마디에 원 그리기
    this.graphics.fillStyle(color, 1);
    cells.forEach(cell => {
        this.graphics.fillCircle(cell.worldX, cell.worldY, radius);
    });

    // 2. 마디 사이를 직선으로 연결
    this.graphics.lineStyle(thickness, color, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(cells[0].worldX, cells[0].worldY);
    for (let i = 1; i < cells.length; i++) {
        this.graphics.lineTo(cells[i].worldX, cells[i].worldY);
    }
    this.graphics.strokePath();
});
```

## 3. 성능 및 시각적 예외 처리
- **렌더링 순서**: 원을 먼저 그리고 선을 나중에 그리거나, 반대로 하여 경계면의 안티앨리어싱(Anti-aliasing) 이슈를 최소화합니다. (테스트 후 결정)
- **최적화**: 경로가 2개 미만의 마디를 가질 경우 렌더링을 생략합니다.

---
**상태**: 📐 설계 수정 완료 (Design Phase)
**PDCA 액션**: `/pdca design smooth-path-rendering`
