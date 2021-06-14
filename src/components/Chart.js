import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';


function Chart(props) {

    let datasets = [];
    let numOfLabels = 0;

    props.chartData.forEach(player => {
        datasets.push({
            borderJoinStyle: 'bevel',
            pointRadius: 0,
            label: player.name,
            data: player.safePoints,
            borderColor: player.lineColor,
            borderWidth: 2
        });

        if (player.potentialPoints) {
            datasets.push({
                pointRadius: 0,
                borderDash: [5],
                label: player.name + ' Potential',
                data: player.potentialPoints,
                backgroundColor: 'transparent',
                borderColor: player.lineColor,
                borderWidth: 2
            });
        }

        numOfLabels = player.safePoints.length + 2;
    });

    
    const ref = useRef();
    const chartData = {
        labels: [...Array(numOfLabels).keys()],
        datasets: datasets,
        options: { 
            animation: { duration: 0 }, 
            scales: { y: { suggestedMin: 0, suggestedMax: 300 }}
        }
    };

    const style={
        opacity: props.visible ? 1 : 0,
        PointerEvent: props.visible ? 'all' : 'none'
    }

    return (
        <div className='Chart' style={style}><Line ref={ref} data={chartData} options={chartData.options} height={120}/></div>
    )

}

export default Chart;