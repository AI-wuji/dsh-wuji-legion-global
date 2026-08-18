param(
  [string]$DshHome = $(if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }),
  [string]$Profile = 'desktop'
)
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$source = Join-Path $repo 'packages\wuji-host'
$target = Join-Path $DshHome "profiles\node_modules\@wuji\dsh-wuji-host"
if (-not (Test-Path (Join-Path $source 'package.json'))) { throw "wuji-host package not found: $source" }
New-Item -ItemType Directory -Force -Path $target | Out-Null
Copy-Item (Join-Path $source 'package.json') $target -Force
if (-not (Test-Path (Join-Path $target 'lib'))) { New-Item -ItemType Directory -Force -Path (Join-Path $target 'lib') | Out-Null }
Copy-Item (Join-Path $source 'lib\*') (Join-Path $target 'lib') -Recurse -Force
# 若旧安装残留 test/，将其清掉（测试不回生产安装目录）
if (Test-Path (Join-Path $target 'test')) { Remove-Item -LiteralPath (Join-Path $target 'test') -Recurse -Force -ErrorAction SilentlyContinue }
$patch = Join-Path $DshHome "profiles\$Profile\cordis.patch.yml"
if (-not (Test-Path $patch)) { throw "profile patch not found: $patch" }
$text = Get-Content $patch -Raw -Encoding UTF8
if ($text -notmatch "@wuji/dsh-wuji-host") { throw "profile patch does not load @wuji/dsh-wuji-host" }
Write-Host "Installed @wuji/dsh-wuji-host to $target"
Write-Host "Restart DSH to load the new host package."
