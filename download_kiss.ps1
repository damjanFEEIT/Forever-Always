$ErrorActionPreference = "Stop"
$res = Invoke-RestMethod -Uri 'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=kiss%20sound%20filetype:audio&utf8=&format=json' -UserAgent "AntigravityBot/1.0"
$title = $res.query.search[0].title
$encodedTitle = [uri]::EscapeDataString($title)
$res2 = Invoke-RestMethod -Uri "https://commons.wikimedia.org/w/api.php?action=query&titles=$encodedTitle&prop=imageinfo&iiprop=url&format=json" -UserAgent "AntigravityBot/1.0"

foreach ($page in $res2.query.pages.psobject.properties) {
    if ($page.Name -ne "Item") {
        $url = $page.Value.imageinfo[0].url
        Invoke-WebRequest -Uri $url -OutFile ".\public\kiss-sound.ogg" -UserAgent "AntigravityBot/1.0"
        Write-Output "Downloaded $url"
        break
    }
}
