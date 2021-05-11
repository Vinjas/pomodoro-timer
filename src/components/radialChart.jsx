import React from "react"
import Chart from "react-apexcharts";

class RadialChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [70],
            
            options: {
                chart: {
                    height: 350,
                    type: 'radialBar',
                },

            plotOptions: {
                radialBar: {
                    hollow: {
                        size: '70%',
                    }
                },
            },
            
            labels:
                ['Cricket'],
            },     
        }
    }

    render() {
        return (
            <div id="chart">
                <Chart 
                options={this.state.options} 
                series={this.state.series} 
                type="radialBar" 
                height={350} />
            </div>
        )
    }
}

export default RadialChart