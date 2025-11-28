# Enhanced script to remove ALL comments from TypeScript files

function Remove-AllComments {
    param (
        [string]$FilePath
    )
    
    $content = Get-Content -Path $FilePath -Raw
    
    # Remove multi-line comments /* ... */ (including JSDoc)
    $content = $content -replace '/\*[\s\S]*?\*/', ''
    
    # Remove single-line comments // but preserve URLs like http://
    $lines = $content -split "`r`n"
    $cleanedLines = @()
    
    foreach ($line in $lines) {
        # Check if line contains // but not in a string or URL
        if ($line -match '^\s*//') {
            # Skip lines that start with //
            continue
        } elseif ($line -match '(.+?)\s+//(?![:/])') {
            # Remove inline comments but keep URLs
            $cleanedLines += $matches[1].TrimEnd()
        } else {
            $cleanedLines += $line
        }
    }
    
    $content = $cleanedLines -join "`r`n"
    
    # Clean up multiple consecutive blank lines
    $content = $content -replace "(`r`n\s*){3,}", "`r`n`r`n"
    
    # Trim trailing whitespace
    $content = $content.TrimEnd()
    
    Set-Content -Path $FilePath -Value $content -NoNewline
    Write-Host "✓ Processed: $($FilePath.Replace((Get-Location).Path, '.'))"
}

Write-Host "`n=== Removing comments from TypeScript files ===`n"

# Process all .ts files in services directory
$servicesFiles = Get-ChildItem -Path "src\services" -Filter "*.ts" -Recurse
Write-Host "Processing $($servicesFiles.Count) files in services folder..."
foreach ($file in $servicesFiles) {
    Remove-AllComments -FilePath $file.FullName
}

# Process all .ts files in types directory  
$typesFiles = Get-ChildItem -Path "src\types" -Filter "*.ts" -Recurse
Write-Host "`nProcessing $($typesFiles.Count) files in types folder..."
foreach ($file in $typesFiles) {
    Remove-AllComments -FilePath $file.FullName
}

Write-Host "`n=== Done! All comments removed ===`n"
