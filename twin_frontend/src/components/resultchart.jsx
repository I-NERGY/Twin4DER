import { Chart } from "react-google-charts";

const ResultChart = (props) => {
    let chartData  = [];
    let legends = [];

    legends.push('time');

    props.y.forEach((item) => {
        legends.push(item.columnName)
    });
    
    chartData.push(legends);
    let row = [];

    for (let i = 0; i < props.x.length; i++) {
        row.push(props.x[i])   
        props.y.forEach((item) => {
            row.push(item.columnData[i])
        });
        chartData.push(row);
        row = [];
    }

    return (
        <div className="horizontal-element">
        <Chart
        chartType="LineChart"
        data={chartData}
        width="700px"
        height="500px"
      />
        </div>
    );
}

export default ResultChart;
