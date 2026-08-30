# =============================================================
#  BRAIN TIME - generatore delle icone
#
#  L'icona non e' disegnata a mano: e' generata da qui, cosi'
#  si puo' rifare uguale e si puo' cambiare senza ridisegnare.
#  La geometria e' la stessa di icona.svg (quello resta la
#  versione vettoriale, usata dal manifest della app).
#
#  Un cervello stilizzato, non anatomico: due meta' simmetriche
#  di curve pulite, con dentro linee che sembrano un circuito.
#  Le scintille intorno danno il tocco "magico".
#
#  Uso:  powershell -ExecutionPolicy Bypass -File strumenti\genera-icone.ps1
# =============================================================

Add-Type -AssemblyName System.Drawing

$radice = Split-Path -Parent $PSScriptRoot
$fuori  = Join-Path $radice 'icone'
if (-not (Test-Path $fuori)) { New-Item -ItemType Directory -Path $fuori | Out-Null }

$L = 512   # lato di lavoro: si disegna grande e si rimpicciolisce

# ---------- colori ----------
$blFondo1 = [System.Drawing.Color]::FromArgb(255, 27, 63, 150)
$blFondo2 = [System.Drawing.Color]::FromArgb(255, 10, 31, 82)
$blChiaro = [System.Drawing.Color]::FromArgb(255,143,228,255)
$blMedio  = [System.Drawing.Color]::FromArgb(255, 47,127,224)
$blScuro  = [System.Drawing.Color]::FromArgb(255, 10, 31, 82)
$oro      = [System.Drawing.Color]::FromArgb(255,255,212, 94)

# ---------- il profilo di mezzo cervello ----------
# Gli stessi punti di icona.svg, gia' resi assoluti.
# Ogni riga e' una curva di Bezier: c1, c2, arrivo.
$curve = @(
  @(210,108, 172,134, 164,170),
  @(134,176, 112,200, 112,230),
  @(112,250, 122,268, 138,278),
  @(132,290, 130,302, 134,314),
  @(142,340, 168,356, 196,352),
  @(208,374, 230,388, 256,388)
)

function Nuovo-Lobo([bool]$specchiato) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $x = { param($v) if ($specchiato) { 512 - $v } else { $v } }
  $px = & $x 256; $py = 108
  foreach ($c in $curve) {
    $p.AddBezier(
      $px, $py,
      (& $x $c[0]), $c[1],
      (& $x $c[2]), $c[3],
      (& $x $c[4]), $c[5])
    $px = & $x $c[4]; $py = $c[5]
  }
  $p.CloseFigure()
  return $p
}

# ---------- una scintilla a quattro punte ----------
function Punti-Scintilla([double]$cx, [double]$cy, [double]$r) {
  $i = $r * 0.30
  return @(
    (New-Object System.Drawing.PointF($cx,      ($cy - $r))),
    (New-Object System.Drawing.PointF(($cx + $i), ($cy - $i))),
    (New-Object System.Drawing.PointF(($cx + $r), $cy)),
    (New-Object System.Drawing.PointF(($cx + $i), ($cy + $i))),
    (New-Object System.Drawing.PointF($cx,      ($cy + $r))),
    (New-Object System.Drawing.PointF(($cx - $i), ($cy + $i))),
    (New-Object System.Drawing.PointF(($cx - $r), $cy)),
    (New-Object System.Drawing.PointF(($cx - $i), ($cy - $i)))
  )
}

# ---------- disegno ----------
$bmp = New-Object System.Drawing.Bitmap($L, $L)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.InterpolationMode = 'HighQualityBicubic'
$g.PixelOffsetMode = 'HighQuality'

# sfondo: rettangolo con gli angoli tondi
$raggio = 112
$sf = New-Object System.Drawing.Drawing2D.GraphicsPath
$sf.AddArc(0, 0, ($raggio*2), ($raggio*2), 180, 90)
$sf.AddArc(($L-$raggio*2), 0, ($raggio*2), ($raggio*2), 270, 90)
$sf.AddArc(($L-$raggio*2), ($L-$raggio*2), ($raggio*2), ($raggio*2), 0, 90)
$sf.AddArc(0, ($L-$raggio*2), ($raggio*2), ($raggio*2), 90, 90)
$sf.CloseFigure()
$rettFondo = New-Object System.Drawing.Rectangle(0, 0, $L, $L)
$pennFondo = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $rettFondo, $blFondo1, $blFondo2, 90.0)
$g.FillPath($pennFondo, $sf)

# alone dietro al cervello
for ($k = 5; $k -ge 1; $k--) {
  $a = 12 * $k
  $col = [System.Drawing.Color]::FromArgb(14, 124, 212, 255)
  $b = New-Object System.Drawing.SolidBrush($col)
  $g.FillEllipse($b, (256 - 150 - $a), (238 - 150 - $a), (300 + $a*2), (300 + $a*2))
  $b.Dispose()
}

$sinistro = Nuovo-Lobo $false
$destro   = Nuovo-Lobo $true

# riempimento dei due lobi
$rettLobo = New-Object System.Drawing.Rectangle(100, 100, 312, 300)
$pennLobo = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $rettLobo, $blChiaro, $blMedio, 45.0)
$g.FillPath($pennLobo, $sinistro)
$g.FillPath($pennLobo, $destro)

# contorno
$penna = New-Object System.Drawing.Pen($blScuro, 11)
$penna.LineJoin = 'Round'
$g.DrawPath($penna, $sinistro)
$g.DrawPath($penna, $destro)
# il solco centrale
$penna2 = New-Object System.Drawing.Pen($blScuro, 13)
$penna2.StartCap = 'Round'; $penna2.EndCap = 'Round'
$g.DrawLine($penna2, 256, 112, 256, 384)

# circuito interno: i "pensieri"
$pennaCirc = New-Object System.Drawing.Pen(
  [System.Drawing.Color]::FromArgb(140, 10, 42, 99), 10)
$pennaCirc.StartCap = 'Round'; $pennaCirc.EndCap = 'Round'
$serpentine = @(
  @(212,168, 186,196, 206,230, 170,248),
  @(206,262, 180,286, 190,318, 214,330),
  @(300,168, 326,196, 306,230, 342,248),
  @(306,262, 332,286, 322,318, 298,330)
)
foreach ($s in $serpentine) {
  $pts = @(
    (New-Object System.Drawing.PointF($s[0], $s[1])),
    (New-Object System.Drawing.PointF($s[2], $s[3])),
    (New-Object System.Drawing.PointF($s[4], $s[5])),
    (New-Object System.Drawing.PointF($s[6], $s[7]))
  )
  $g.DrawCurve($pennaCirc, $pts, 0.6)
}

# i nodi del circuito
$bNodo = New-Object System.Drawing.SolidBrush(
  [System.Drawing.Color]::FromArgb(255, 234, 247, 255))
foreach ($n in @(@(170,248,10), @(214,330,9), @(342,248,10), @(298,330,9),
                 @(186,182,8), @(326,182,8))) {
  $g.FillEllipse($bNodo, ($n[0]-$n[2]), ($n[1]-$n[2]), ($n[2]*2), ($n[2]*2))
}

# scintille
$bOro = New-Object System.Drawing.SolidBrush($oro)
foreach ($s in @(@(104,128,35), @(416,152,27), @(392,386,23), @(112,372,19))) {
  $g.FillPolygon($bOro, (Punti-Scintilla $s[0] $s[1] $s[2]))
}
$bBianco = New-Object System.Drawing.SolidBrush(
  [System.Drawing.Color]::FromArgb(230, 255, 255, 255))
foreach ($d in @(@(150,96,5), @(368,112,4), @(86,290,4),
                 @(430,300,5), @(330,424,4), @(176,420,4))) {
  $g.FillEllipse($bBianco, ($d[0]-$d[2]), ($d[1]-$d[2]), ($d[2]*2), ($d[2]*2))
}

$g.Dispose()

# ---------- salvataggio nelle varie misure ----------
$misure = @(16, 32, 48, 64, 128, 180, 192, 256, 512)
$fatti = @{}
foreach ($m in $misure) {
  $piccola = New-Object System.Drawing.Bitmap($m, $m)
  $gp = [System.Drawing.Graphics]::FromImage($piccola)
  $gp.InterpolationMode = 'HighQualityBicubic'
  $gp.PixelOffsetMode = 'HighQuality'
  $gp.SmoothingMode = 'AntiAlias'
  $gp.DrawImage($bmp, 0, 0, $m, $m)
  $gp.Dispose()
  $fatti[$m] = $piccola
  if ($m -in @(180, 192, 512)) {
    $piccola.Save((Join-Path $fuori "icona-$m.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output ("  icone/icona-$m.png")
  }
}
$fatti[256].Save((Join-Path $radice 'brain-time.png'), [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "  brain-time.png"

# ---------- l'ICO per il collegamento sul desktop ----------
# Servono le voci DIB classiche: System.Drawing (e certe viste di
# Explorer) non sanno leggere un ICO che contenga solo il PNG.
function Bytes-DIB([System.Drawing.Bitmap]$b) {
  $w = $b.Width; $h = $b.Height
  $ms = New-Object System.IO.MemoryStream
  $bw = New-Object System.IO.BinaryWriter($ms)
  $bw.Write([uint32]40); $bw.Write([int32]$w); $bw.Write([int32]($h*2))
  $bw.Write([uint16]1); $bw.Write([uint16]32); $bw.Write([uint32]0)
  $bw.Write([uint32]($w*$h*4)); $bw.Write([int32]0); $bw.Write([int32]0)
  $bw.Write([uint32]0); $bw.Write([uint32]0)
  for ($y = $h - 1; $y -ge 0; $y--) {
    for ($x = 0; $x -lt $w; $x++) {
      $c = $b.GetPixel($x, $y)
      $bw.Write([byte]$c.B); $bw.Write([byte]$c.G)
      $bw.Write([byte]$c.R); $bw.Write([byte]$c.A)
    }
  }
  $rigaMask = [math]::Ceiling($w / 32.0) * 4
  $bw.Write((New-Object byte[] ($rigaMask * $h)))
  $bw.Flush()
  $out = $ms.ToArray(); $bw.Dispose(); $ms.Dispose()
  return $out
}

$voci = @(16, 32, 48, 64, 128, 256)
$dati = @()
foreach ($m in $voci) {
  if ($m -eq 256) {
    $ms = New-Object System.IO.MemoryStream
    $fatti[256].Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $dati += ,$ms.ToArray()
    $ms.Dispose()
  } else {
    $dati += ,(Bytes-DIB $fatti[$m])
  }
}

$icoPath = Join-Path $radice 'brain-time.ico'
$fs = [System.IO.File]::Create($icoPath)
$bw = New-Object System.IO.BinaryWriter($fs)
$bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]$voci.Count)
$offset = 6 + 16 * $voci.Count
for ($i = 0; $i -lt $voci.Count; $i++) {
  $m = $voci[$i]
  if ($m -ge 256) { $bDim = [byte]0 } else { $bDim = [byte]$m }
  $bw.Write($bDim); $bw.Write($bDim); $bw.Write([byte]0); $bw.Write([byte]0)
  $bw.Write([uint16]1); $bw.Write([uint16]32)
  $bw.Write([uint32]$dati[$i].Length); $bw.Write([uint32]$offset)
  $offset += $dati[$i].Length
}
foreach ($d in $dati) { $bw.Write($d) }
$bw.Flush(); $bw.Dispose(); $fs.Dispose()
Write-Output "  brain-time.ico"

foreach ($k in $fatti.Keys) { $fatti[$k].Dispose() }
$bmp.Dispose()
Write-Output "Fatto."
