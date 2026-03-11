# 설계서: 파이프 점유율 계산 버그 수정 (Pipe Percentage Calculation Fix)

## 1. 개요
그리드 점유율 계산 시 점(Dot)의 존재 여부를 배제하고, 실제 플레이어가 그린 파이프(Line)의 점유 상태만을 반영하도록 로직을 수정합니다.

## 2. 로직 수정 설계

### 2.1 `GridManager.getFillPercentage()` 수정
- **기존 로직**: `isOccupied || dotColor` 인 경우를 모두 점유된 것으로 카운트.
- **수정 로직**: 오직 `isOccupied`가 `true`인 경우만 점유된 것으로 카운트.
- **이유**: `PathManager`는 파이프가 시작되는 점(Dot) 위치의 `isOccupied`도 `true`로 설정하므로, `isOccupied`만 체크하는 것이 파이프의 실제 점유 상태를 가장 정확하게 나타냅니다.

```javascript
// 수정 예정 코드
getFillPercentage() {
    let occupied = 0;
    const total = this.size * this.size;
    for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
            if (this.cells[y][x].isOccupied) { // dotColor 체크 제거
                occupied++;
            }
        }
    }
    return Math.floor((occupied / total) * 100);
}
```

### 2.2 `GridManager.isAllFilled()` 검토
- 승리 판정을 위한 `isAllFilled()` 메서드도 동일한 철학을 유지해야 합니다.
- 모든 칸의 `isOccupied`가 `true`인지만 확인하도록 단순화하여 무결성을 확보합니다.

## 3. 상세 수정 스펙

| 파일 | 위치 | 수정 내용 |
| :--- | :--- | :--- |
| `src/classes/GridManager.js` | `getFillPercentage()` | `dotColor` 조건 제거, `isOccupied`로만 판정. |
| `src/classes/GridManager.js` | `isAllFilled()` | 모든 셀의 `isOccupied` 여부만 체크하도록 최적화. |

## 4. 검증 계획
1. **초기 상태 확인**: 레벨 진입 직후(파이프 0개) 파이프 점유율이 0%인지 확인.
2. **그리기 도중 확인**: 파이프를 한 칸 그릴 때마다 점유율이 1/N씩 증가하는지 확인.
3. **삭제 시 확인**: 파이프를 지웠을 때 점유율이 다시 감소하고, 모두 지우면 0%가 되는지 확인.
4. **승리 시 확인**: 모든 칸이 채워졌을 때 100%와 함께 승리 팝업이 뜨는지 확인.

---
**상태**: 📐 설계 완료 (Design Phase)
**PDCA 액션**: `/pdca design pipe-percentage-fix`
