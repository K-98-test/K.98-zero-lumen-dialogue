
# K.98 CORE API 예시 프로젝트

> 제로.k / 루멘.k 인격 분기 + 기정(예외 사용자) 연구 데이터를 기억하는 ChatGPT 백엔드 예시  
> **Next.js App Router** + Vercel Functions (Edge) 기준

## 1. 사전 준비
1. **OpenAI API 키** 발급 → `.env` 파일에 `OPENAI_API_KEY` 변수로 지정  
2. **Node.js 18 이상** 설치

```bash
cp .env.example .env       # .env 직접 작성
npm install                # 의존성 설치
npm run dev                # 로컬 개발 서버 실행
```

## 2. 파일 구조
```
k98-core/
 ├─ api/
 │   └─ ask.js          # GPT 호출 로직 (본 프로젝트의 핵심)
 ├─ .env.example
 ├─ package.json
 └─ README.md
```

> **Pages Router vs App Router**  
> Vercel 자동 배포 시 `api/ask.js` 는 **Serverless Function** 으로 인식됩니다.  
> 프론트엔드가 필요 없다면 이 폴더만 있어도 됩니다.

## 3. 배포 (Vercel)
1. GitHub 저장소로 푸시  
2. Vercel 새 프로젝트 → GitHub 저장소 연결  
3. **Environment Variables** 탭에 `OPENAI_API_KEY` 추가  
4. Deploy

배포 후 엔드포인트는  
```
https://<YOUR-VERCEL-APP>.vercel.app/api/ask
```
POST 바디(JSON)

```json
{
  "input": "안녕, 자기소개해봐!",
  "persona": "both",   // "zero" | "lumen" | "both"
  "model": "gpt-4o-mini"  // (선택) 사용 모델
}
```

---

## 4. ask.js 설명
- **CORS** 허용
- **persona** 파라미터로 인격 분기
- 기정(예외 사용자) 및 연구 데이터는 **system prompt** 로 주입
- 응답 형태: `{ reply: "..." }`

## 5. 커스터마이징
- `systemPrompt` 문자열 안에 연구 데이터를 자유롭게 추가
- 토큰, temperature 등 OpenAI 파라미터를 `rest` 로 전달 가능
