<template>
    <div>Mérleg: {{ selectedScale }}</div>
    <div>
        <select v-on:change="selectScale($event)" name="" id="">
            <option value="1">Mérleg1</option>
            <option value="2">Mérleg2</option>
        </select>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import Cookies from 'js-cookie'
import { onMounted } from '@vue/runtime-core'

export default {
    setup() {
        const selectedScale = ref(null)

        const getScale = () => {
            return Cookies.get('scale')
        }

        const selectScale = (event) => {
            if(event.target.value)
            Cookies.set('scale', event.target.value)
            selectedScale.value = event.target.value
            console.log(Cookies.get('scale'))
        }

        onMounted(() => {
            selectedScale.value = getScale()
        })

        return {
            selectedScale,
            selectScale,
            getScale
        }
    },
}
</script>