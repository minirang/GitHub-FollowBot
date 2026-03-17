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
        else if (res.status === 401) console.log("Invalid token");
        else if (res.status === 403) console.log("Rate limit hit");
        else console.log("Failed:", username, res.status);
    } catch (err) {
        console.error("Network error while following", username, err);
    }
}
async function getRandomUsers() {
    try {
        const letters = "abcdefghijklmnopqrstuvwxyz";
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        const page = Math.floor(Math.random() * 10) + 1;
        const res = await fetch(
            `https://api.github.com/search/users?q=${randomLetter}&per_page=${people}&page=${page}`, {
                headers: {
                    Accept: "application/vnd.github+json",
                    "User-Agent": "node-follow-script"
                }
            }
        );
        if (!res.ok) {
            console.log("Search request failed:", res.status);
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
            const waitTime = 25000 + Math.random() * 60000;
            console.log(`Waiting ${(waitTime / 1000).toFixed(1)} seconds for next follow...`);
            console.log(`${left} users followed\n`)
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
