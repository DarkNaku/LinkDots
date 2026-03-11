# 설계서: 패키지 선택 화면 UI 고도화 (Flow Free 스타일)

## 1. UI 컴포넌트 상세 설계

### 1.1 `UIManager.createMultiColorTitle(x, y, parts)`
- **용도**: "레벨"과 같이 글자마다 색상이 다른 타이틀 생성.
- **매개변수**: `parts` - `[{ text: '레', color: '#FF0000' }, { text: '벨', color: '#00FF00' }]` 형태의 배열.
- **구현**: 각 글자의 너비를 계산하여 순차적으로 배치하거나, 고정 간격 적용.

### 1.2 `UIManager.createSectionHeader(y, text, color)`
- **형태**: 화면 전체 너비(600px)를 채우는 가로 바.
- **높이**: 45px.
- **스타일**:
    - 배경색: `color` (예: 녹색 `0x008800`, 빨간색 `0x880000` 등).
    - 텍스트: 흰색, 24px, 좌측 정렬 (여백 20px).
- **위치**: 전달받은 `y` 좌표에 배치.

### 1.3 `UIManager.createPackListItem(y, name, progress, color, callback)`
- **형태**: 투명한 배경의 가로형 리스트 항목.
- **높이**: 60px.
- **구성**:
    - **좌측 텍스트 (이름)**: `name`, 색상 `color`, 28px.
    - **우측 텍스트 (진행률)**: `progress` (예: "0 / 150"), 흰색, 28px.
- **인터랙션**: 전체 영역 클릭 가능, 클릭 시 스케일 0.98 피드백.

## 2. 데이터 구조 확장 (`levels.json`)

패키지를 카테고리별로 분류하기 위해 다음과 같이 속성을 추가합니다.
```json
{
  "packs": [
    {
      "name": "클래식 팩",
      "category": "소개",
      "themeColor": "0x00FF00",
      "levels": [...]
    },
    ...
  ]
}
```

## 3. Layout & Workflow

### 3.1 `PackSelectScene.js` 리팩토링
1. **데이터 그룹화**: `levelsData.packs`를 `category`별로 그룹화합니다.
2. **순차 렌더링**:
    - 카테고리 순서: "소개" -> "마니아" -> "진행" 등.
    - 각 카테고리 시작 시 `createSectionHeader` 호출.
    - 카테고리 내 패키지들을 `createPackListItem`으로 나열.
    - `y` 좌표를 항목 높이에 따라 동적으로 증가시킴.
3. **헤더 구성**:
    - 상단에 원형 뒤로가기 버튼 배치.
    - 중앙에 "레벨" (빨/녹) 멀티 컬러 타이틀 배치.
    - 타이틀 하단에 작은 안내 문구 ("추가 힌트가 필요하신가요? ...") 배치.

### 3.2 시각적 효과
- **배경 글로우**: 각 섹션의 색상에 맞춰 배경에 아주 연한 세로형 그라데이션을 `Graphics`로 추가 (이미지의 몽환적인 분위기 재현).

---
**상태**: 📐 설계 완료 (Design Phase)
**PDCA 액션**: `/pdca design package-ui-refinement`
