export const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
export const monthsShort = ['янв', 'февр', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'нояб', 'дек'];
const defaultItems = ['s&p500', 'nasdaq100'];

export default async (type) => {
    const data = await fetch('https://opensheet.vercel.app/1SaKS0oWi7Vep62CK8erQe4-5iHCWudJGlB1sdE5vDP4/list');
    const json = await data.json();
    const dates = [];

    const itemNames = [...defaultItems, type.toLowerCase()];
    const items = json.filter(i => itemNames.includes(i[""].toLowerCase())).reverse().map((item, index) => {
        const keys = Object.keys(item).filter(i => !!i);
        const items = [];
        for (const key of keys) {
            const value = parseInt(item[key].replace(/\D/g, ''));
            const dateData = key.split(' ');
            const month = months.findIndex(i => i === dateData[0].toLowerCase());
            items.push(value);

            if (index > 0) {
                const date = new Date();
                date.setMonth(month);
                date.setFullYear(parseInt(dateData[1]));
                date.setDate(1);

                dates.push(date);
            }
        }

        const percents = [];
        items.forEach((value, index) => {
            let i = 0;
            if (index > 0) {
                i = Math.round(value / (items[0] / 100)) - 100;
            }
            percents.push(i);
        });

        return {
            name: item[""],
            data: percents
        };
    });

    return { dates, items };
}
