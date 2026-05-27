$files = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts | Select-String -Pattern "useState|useEffect|createContext|useRef|useReducer|framer-motion" -List | Select-Object -ExpandProperty Path
$count = 0
foreach ($file in $files) {
    $content = Get-Content -Path $file -Raw
    if ($content -notmatch '^\s*["'']use client["'']') {
        $newContent = "`"use client`";`r`n`r`n" + $content
        Set-Content -Path $file -Value $newContent -NoNewline
        Write-Host "Fixed: $file"
        $count++
    }
}
Write-Host "Total fixed: $count"
