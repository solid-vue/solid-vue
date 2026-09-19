import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installExcelJs(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing ExcelJS...'))

  try {
    execSync('npm install exceljs', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install ExcelJS:'))
    console.error(chalk.red(err.message))
    return
  }

  const libDir = path.join(cwd, 'src', 'lib')
  if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true })

  fs.writeFileSync(path.join(libDir, 'excel.ts'), `import ExcelJS from 'exceljs'

export async function exportToExcel(rows: Record<string, unknown>[], filename: string) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Sheet1')

  if (rows.length > 0) {
    sheet.columns = Object.keys(rows[0]).map((key) => ({ header: key, key, width: 18 }))
    sheet.addRows(rows)
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
`)

  console.log(chalk.green.bold('\n✅ ExcelJS installed successfully!'))
  console.log(chalk.white('💡 Usage:'))
  console.log(chalk.cyan('   await exportToExcel(data, "reports.xlsx")'))
}