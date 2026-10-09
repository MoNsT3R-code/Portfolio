# Converts Word and PowerPoint files to PDF with the installed Office apps.
# Input: a JSON file listing { src, out, type } where type is "docx" or "deck".
param([Parameter(Mandatory = $true)][string]$Jobs)

$jobs = Get-Content -Raw -Path $Jobs | ConvertFrom-Json
$docs = @($jobs | Where-Object { $_.type -eq 'docx' })
$decks = @($jobs | Where-Object { $_.type -eq 'deck' })

if ($docs.Count -gt 0) {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $word.DisplayAlerts = 0
  foreach ($j in $docs) {
    try {
      $d = $word.Documents.Open($j.src, $false, $true)
      $d.SaveAs2($j.out, 17)   # wdFormatPDF
      $d.Close($false)
      "ok   $($j.out)"
    } catch { "FAIL $($j.src): $($_.Exception.Message)" }
  }
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}

if ($decks.Count -gt 0) {
  $pp = New-Object -ComObject PowerPoint.Application
  foreach ($j in $decks) {
    try {
      $p = $pp.Presentations.Open($j.src, -1, 0, 0)   # read-only, no window
      $p.SaveAs($j.out, 32)                          # ppSaveAsPDF
      $p.Close()
      "ok   $($j.out)"
    } catch { "FAIL $($j.src): $($_.Exception.Message)" }
  }
  $pp.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($pp) | Out-Null
}
