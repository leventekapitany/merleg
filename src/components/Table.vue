<template>
    <div class="day" v-for="day in daysWithData" :key="day">
        <div class="date-label-container">
            <div class="date-label-month">{{ getDay(day[0].timestamp)[0] }}</div>
            <div class="date-label-day">{{ getDay(day[0].timestamp)[1] }}</div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Időpont</th>
                    <th>Tömeg</th>
                    <th>Változás</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="meas in day" :key="meas">
                    <td>{{ meas.minute }}</td>
                    <td>{{ meas.value }}</td>
                    <td>{{ meas.diff }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { onMounted, ref } from '@vue/runtime-core'

export default {
    setup() {
        const daysWithData = ref([])

        const monthNamesHun = ['Január', 'Február', 'Március', 'Árprilis', 'Május', 'Június', 'Július',
        'Augusztus', 'Szeptember', 'Október', 'November', 'December']

        const dayNamesHun = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat']


        const fetchData = () => {
            fetch('https://tripled.hu/phpserver/merleg/data.json')
            .then(res => res.json())
            .then(data => {

                const fetchedData = data.result.reverse().map((meas, index) => {
                    return {
                        ...meas,
                        diff: (meas.value - data.result[index + 1]?.value).toFixed(2)
                    }
                })

                daysWithData.value = splitDataToDays(fetchedData)
            })
        }

        const splitDataToDays = (_fetchedData) => {
            let splitted = []
            let day = null

            _fetchedData.forEach(meas => {
                if(meas.day !== day)
                {
                    splitted.push([])
                    day = meas.day
                }

                splitted[splitted.length - 1].push(meas)
            });

            return splitted
        }

        const getDay = (timestamp) => {
            const date = new Date(timestamp * 1000)
            
            return [monthNamesHun[date.getMonth()] + ' ' + date.getDate(),dayNamesHun[date.getDay()]]
        }

        onMounted(() => {
            fetchData()
        })

        return {
            fetchData,
            splitDataToDays,
            daysWithData,
            getDay
        }
    }
}
</script>

<style scoped>
.day{
    margin: auto;
    width: 90%;
    max-width: 800px;
    text-align: center;

    margin-bottom: 70px;
}
.date-label-month,
.date-label-day{
    text-align: center;
    font-size: 24px;
    margin-bottom: 12px;
    margin-top: 12px;
}

.date-label-day{
    font-weight: bold;
    margin-left: 12px;
}

.date-label-container{
    display: flex;
    justify-content: center;
    background: #067bc2;
    color: white;
    border-radius: 8px;
}

table {
    border-collapse: collapse;
    width: 100%;
    display: table;
    font-size: 22px;

    text-align: end;
    margin-top: 12px;
}

table tbody td{
    text-align: end;
}
table thead th,
table tbody td{
    padding-right: 24px;
}

table tbody tr {
    border-bottom: 1px solid rgba(6, 123, 194, 0.3);
    line-height: 50px;
}

table thead{
    line-height: 60px;
}

table td:first-child{
    font-weight: bold;
}

table td:last-child{
    opacity: 0.8;
}

</style>