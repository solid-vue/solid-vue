import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import chalk from 'chalk'

export default function installPdfLib(cwd) {
  console.log(chalk.blue.bold('\n🚀 Installing pdf-lib...'))

  try {
    execSync('npm install pdf-lib', { stdio: 'inherit', cwd })
  } catch (err) {
    console.error(chalk.red.bold('\n❌ Failed to install pdf-lib:'))
    console.error(chalk.red(err.message))
    return
  }

  const libDir = path.join(cwd, 'src', 'lib')
  if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true })

  fs.writeFileSync(path.join(libDir, 'pdf.ts'), `import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function generateSimplePdf(title: string, lines: string[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  page.drawText(title, { x: 50, y: 780, size: 18, font: boldFont, color: rgb(0, 0, 0) })
  lines.forEach((line, i) => {
    page.drawText(line, { x: 50, y: 740 - i * 20, size: 11, font })
  })

  return pdfDoc.save()
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function buildWhatsAppShareLink(phone: string, message: string): string {
  return \`https://wa.me/\${phone}?text=\${encodeURIComponent(message)}\`
}
`)

  console.log(chalk.green.bold('\n✅ pdf-lib installed successfully!'))
  console.log(chalk.white('💡 Usage:'))
  console.log(chalk.cyan('   const bytes = await generateSimplePdf("Nota", ["coconut: 10kg"])'))
  console.log(chalk.cyan('   downloadPdf(bytes, "invoice.pdf")'))
  console.log(chalk.gray('   Send via WhatsApp: window.open(buildWhatsAppShareLink(number, message))'))
}