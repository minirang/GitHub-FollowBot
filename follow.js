// Node 18 버전 이하라면 단순히 node-fetch 설치만 해도 아래 코드가 알아서 불러옴
const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < 18) {
    global.fetch = (...args) =>
        import("node-fetch").then(({ default: fetch }) => fetch(...args));
}
console.log("SCRIPT START");
const readline = require("readline");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let left = 0;
let remaining;

function askInput(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}
let token;
let people;
async function follow(username) {
    try {
        const res = await fetch(`https://api.github.com/user/following/${username}`, {
            method: "PUT",
            headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github+json",
                "User-Agent": "node-follow-script"
            }
        });
        remaining = res.headers.get("x-ratelimit-remaining");
        if (res.status === 204) {
            console.log("Followed:", username);
        }
        else if (res.status === 404) console.log("User not found:", username);
        else if (res.status === 401) {
            console.log("Invalid token");
            process.exit(1);
        } else if (res.status === 403) {
            let msg = "";
            try {
                const data = await res.json();
                msg = data.message || "";
            } catch (e) { }
            console.log("403 Forbidden:", msg);
            if (msg.includes("rate limit")) {
                console.log("Reason: Primary rate limit exceeded");
            }
            else if (msg.includes("secondary") || msg.includes("abuse")) {
                console.log("Reason: Secondary rate limit (abuse detection)");
            }
            else if (msg.includes("scope") || msg.includes("permission")) {
                console.log("Reason: Missing token scope/permission");
            }
            else {
                console.log("Reason: Unknown 403 block");
            }
            console.info("Script stopped due to 403");
            process.exit(1);
        }
        else console.error("Failed:", username, res.status);
    } catch (err) {
        console.error("Network error while following", username, err);
    }
}
async function getRandomUsers() {
    try {
        const letters = "abcdefghijklmnopqrstuvwxyz";
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        const page = Math.floor(Math.random() * 10) + 1;
        const query = `${randomLetter} repos:>=6 followers:>=40`;
        const res = await fetch(
            `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=${people}&page=${page}`, {
            headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github+json",
                "User-Agent": "node-follow-script"
            }
        }
        );
        if (!res.ok) {
            console.error("Search request failed:", res.status);
            return [];
        }
        const data = await res.json();
        if (!data.items) return [];
        return data.items.map((u) => u.login);
    } catch (err) {
        console.error("Search error:", err);
        return [];
    }
}
async function followRandomUsers() {
    if (!token) {
        console.log("No GitHub token provided");
        return;
    }
    const users = await getRandomUsers();
    if (users.length === 0) {
        console.log("No users found");
        return;
    }
    console.log("Users found:", users.length);
    for (let i = 0; i < users.length; i++) {
        const username = users[i];
        await follow(username);
        left += 1
        if (i < users.length - 1) {
            const waitTime = 35000 + Math.pow(Math.random(), 2) * 85000;
            console.log(`Waiting ${(waitTime / 1000).toFixed(1)} seconds for next follow...`);
            if (left === 1) console.log(`${left} user followed\n`)
            else console.log(`${left} users followed\n`)
            await delay(waitTime);
        }
    }
    console.log("Finished following users");
    console.log("Remaining requests:", remaining);
}
async function start() {
    token = await askInput("Enter GitHub token: ");
    const peopleInput = await askInput("Number of users to follow (1 ~ 100): ");
    people = parseInt(peopleInput) || 100;
    await followRandomUsers();
}

start();
