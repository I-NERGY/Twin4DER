import { Chart } from "react-google-charts";
import { useSelector } from 'react-redux';

const ResultChart = (props) => {
    let c  = [];
    c.push(['time', 'Node 1 Voltage (real)']);

    for (let i = 0; i < props.a.length; i++) {
        c.push([props.a[i], props.b[i]])
    }

    //<const className="push"></const>
    //const times = useSelector((state) => state.results.times);
    //const data = useSelector((state) => state.results.dataOfSelectedColumn);


    const myData = [
        ['time', 'Node 1 Voltage (real)'],
        ['0', 410.193695],
        ['1', 410.190006],
        ['2', 410.192166],
        ['3', 410.192166],
        ['4', 410.192166],
        ['5', 410.193277],
        ['6', 410.193228],
        ['7', 410.193135],
        ['8', 410.19368],
    ]


    return (
        <div className="horizontal-element">
        <Chart
        chartType="LineChart"
        data={c}
        width="500px"
        height="100%"
      />
        </div>
    );
}

export default ResultChart;
