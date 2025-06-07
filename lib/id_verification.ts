export const letterCode: Record<string, number> = {
    A: 10, // 台北市
    B: 11, // 台中市
    C: 12, // 基隆市
    D: 13, // 台南市
    E: 14, // 高雄市
    F: 15, // 台北縣（新北市）
    G: 16, // 宜蘭縣
    H: 17, // 桃園縣（桃園市）
    I: 34, // 嘉義市
    J: 18, // 新竹縣
    K: 19, // 苗栗縣
    L: 20, // 台中縣
    M: 21, // 南投縣
    N: 22, // 彰化縣
    O: 35, // 新竹市
    P: 23, // 雲林縣
    Q: 24, // 嘉義縣
    R: 25, // 台南縣
    S: 26, // 高雄縣
    T: 27, // 屏東縣
    U: 28, // 花蓮縣
    V: 29, // 台東縣
    W: 32, // 金門縣
    X: 30, // 澎湖縣
    Y: 31, // 陽明山 (舊制，現已併入台北市)
    Z: 33  // 連江縣
};

export function validateTaiwanID(id: string): boolean {

    if (!/^[A-Z][1289]\d{8}$/i.test(id)) return false;

    const sum = id.split("").map((char, index) => {
        if (index === 0 && !letterCode[char.toUpperCase()]) {
            return -10000;
        }

        if (index === 0) {
            const letterRepresents = letterCode[char.toUpperCase()];

            const decimal = Math.floor(letterRepresents / 10);
            const unit = letterRepresents % 10;

            return decimal + unit * 9;
        }

        if(index === 9){
            return parseInt(char)
        }

        return parseInt(char) * (9 - index);
    }).reduce((acc: number, curr: number) => acc + curr, 0);

    console.log(sum)

    if (sum < 0) return false; // Invalid first character

    return sum % 10 === 0;
}