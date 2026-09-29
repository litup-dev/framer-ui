# 게시판(Post) API 명세

> 대상: 프론트엔드(framer-ui) 연동용. `feature/build-board` 브랜치 기준 (백엔드 7단계 완료, [BOARD_PLAN.md](BOARD_PLAN.md) 참고).

## 공통 사항

- Base path: `{API_PREFIX}` = `/api/v1` (예: `POST /api/v1/posts`)
- 인증: 쿠키 기반 JWT (`accessToken` 쿠키, `requireAuth`/`optionalAuth`)
  - **requireAuth**: 로그인 필수. 쿠키 없거나 만료 시 401
  - **optionalAuth**: 비로그인도 허용. 로그인 상태면 `isMine`, `myLikeType` 등 개인화 필드가 채워짐
- 응답 포맷은 3종류 공통 envelope 사용

**성공 (단건)**
```json
{ "data": { /* ... */ } }
```

**성공 (목록/페이지네이션)**
```json
{
  "data": {
    "items": [ /* ... */ ],
    "total": 42,
    "offset": 0,
    "limit": 10
  }
}
```

**에러**
```json
{
  "error": {
    "statusCode": 400,
    "message": "존재하지 않는 카테고리입니다: XXX",
    "code": "BAD_REQUEST"
  }
}
```

| statusCode | code | 의미 |
|---|---|---|
| 400 | BAD_REQUEST | 유효성 실패, 잘못된 카테고리/이미지 ID 등 |
| 401 | (FST_JWT_*) | 인증 실패/만료 (`requireAuth` 필요한데 미로그인) |
| 403 | FORBIDDEN | 본인 게시글/댓글이 아님 |
| 404 | NOT_FOUND | 게시글/댓글 없음 |
| 500 | - | 서버 오류 |

## 코드 값

**게시판 코드 (`boardCode` / `board`)**
| code | 설명 |
|---|---|
| `FREE` | 자유 게시판 (기본값) |
| `PERFORM_REVIEW` | 공연 후기 게시판 |

**카테고리 코드 (`categoryCode` / `category`)** — **FREE 게시판에서만 사용**. PERFORM_REVIEW 게시판 글은 항상 category가 `null`.
| code | 설명 |
|---|---|
| `GENERAL` | 일반글 (기본값) |
| `BAND_PROMO` | 밴드 홍보글 |
| `PERFORM_REVIEW` | 공연 후기 (자유게시판 내 카테고리 — 게시판 자체와는 다른 개념이라 주의) |

**좋아요 타입 (`likeType`)**: `LIKE` | `DISLIKE`

**정렬 (`sort`, 게시글 목록만)**: `-createdAt`(최신순, 기본) | `+createdAt`(오래된순)

---

## 1. 게시글 목록 조회

`GET /posts`

**Query**
| 필드 | 타입 | 필수 | 기본값 | 설명 |
|---|---|---|---|---|
| board | string | N | `FREE` | 게시판 코드 |
| category | string | N | - | 카테고리 필터 (FREE만 의미 있음) |
| keyword | string | N | - | 제목+내용 OR 검색 (대소문자 무시) |
| sort | string | N | `-createdAt` | 정렬 |
| offset | number | N | 0 | 페이징 오프셋 |
| limit | number | N | 10 | 페이징 제한 (최대 100) |

**Response 200**
```json
{
  "data": {
    "items": [
      {
        "id": 12,
        "boardCode": "FREE",
        "category": { "code": "GENERAL", "name": "일반글" },
        "title": "같이 공연 보러 가실 분 구합니다",
        "createdAt": "2026-07-10T12:00:00.000Z",
        "updatedAt": null,
        "author": { "id": 3, "nickname": "홍대베짱이", "profilePath": null },
        "likeCount": 4,
        "commentCount": 2
      }
    ],
    "total": 49,
    "offset": 0,
    "limit": 10
  }
}
```
- `category`는 PERFORM_REVIEW 게시판 글이거나 category 미지정 시 `null`
- `likeCount`는 LIKE만 카운트 (DISLIKE 제외), `commentCount`는 묘비(삭제) 댓글 제외

---

## 2. 게시글 작성

`POST /posts` — **requireAuth**

**Body**
| 필드 | 타입 | 필수 | 기본값 | 설명 |
|---|---|---|---|---|
| boardCode | string | N | `FREE` | 게시판 코드 |
| categoryCode | string | N | `GENERAL` | FREE 게시판만 사용 |
| title | string | Y | - | 1~50자 |
| content | string | Y | - | 1~50000자, 마크다운 텍스트 그대로 저장 (sanitize 없음) |
| imageIds | number[] | N | `[]` | 선업로드된 이미지 ID, 최대 10개 |

```json
{
  "boardCode": "FREE",
  "categoryCode": "GENERAL",
  "title": "같이 공연 보러 가실 분 구합니다",
  "content": "## 소개\n같이 가실 분...",
  "imageIds": [101, 102]
}
```

**Response 200**
```json
{ "data": { "id": 55 } }
```

**주의**
- `imageIds`는 [3. 이미지 선업로드](#3-게시글-이미지-선업로드)로 미리 받은 id만 사용 가능하며, **본인이 업로드한 이미지가 아니거나 이미 다른 글에 연결된 이미지**가 섞이면 400

---

## 3. 게시글 이미지 선업로드

`POST /upload/post-image` — **requireAuth**, `multipart/form-data`, 한 번에 1장만

에디터(TOAST UI)에서 이미지 삽입 시 글 저장 **전에** 먼저 업로드하는 방식. 5MB 제한.

**Response 200**
```json
{ "data": { "id": 101, "filePath": "post/3/1731234567-abc.jpg" } }
```

- 여기서 받은 `id`를 게시글 생성/수정 시 `imageIds`에 넣어야 실제로 글에 연결됨
- 연결 안 된 이미지(post_id NULL)는 24시간 후 서버 cron이 자동 정리하므로, 업로드했지만 글 저장을 안 하면 자연히 사라짐

---

## 4. 게시글 상세 조회

`GET /posts/:entityId` — **optionalAuth**

**Response 200**
```json
{
  "data": {
    "id": 55,
    "boardCode": "FREE",
    "category": { "code": "GENERAL", "name": "일반글" },
    "title": "같이 공연 보러 가실 분 구합니다",
    "content": "## 소개\n같이 가실 분...",
    "createdAt": "2026-07-10T12:00:00.000Z",
    "updatedAt": null,
    "author": { "id": 3, "nickname": "홍대베짱이", "profilePath": null },
    "images": [{ "id": 101, "filePath": "post/3/1731234567-abc.jpg" }],
    "likeCount": 4,
    "dislikeCount": 1,
    "commentCount": 2,
    "isMine": false,
    "myLikeType": null
  }
}
```
- 비로그인이면 `isMine: false`, `myLikeType: null` 고정
- 없는 게시글이면 404

---

## 5. 게시글 수정

`PATCH /posts/:entityId` — **requireAuth**, 본인 글만 (아니면 403)

**Body** — ⚠️ **imageIds는 수정 후 남아야 할 이미지 전체 목록을 매번 전송** (부분 diff 아님). 서버가 기존과 비교해서 빠진 이미지는 row + 스토리지 파일까지 삭제함.
| 필드 | 타입 | 필수 |
|---|---|---|
| categoryCode | string | N (기본 GENERAL) |
| title | string | Y (1~50자) |
| content | string | Y (1~50000자) |
| imageIds | number[] | Y (최종 상태 전체, 최대 10개) |

**Response 200**
```json
{ "data": { "success": true, "operation": "updated" } }
```

---

## 6. 게시글 삭제

`DELETE /posts/:entityId` — **requireAuth**, 본인 글만 (아니면 403)

Hard delete. 댓글/이미지/좋아요는 FK cascade로 함께 삭제, 이미지 스토리지 파일도 서버가 삭제.

**Response 200**
```json
{ "data": { "success": true, "operation": "deleted" } }
```

---

## 7. 좋아요/싫어요 토글

`POST /posts/:entityId/like` — **requireAuth**

**Body**
```json
{ "likeType": "LIKE" }
```

동작: 없으면 등록 / **같은 타입 재요청 시 취소** / **다른 타입이면 변경**.

**Response 200**
```json
{ "data": { "myLikeType": "LIKE", "likeCount": 5, "dislikeCount": 1 } }
```
- 취소된 경우 `myLikeType: null`

---

## 8. 댓글 작성

`POST /posts/:entityId/comments` — **requireAuth**

**Body**
| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| content | string | Y | 1~1000자 |
| parentId | number | N | 대댓글인 경우 부모 댓글 id |

```json
{ "content": "공연 정말 좋았어요!", "parentId": 10 }
```

**Response 200**
```json
{ "data": { "id": 21 } }
```

**주의 (대댓글 1 depth 제한)**
- `parentId`로 지정한 댓글이 이미 대댓글(자기 자신도 parentId를 가짐)이면 400 — **대댓글에 대댓글 불가**
- `parentId`가 다른 게시글 소속이거나 삭제(묘비)된 댓글이면 400/404

---

## 9. 댓글 목록 조회

`GET /posts/:entityId/comments` — **optionalAuth**

**Query**
| 필드 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| offset | number | 0 | **최상위 댓글 기준** 오프셋 |
| limit | number | 20 | 최상위 댓글 기준 제한 |

정렬은 등록순 고정(변경 불가). 대댓글은 중첩이 아니라 **각 최상위 댓글의 `replies[]`에 flat 배열**로 내려감 (n-depth 확장 대비 설계, `parentId` 포함).

**Response 200**
```json
{
  "data": {
    "items": [
      {
        "id": 10,
        "parentId": null,
        "content": "저도 가고 싶어요!",
        "createdAt": "2026-07-10T13:00:00.000Z",
        "updatedAt": null,
        "author": { "id": 5, "nickname": "인디팬", "profilePath": null },
        "isMine": false,
        "isDeleted": false,
        "replies": [
          {
            "id": 21,
            "parentId": 10,
            "content": "공연 정말 좋았어요!",
            "createdAt": "2026-07-10T13:05:00.000Z",
            "updatedAt": null,
            "author": { "id": 3, "nickname": "홍대베짱이", "profilePath": null },
            "isMine": true,
            "isDeleted": false,
            "replies": []
          }
        ]
      }
    ],
    "total": 8,
    "offset": 0,
    "limit": 20
  }
}
```

**묘비(삭제된 댓글) 처리** — 자식(대댓글)이 있는 댓글은 실제로 삭제되지 않고 마스킹됨:
- `isDeleted: true`
- `content: ""` (빈 문자열)
- `author: null`
- 프론트는 `isDeleted === true`일 때 **"삭제된 댓글입니다"** 로 렌더링하면 됨
- 묘비 댓글은 `commentCount`(게시글 상세/목록)에서 제외됨

---

## 10. 댓글 수정

`PATCH /comments/:entityId` — **requireAuth**, 본인 댓글만

**Body**
```json
{ "content": "공연 정말 좋았어요! (수정)" }
```

**Response 200**
```json
{ "data": { "success": true, "operation": "updated" } }
```
- 묘비(삭제됨) 댓글은 수정 불가 → 404

---

## 11. 댓글 삭제

`DELETE /comments/:entityId` — **requireAuth**, 본인 댓글만

**Response 200**
```json
{ "data": { "success": true, "operation": "deleted" } }
```

**동작**
- 자식(대댓글) 없는 댓글 → hard delete
- 자식 있는 댓글 → 묘비 처리 (`isDeleted: true`, 위 9번 참고)
- 이미 삭제(묘비 포함)된 댓글 재삭제 시도 → 404
- 마지막 남은 대댓글이 삭제되면, 자식이 없어진 묘비 부모도 자동으로 정리(hard delete)됨 — 묘비가 무한히 쌓이지 않음

---

## 참고: 신고

게시글/댓글 신고는 기존 신고 API 재사용. 새 엔드포인트 아님.

`POST /report` (기존 API, requireAuth)
```json
{ "typeId": 1, "categoryId": 2, "entityId": 55, "content": "신고 사유 (10자 이상, 선택)" }
```
- `typeId`는 `report_type_code`에서 게시글은 `post`, 댓글은 `comment` 코드의 id 값. **현재 이 코드값을 프론트에 내려주는 조회 API가 없음** — typeId를 하드코딩하거나 백엔드에 코드 목록 API 추가를 요청해야 함 (⚠️ 중복 데이터 이슈도 있음, [BOARD_PLAN.md 6단계](BOARD_PLAN.md) 참고)
- `entityId`는 게시글이면 post id, 댓글이면 comment id

---

## 아직 없는 기능 (백엔드 미구현, 향후 확장 예정)

- 팬 게시판 동적 생성(요청/승인)
- 공연/클럽 태그 (`post_tag_tb`) — 태그 검색/필터 UI는 아직 붙일 수 없음
- 싫어요 N개 이상 자동 필터링 — 정책 미정
