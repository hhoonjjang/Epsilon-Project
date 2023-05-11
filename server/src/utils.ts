import axios from 'axios';

type TokenExchange = {
    from: string;
    to: string;
    toUSD: number;
    amount: number;
    conversion: number;
};

// 가상 화폐 개수 만큼의 USD 금액을 환산하는 함수
const getQuotes = async (from: string, amount: number) => {
    const apiUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';
    const apiKey = process.env.COINMARKETCAP_API_KEY;

    const quote =
        (
            await axios.get(apiUrl, {
                headers: {
                    'X-CMC_PRO_API_KEY': apiKey,
                },
                params: {
                    symbol: from, // 조회하려는 암호화폐의 심볼 (MATIC, KLAY 등)
                },
            })
        ).data.data[from.toUpperCase()][0].quote.USD.price * amount;

    return quote;
};

// 환율 정보를 가져오는 함수
const getConversion = async ({ from, to, amount }: { from: string; to: string; amount: number }) => {
    const apiUrl = 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion';
    const apiKey = process.env.COINMARKETCAP_API_KEY;

    const conversion = (
        await axios.get(apiUrl, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
            },
            params: {
                symbol: from, // 변환하려는 암호화폐 (MATIC)
                amount: amount, // 변환하려는 양 (10)
                convert: to, // 변환하려는 대상 암호화폐의 심볼 (KLAY, HUT)
            },
        })
    ).data.data[0].quote;
    return conversion;
};

// 숫자를 소수점 n자리 까지 자르는 함수
function roundNumber(num: number | string, decimalPlaces: number): number {
    if (typeof num == 'string') {
        num = parseInt(num);
    }
    return Number(Number(num).toFixed(decimalPlaces));
}

// 두 금액의 차이를 비율로 계산하는 함수 : ((to - from) / from) x 100%
function calculatePercentageDifference(from: number, to: number): number {
    const difference = to - from;
    const percentageDifference = (difference / from) * 100;
    return percentageDifference;
}

// 1개(amount)의 가상화폐에 대한 환율 정보 객체를 구하는 함수
const createTokenConversion = async (from: string, to: string) => {
    let tempObject: TokenExchange = {
        from,
        to,
        toUSD: roundNumber(await getQuotes(to, 1), 4),
        amount: 1,
        conversion: roundNumber((await getConversion({ from, to, amount: 1 }))[`${to.toUpperCase()}`].price, 4),
    };
    return tempObject;
};

export { getQuotes, getConversion, roundNumber, calculatePercentageDifference, createTokenConversion };
