# github-followbot



# IMPORTANT WARNING — READ BEFORE USING

> **This project is provided for educational and API-learning purposes only.**

>

> This repository contains code that can automatically follow multiple GitHub users.

> **Using this project for mass-following, spam, or other abusive automation may violate GitHub's Terms of Service, Acceptable Use Policies, or anti-spam rules, and may result in account restrictions or suspension.**

>

> **Do NOT use this project to mass-follow users or artificially increase followers.**

> You are solely responsible for how you use this code and for complying with GitHub's policies and rate limits.

>

> The author does **not** encourage or endorse spam, abusive automation, or attempts to manipulate GitHub's follower system.

>

> If your goal is to learn how to use the GitHub API, consider modifying the code to interact with **one explicitly specified user** rather than automatically searching for and following multiple users.

>

> **Please check GitHub's current policies before using the GitHub API with this project.**

---

# 사용법

1. code ==> download zip
2. 압축 해제
3. 터미널에 들어가거나 안에 있는 배치파일 실행 (follow.js와 같은 폴더에 있어야됨)
4.
```cmd
node
```
입력 (배치파일을 실행했다면 안해도 됨)

5.
```cmd
.load 경로\follow.js
```
(배치파일을 실행했다면 안해도 됨)

6. 자신의 토큰 입력  
7. 팔로우할 사람의 수 입력  

---

# 주의사항

- 반드시 Node.js가 설치되어 있어야 하고, 환경 변수 PATH에 node가 등록되어 있어야 함 (https://nodejs.org/ko/download)
- Node.js 버전이 18 이상이여야 하고 그 이하라면 node-fetch 설치 필요
- 한번 실행에 최대 100명까지만 가능
- ⚠️ 속도를 더 빠르게 하고 더 많은 사람들을 팔로우할 경우 계정 정지 먹기에 충분
- ⚠️ 토큰은 절대로 외부에 유출되서는 안되며 유출시 재생성 또는 삭제 바랍니다
