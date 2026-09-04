# Wanted Montage design system (local capture)

원티드 공개 디자인 시스템 [Montage](https://montage.wanted.co.kr/)를 2026-09-01 기준으로 수집한 카탈로그다.
UI를 만들거나 고치기 전에 이 문서를 먼저 읽고, 색·간격·타이포·그림자는 반드시 `wds-tokens.css`의 CSS 변수로 참조한다. 값을 하드코딩하지 않는다.

- 원본 저장소: `/Volumes/T9/02_Source/wanted-design` (스킬 `/wanted-design`으로 동기화)
- 토큰 파일: `data/curated/tokens.css` → 프로젝트에는 `wds-tokens.css`로 복사됨
- 라이선스: Montage는 MIT. 원티드 로고·워드마크·브랜드 자산은 별도 가이드라인, 재사용 금지. 원티드로 오인되게 쓰지 않는다.

## 1. 원칙

- Extensibility: 컴포넌트 확장성을 유지하는 구조
- Consistency: 일관된 사용자 경험
- Efficiency: 일관된 품질로 제품 개발 효율 향상

## 2. 타이포그래피

기본 글꼴은 Pretendard JP (한·영·일 지원). 브랜드 표기용으로 Wanted Sans 변수도 정의돼 있다.

```css
@import url("https://static.wanted.co.kr/fonts/pretendard/pretendard-jp/pretendardvariable-jp-dynamic-subset.min.css");
@import url("https://static.wanted.co.kr/fonts/wantedsans/WantedSansVariable.min.css");

body { font-family: "Pretendard JP Variable", Pretendard, var(--font-family-wanted-sans); }
```

| Style | Size | Line height | Letter spacing | 용도 |
| --- | --- | --- | --- | --- |
| Display 1 | 56px | 72px | -0.0319em | 히어로 |
| Display 2 | 40px | 52px | -0.0282em | 랜딩 헤드라인 |
| Display 3 | 36px | 48px | -0.027em | |
| Title 1 | 32px | 44px | -0.0253em | 페이지 제목 |
| Title 2 | 28px | 38px | -0.0236em | |
| Title 3 | 24px | 32px | -0.023em | 섹션 제목 |
| Heading 1 | 22px | 30px | -0.0194em | 카드·다이얼로그 제목 |
| Heading 2 | 20px | 28px | -0.012em | |
| Headline 1 | 18px | 26px | -0.002em | 리스트 제목 |
| Headline 2 | 17px | 26px | 0em | |
| Body 1/Normal | 16px | 24px | 0.0057em | 본문 기본 |
| Body 1/Reading | 16px | 26px | 0.0057em | 긴 글 |
| Body 2/Normal | 15px | 22px | 0.0096em | 보조 본문 |
| Body 2/Reading | 15px | 24px | 0.0096em | |
| Label 1/Normal | 14px | 20px | 0.0145em | 버튼·폼 라벨 |
| Label 1/Reading | 14px | 22px | 0.0145em | |
| Label 2 | 13px | 18px | 0.0194em | 작은 라벨 |
| Caption 1 | 12px | 16px | 0.0252em | 캡션·메타 |
| Caption 2 | 11px | 14px | 0.0311em | 배지 |

제목류(Display~Headline)는 음수 자간, 본문·라벨·캡션은 양수 자간이다. 굵기는 제목 600~700, 본문 400, 라벨 500~600을 기본으로 한다.

## 3. 색

시멘틱 토큰만 쓴다(`--semantic-*`). 아토믹 토큰(`--atomic-*`, 14개 팔레트 × 명도 단계)은 새 시멘틱 값을 정의할 때만 참조한다.
모든 색 토큰은 `-rgb` 짝(`--semantic-primary-normal-rgb: 0, 102, 255`)이 있어 `rgba(var(--…-rgb), .2)` 형태로 알파를 줄 수 있다.
라이트 값은 `:root`, 다크 값은 `[data-theme="dark"]` 블록에 있다. 다크 모드는 `<html data-theme="dark">`로 켠다.

### 핵심 역할 (light / dark)

| 역할 | 토큰 | Light | Dark |
| --- | --- | --- | --- |
| Primary | `--semantic-primary-normal` | `#0066ff` | `#3385ff` |
| Primary 강조 1단계 | `--semantic-primary-strong` | `#005eeb` | |
| Primary 강조 2단계 | `--semantic-primary-heavy` | `#0054d1` | |
| 페이지 배경 | `--semantic-background-normal-normal` | `#ffffff` | `#1b1c1e` |
| 페이지 배경(대안) | `--semantic-background-normal-alternative` | `#f7f7f8` | `#0f0f10` |
| 떠 있는 면 | `--semantic-background-elevated-normal` | `#ffffff` | `#212225` |
| 본문 텍스트 | `--semantic-label-normal` | `#171719` | `#f7f7f8` |
| 강조 텍스트 | `--semantic-label-strong` | `#000000` | |
| 보조 텍스트 | `--semantic-label-neutral` | `#2e2f33e0` | |
| 3차 텍스트 | `--semantic-label-alternative` | `#37383c9c` | `#aeb0b69c` |
| 힌트 텍스트 | `--semantic-label-assistive` | `#37383c47` | |
| 비활성 텍스트 | `--semantic-label-disable` | `#37383c29` | |
| 구분선(투명) | `--semantic-line-normal-normal` | `#70737c38` | |
| 구분선(불투명) | `--semantic-line-solid-normal` | `#e1e2e4` | `#37383c` |
| 필드·칩 채움 | `--semantic-fill-normal` | `#70737c14` | |
| 성공 | `--semantic-status-positive` | `#00bf40` | `#1ed45a` |
| 경고 | `--semantic-status-cautionary` | `#ff9200` | `#ffa938` |
| 오류 | `--semantic-status-negative` | `#ff4242` | `#ff6363` |
| 상태 배경 | `--semantic-background-status-{positive,cautionary,negative}` | 8% 틴트 | |
| 비활성 면 | `--semantic-interaction-disable` | `#f4f4f5` | |
| 비활성 컨트롤 | `--semantic-interaction-inactive` | `#989ba2` | |
| 딤 | `--semantic-material-dimmer` | `#17171985` | |
| 반전(다크 카드 등) | `--semantic-inverse-{background,label,primary}` | | |
| 고정 흑백 | `--semantic-static-{black,white}` | | |

### 액센트

`--semantic-accent-foreground-{blue,cyan,green,lightBlue,lime,orange,pink,purple,red,redOrange,violet}`(텍스트·아이콘용, 대비 확보),
`--semantic-accent-background-{cyan,lightBlue,lime,pink,purple,redOrange,violet}`(배경·태그용). 브랜드 강조가 아닌 분류·데이터 구분에만 쓴다.

## 4. 간격·그리드

- 8px 기반 체계, 권장 간격은 4px 배수. 시각 보정은 2px, 불가피할 때 1px.
- Gutter 20px. 컬럼: 모바일 2, 태블릿 3, 데스크탑 12.
- 컨테이너: `--layout-max-width: 1060px`, `--layout-padding-inline: 40px`. GNB 높이 `--gnb-height: 62px`.
- 브레이크포인트: xs 0–768, sm 768–992, md 992–1200, lg 1200–1600 (max 1100px), xl 1600~ (max 1440px).
- 아트보드: Web 1440×960, Mobile 375×635, iOS 375×812pt, Android 360×800dp.

## 5. 엘리베이션

그림자는 토큰만 쓴다. 세 계열이 있다.

- `--semantic-elevation-shadow-normal-{xsmall,small,medium,large,xlarge}`: `box-shadow`용. 카드·드롭다운·팝오버·모달 순으로 단계를 올린다.
- `--semantic-elevation-shadow-drop-{xsmall…xlarge}`: `filter`용 `drop-shadow` 체인. 비정형 도형·이미지에 쓴다.
- `--semantic-elevation-shadow-spread-{small,medium}`: 넓게 퍼지는 강조 그림자. 히어로 카드 정도에만 쓴다.

## 6. 아이콘

- 24×24 SVG 339종, `currentColor` 유지. 이름은 `Icon{PascalCase}` (예: `IconSearch`, `IconChevronRight`).
- 파일: `assets/montage/icons/{Name}.svg`, 메타: `data/curated/icon-vectors.json`.
- 색은 부모의 `color`로 준다. 기본 크기 24px, 작은 UI는 20px/16px로 축소.

## 7. 컴포넌트

53개, 6 카테고리. 상세 anatomy·상태·플랫폼별 코드는 `data/curated/components.json`과 `docs/COMPONENTS.md`.

- Actions: Action area, Button, Chip, Icon button, Text button
- Contents: Accordion, Avatar, Avatar group, Card, Content badge, List card, List cell, Play badge, Section header, Table, Thumbnail
- Feedback: Alert, Fallback view, Push badge, Section message, Snackbar, Toast
- Loading: Loading, Skeleton
- Navigations: Bottom navigation, Category, Page counter, Pagination, Pagination dots, Progress indicator, Progress tracker, Tab, Top navigation
- Presentation: Autocomplete, Bottom sheet, Menu, Popover, Popup, Tooltip
- Selection and input: Check mark, Checkbox, Date picker, Filter button, Framed style, Radio, Search field, Segmented control, Select, Slider, Switch, Text area, Text field, Time picker

버튼 기본 규칙: Primary는 `primary-normal` 채움 + `static-white` 텍스트. hover/pressed 상태색은 원본 문서에 명시돼 있지 않으므로 `primary-strong` → `primary-heavy` 순으로 쓰되 추정값임을 밝힌다. disabled는 `interaction-disable` 배경 + `label-disable` 텍스트. Secondary는 `fill-normal` 배경 + `label-normal` 텍스트. 라벨은 Label 1 (14px/600).

## 8. 하지 말 것

- hex, px 그림자, 임의 자간을 직접 쓰지 않는다. 토큰이 없으면 가장 가까운 시멘틱 토큰을 고르고 사용자에게 알린다.
- `--atomic-*`를 컴포넌트 CSS에서 직접 참조하지 않는다.
- 원티드 로고·일러스트·스크린샷(`assets/montage/images/`)을 다른 제품에 넣지 않는다. 토큰·아이콘·컴포넌트 규칙만 재사용한다.
- 이 파일을 프로젝트에서 수정해 원본과 갈라지게 하지 않는다. 변경은 원본 저장소에서 하고 `/wanted-design update`로 전파한다.
