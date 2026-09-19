import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installChartist(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing Chartist...'))

  try {
    execSync('npm install chartist', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install Chartist:'))
    console.error(chalk.red(err.message))
    return
  }

  const componentsDir = path.join(cwd, 'src', 'components')
  if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true })

  fs.writeFileSync(path.join(componentsDir, 'LineChart.vue'), `<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { LineChart } from 'chartist'
import 'chartist/dist/index.css'

const props = defineProps<{
  labels: string[]
  series: number[][]
}>()

const chartEl = ref<HTMLElement | null>(null)
let chart: LineChart | null = null

function render() {
  if (!chartEl.value) return
  chart?.detach()
  chart = new LineChart(chartEl.value, { labels: props.labels, series: props.series })
}

onMounted(render)
watch(() => [props.labels, props.series], render, { deep: true })
onUnmounted(() => chart?.detach())
</script>

<template>
  <div ref="chartEl" class="ct-chart"></div>
</template>
`)

  console.log(chalk.green.bold('\n✅ Chartist installed successfully!'))
  console.log(chalk.white('💡 Chartist haven\'t official Vue Binding — Wrapper component is ready:'))
  console.log(chalk.cyan('   import LineChart from "../components/LineChart.vue"'))
  console.log(chalk.cyan('   <LineChart :labels="[\'Sun\',\'Mon\']" :series="[[10,20]]" />'))
}