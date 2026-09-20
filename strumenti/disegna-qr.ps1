<#
  Disegna un QR a partire da una matrice di 0/1 (una riga per riga di
  moduli). Opzionale: un logo al centro.

  La matrice si genera con la libreria qrcode-generator in un browser:
  qui non c'e' Node, quindi il codice arriva gia' calcolato in un .txt.
  ATTENZIONE: se ci va il logo, la matrice dev'essere a correzione H,
  se no il buco al centro mangia dati che nessuno sa piu' ricostruire.
#>
param(
  [Parameter(Mandatory=$true)][string]$Matrice,
  [Parameter(Mandatory=$true)][string]$Uscita,
  [string]$Logo = "",
  [int]$Px = 24,
  [int]$Quiete = 4,
  [int]$ModuliLogo = 11
)
Add-Type -AssemblyName System.Drawing
$righe = Get-Content $Matrice
$n = $righe.Count
$lato = $n + 2 * $Quiete
$dim = $lato * $Px
$bmp = New-Object System.Drawing.Bitmap($dim, $dim)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.InterpolationMode = 'HighQualityBicubic'
$g.Clear([System.Drawing.Color]::White)
$scuro = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(11,13,31))
for ($r = 0; $r -lt $n; $r++) {
  $riga = $righe[$r]
  for ($c = 0; $c -lt $n; $c++) {
    if ($riga[$c] -eq '1') {
      $g.FillRectangle($scuro, ($c + $Quiete) * $Px, ($r + $Quiete) * $Px, $Px, $Px)
    }
  }
}
if ($Logo -ne "") {
  # Il buco al centro: la correzione di livello H ricostruisce fino al 30%
  # dei dati, quindi qui ci sta comodo un quadrato di 11 moduli su 41
  # (27% del lato = 7% dell'area). Sopra quella soglia il codice comincia
  # a non leggersi piu' sui telefoni scarsi, e non te ne accorgi finche'
  # non e' gia' stampato.
  $off = [int](($n - $ModuliLogo) / 2) + $Quiete
  $x0 = $off * $Px
  $larg = $ModuliLogo * $Px
  $raggio = [int]($larg * 0.22)
  $fondo = New-Object System.Drawing.Drawing2D.GraphicsPath
  $fondo.AddArc($x0, $x0, 2*$raggio, 2*$raggio, 180, 90)
  $fondo.AddArc($x0 + $larg - 2*$raggio, $x0, 2*$raggio, 2*$raggio, 270, 90)
  $fondo.AddArc($x0 + $larg - 2*$raggio, $x0 + $larg - 2*$raggio, 2*$raggio, 2*$raggio, 0, 90)
  $fondo.AddArc($x0, $x0 + $larg - 2*$raggio, 2*$raggio, 2*$raggio, 90, 90)
  $fondo.CloseFigure()
  $bianco = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $g.FillPath($bianco, $fondo)
  $img = [System.Drawing.Image]::FromFile((Resolve-Path $Logo).Path)
  $pad = [int]($Px * 0.75)
  $lx = $x0 + $pad
  $ll = $larg - 2 * $pad
  $lr = [int]($ll * 0.2)
  $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
  $clip.AddArc($lx, $lx, 2*$lr, 2*$lr, 180, 90)
  $clip.AddArc($lx + $ll - 2*$lr, $lx, 2*$lr, 2*$lr, 270, 90)
  $clip.AddArc($lx + $ll - 2*$lr, $lx + $ll - 2*$lr, 2*$lr, 2*$lr, 0, 90)
  $clip.AddArc($lx, $lx + $ll - 2*$lr, 2*$lr, 2*$lr, 90, 90)
  $clip.CloseFigure()
  $g.SetClip($clip)
  $g.DrawImage($img, $lx, $lx, $ll, $ll)
  $g.ResetClip()
  $img.Dispose()
}
$g.Dispose()
$bmp.Save($Uscita, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output ("creato " + $Uscita + " (" + $dim + "x" + $dim + ")")
