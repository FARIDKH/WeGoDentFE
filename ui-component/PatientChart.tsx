import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement, // Import BarElement
    BarController, // Import BarController
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    TimeSeriesScale,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { Bar } from 'react-chartjs-2'

// Register the necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement, // Register BarElement
    BarController, // Register BarController
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    TimeSeriesScale
)

interface PatientChartData {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        borderColor: string
        tension: number
    }[]
}

interface PatientChartProps {
    data: PatientChartData
    options?: any
}

const PatientChart: React.FC<PatientChartProps> = ({ data, options }) => {
    return <Bar data={data} options={options} />
}

export default PatientChart
