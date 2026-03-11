# 계획서: 메인 화면 UI 고도화 (Flow Free 스타일)

## 1. 개요
제공된 이미지(`main_scene.png`)를 분석하여 현재의 기본적인 타이틀 화면을 상용 게임 수준의 리스트형 메인 메뉴 UI로 고도화합니다.

## 2. 핵심 디자인 요소 (이미지 분석 반영)
- [ ] **메인 로고 (Main Logo)**:
    - "flow" 텍스트 구현. 글자별 색상 적용 (f: 빨강, l: 녹색, o: 파랑, w: 노랑).
    - 폰트 스타일: 둥글고 굵은 Sans-serif 계열.
- [ ] **설정 버튼 (Settings)**:
    - 우측 상단에 톱니바퀴 아이콘 배치.
- [ ] **메인 메뉴 리스트 (Menu List)**:
    - 각 항목은 가로로 긴 형태이며 좌측에 메뉴명, 우측에 아이콘 또는 배지가 배치됨.
    - **무료 플레이 (Free Play)**: 우측에 '>' 화살표.
    - **일일 퍼즐 (Daily Puzzles)**: 우측에 숫자 '6'이 적힌 빨간색 리본/배지.
    - **주간 퍼즐 (Weekly Puzzles)**: 우측에 숫자 '30'이 적힌 파란색 리본/배지.
    - **타임 트라이얼 (Time Trial)**: 우측에 스톱워치 아이콘.
- [ ] **하단 유틸리티 메뉴 (Bottom Buttons)**:
    - 좌측: "광고 제거" (금지 표시 아이콘).
    - 중앙: "스토어" (쇼핑카트 아이콘).
    - 우측: "다른 게임" (플러스 아이콘).
- [ ] **배경 및 장식 (Background & Decor)**:
    - 완전한 검은색 배경.
    - 상단 광고 영역(선택 사항) 및 배경의 은은한 컬러 글로우 효과.

## 3. 기술 스택 및 구현 전략
- **UI 구성**: Phaser 3 `Graphics`, `Text`, `Image` 객체 활용.
- **아이콘**: 간단한 아이콘은 Graphics로 그리거나 무료 에셋/유니코드 활용.
- **레이아웃**: `TitleScene.js` 리팩토링. 항목별 고정 간격(Vertical List) 배치.

## 4. 상세 작업 목록
- [ ] **UIManager 확장**:
    - `createMenuListItem(y, text, rightElement, callback)`: 메인 메뉴 항목 생성 메서드.
    - `createBadge(x, y, text, color)`: 리본 모양의 배지 생성 메서드.
    - `createUtilityButton(x, y, icon, text, callback)`: 하단 작은 버튼 생성 메서드.
- [ ] **TitleScene 리팩토링**:
    - 기존 'START' 버튼을 제거하고 새로운 메뉴 구조 적용.
    - 멀티 컬러 "flow" 로고 배치.
    - 상단 설정 버튼 및 하단 메뉴 배치.
- [ ] **인터랙션**: 메뉴 클릭 시 `PackSelectScene`으로 이동하도록 연결.

## 5. 성공 지표
- `main_scene.png` 이미지와 시각적으로 90% 이상 일치함.
- 메뉴 간 간격이 균일하고 텍스트 가독성이 높음.
- 하단 및 상단 버튼들의 터치 영역이 적절하게 확보됨.

---
**상태**: 🛠️ 계획 수립 완료 (Planning Phase)
**PDCA 액션**: `/pdca plan main-ui-refinement`
