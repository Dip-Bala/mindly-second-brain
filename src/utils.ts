export function generateHash(len: number): string{
    let string = "qwertyuioplkjhgfdsazxcvbnm0987654321";
    let ans: string = "";
    for(let i: number = 0; i < len; i++){
        ans += string[Math.floor(Math.random() * string.length)];
    }
    return ans;
}