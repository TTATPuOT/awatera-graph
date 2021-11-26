import Highcharts from 'highcharts';
import getData, {getName, monthsShort} from "./modules/data";

require('highcharts/modules/exporting')(Highcharts);

const blocks = document.querySelectorAll('.awatera-chart');
for (const block of blocks) {
    const type = block.getAttribute('data-type');
    if (type) generate(block, type).then().catch(e => console.error(e));
}

async function generate (container, type) {
    const data = await getData(type);

    return Highcharts.chart({
        chart: {
            renderTo: container,
            events: {
                render: function() {
                    const array = this.series.map(s => s.points[s.points.length - 1])
                    this.tooltip.refresh(array);
                }
            }
        },
        title: {
            text: `Динамика портфеля «${getName(type)}»`,
            style: {
                textAlign: 'center'
            }
        },
        credits: false,
        exporting: {
            enabled: false
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
        },

        yAxis: {
            title: { text: '' },
            labels: {
                style: {
                    color: '#AFB5BF'
                },
                format: '{text}%'
            }
        },

        xAxis: {
            labels: {
                style: {
                    color: '#AFB5BF'
                }
            },
            categories: data.dates.map(d => `${monthsShort[d.getMonth()]} ${d.getFullYear()}`)
        },

        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '%'
        },

        plotOptions: {
            series: {
                dataLabels: {
                    color: '#999999'
                }
            },
            line: {
                marker: { enabled: false },
                lineWidth: 4
            }
        },

        colors: ['#07B4B2', '#771CA2', '#4D96E1'],

        series: data.items,
    });
}
