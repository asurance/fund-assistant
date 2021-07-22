import { FundInfoMap } from './config'

function main() {
  const subjects = new Map<string, number>()
  for (const { subject } of FundInfoMap.values()) {
    for (const s of subject) {
      subjects.set(s, (subjects.get(s) ?? 0) + 1)
    }
  }
  for (const [s, c] of subjects) {
    console.log(`${s}: ${c}`)
  }
}

main()
