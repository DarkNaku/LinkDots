# 계획서: 게임 흐름 시스템 (Scene Progression)

## 1. 개요
단일 게임 화면에서 벗어나 메인 타이틀, 패키지 선택, 레벨 선택, 실제 게임 화면으로 이어지는 표준적인 게임 흐름을 구축합니다.

## 2. 핵심 기능
- [ ] **메인 화면 (TitleScene)**:
    - 게임 로고 및 애니메이션 타이틀.
    - 'START' 버튼 (패키지 선택으로 이동).
    - 'OPTIONS' 버튼 (사운드 등 설정, 향후 확장).
- [ ] **패키지 선택 화면 (PackSelectScene)**:
    - `levels.json`의 `packs` 데이터를 읽어와 목록 표시.
    - 각 패키지의 이름 및 난이도(그리드 크기) 표시.
- [ ] **레벨 선택 화면 (LevelSelectScene)**:
    - 선택된 패키지 내의 레벨들을 그리드 형태로 표시 (예: 1~30).
    - 클리어 여부 표시 (향후 로컬 스토리지 연동).
- [ ] **네비게이션 시스템**:
    - 모든 화면에 'Back' 버튼 추가.
    - Scene 간 데이터 전달 (packIndex, levelIndex).

## 3. 기술 스택
- **프레임워크**: Phaser 3 Scenes
- **데이터 관리**: `levels.json` (기존 구조 활용)
- **UI 구성**: `UIManager.js` 확장 및 각 Scene별 전용 UI 배치

## 4. 상세 작업 목록
- [ ] **Scene 클래스 생성**: `TitleScene.js`, `PackSelectScene.js`, `LevelSelectScene.js`.
- [ ] **main.js 수정**: 새로운 Scene들을 Phaser Config에 등록.
- [ ] **TitleScene 구현**: 배경음악(준비) 및 시작 버튼 배치.
- [ ] **PackSelectScene 구현**: 동적 버튼 생성 및 패키지 데이터 연결.
- [ ] **LevelSelectScene 구현**: 레벨 번호 그리드 레이아웃 및 클릭 이벤트 처리.
- [ ] **MainScene 수정**: 클리어 후 레벨 선택 화면으로 돌아오거나 다음 레벨로 가는 로직 정교화.

## 5. 성공 지표
- 사용자가 앱 시작부터 게임 플레이까지 막힘없이 이동할 수 있음.
- 각 단계에서 이전 화면으로 되돌아가는 기능이 정상 작동함.
- 선택한 패키지와 레벨이 실제 게임 화면에 정확히 로드됨.

---
**상태**: 🛠️ 계획 수립 완료 (Planning Phase)
**PDCA 액션**: `/pdca plan scene-progression`
